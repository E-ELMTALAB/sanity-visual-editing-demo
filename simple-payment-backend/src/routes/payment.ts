import { type Request, type Response, Router } from 'express'
import { z } from 'zod'
import { config, requestUrl, verifyUrl } from '../config.js'
import { log } from '../logger.js'
import type { InitiateRequest, PaymentItem, PaymentRecord } from '../types.js'
import { PaymentStore } from '../store.js'

const initiateSchema = z.object({
  items: z.array(z.object({
    id: z.union([z.number(), z.string()]).optional(),
    title: z.string().min(1),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
  })).min(1),
  customer_email: z.string().email().optional(),
  customer_phone: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

const mask = (v?: string) => (v ? `${v.slice(0, 4)}***${v.slice(-2)}` : '')
const buildDescription = (items: PaymentItem[]) => items.map((i) => `${i.title}${i.quantity > 1 ? ` (${i.quantity})` : ''}`).join('، ')
const totalAmount = (items: PaymentItem[]) => Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0))
const resourceId = () => `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

function normalizeInitiateBody(raw: any): InitiateRequest {
  if (raw?.items) {
    return {
      items: raw.items,
      customer_email: raw.customer_email ?? raw.customer?.email ?? raw.email,
      customer_phone: raw.customer_phone ?? raw.customer?.phone ?? raw.phone ?? raw.mobile,
      description: raw.description,
      metadata: raw.metadata,
    }
  }

  const cartItems = Array.isArray(raw?.cartItems) ? raw.cartItems : Array.isArray(raw?.line_items) ? raw.line_items : []
  const items: PaymentItem[] = cartItems.map((it: any) => ({
    id: it.id ?? it.variant_id ?? it.product_id,
    title: it.title ?? it.name ?? 'item',
    price: Number(it.price ?? it.unit_price ?? 0),
    quantity: Number(it.quantity ?? 1),
  }))

  return {
    items,
    customer_email: raw?.customer_email ?? raw?.email ?? raw?.customer?.email,
    customer_phone: raw?.customer_phone ?? raw?.phone ?? raw?.mobile ?? raw?.customer?.phone,
    description: raw?.description,
    metadata: {
      ...(raw?.metadata || {}),
      product_ids: cartItems.map((i: any) => i.product_id).filter(Boolean),
      variant_ids: cartItems.map((i: any) => i.variant_id).filter(Boolean),
    },
  }
}

function normalizeVerifyBody(raw: any): { authority: string; status: string; resource_id?: string } {
  return {
    authority: String(raw?.authority ?? raw?.Authority ?? ''),
    status: String(raw?.status ?? raw?.Status ?? ''),
    resource_id: raw?.resource_id ?? raw?.resourceId ?? raw?.order_id ?? raw?.tracking_code,
  }
}

function initiateCompatResponse(record: PaymentRecord) {
  return {
    success: true,
    payment_url: record.payment_url,
    url: record.payment_url,
    redirect_url: record.payment_url,
    authority: record.authority,
    resource_id: record.resource_id,
    order_id: record.resource_id,
    tracking_code: record.resource_id,
    payment: {
      resource_id: record.resource_id,
      authority: record.authority,
      payment_url: record.payment_url,
      amount: record.amount,
      currency_code: 'irr',
      status: record.status,
    },
    order: {
      resource_id: record.resource_id,
      total: record.amount,
      currency_code: 'irr',
      item_count: record.items.length,
      items: record.items,
    },
  }
}

export function createPaymentRouter(store: PaymentStore) {
  const router = Router()

  const initiateHandler = async (req: Request, res: Response) => {
    try {
      log('info', 'payment.initiate.incoming', { bodyKeys: Object.keys(req.body || {}) })
      const normalized = normalizeInitiateBody(req.body)
      const parsed = initiateSchema.safeParse(normalized)
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: 'Invalid payment request', error_code: 'INVALID_PAYMENT_REQUEST', details: parsed.error.issues })
      }

      const body = parsed.data as InitiateRequest
      const amount = totalAmount(body.items)
      const description = body.description || buildDescription(body.items)
      const rid = resourceId()
      const callbackUrl = `${config.callbackBaseUrl}${config.callbackPath}?resource_id=${encodeURIComponent(rid)}`
      log('info', 'payment.initiate.normalized', { rid, amount, callbackUrl, email: mask(body.customer_email), phone: mask(body.customer_phone) })

      let authority = `TESTAUTH_${rid}`
      let payment_url = `${config.callbackBaseUrl}/test-gateway/${authority}`

      if (!config.testMode) {
        const providerBody = {
          merchant_id: config.merchantId,
          amount,
          callback_url: callbackUrl,
          description,
          metadata: { email: body.customer_email, mobile: body.customer_phone },
          mobile: body.customer_phone,
        }
        log('info', 'zarinpal.request', { merchant: mask(config.merchantId), amount, callback_url: callbackUrl })
        const response = await fetch(requestUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(providerBody) })
        const json = await response.json().catch(() => ({} as any))
        log('info', 'zarinpal.request.response', { status: response.status, code: json?.data?.code, hasAuthority: !!json?.data?.authority })
        if (!response.ok || !json?.data?.authority) {
          return res.status(502).json({ success: false, message: 'Provider error', error_code: 'PROVIDER_ERROR', details: json?.errors || json?.data || null })
        }
        authority = json.data.authority
        payment_url = `${config.sandbox ? 'https://sandbox.zarinpal.com/pg/checkout/start/' : 'https://www.zarinpal.com/pg/checkout/start/'}${authority}`
      }

      const now = new Date().toISOString()
      const record: PaymentRecord = {
        resource_id: rid, authority, amount, currency_code: 'irr', status: 'pending', description,
        customer_email: body.customer_email, customer_phone: body.customer_phone, items: body.items,
        payment_url, metadata: body.metadata, created_at: now, updated_at: now,
      }
      store.upsert(record)
      log('info', 'payment.initiate.success', { rid, authority: mask(authority), payment_url })

      return res.json(initiateCompatResponse(record))
    } catch (error: any) {
      log('error', 'payment.initiate.error', { message: error?.message })
      return res.status(500).json({ success: false, message: 'Internal server error', error_code: 'INTERNAL_ERROR' })
    }
  }

  const verifyHandler = async (req: Request, res: Response) => {
    try {
      log('info', 'payment.verify.incoming', { bodyKeys: Object.keys(req.body || {}) })
      const normalized = normalizeVerifyBody(req.body)
      if (!normalized.authority || !normalized.status) {
        return res.status(400).json({ success: false, verified: false, message: 'Invalid verify request', error_code: 'INVALID_VERIFY_REQUEST' })
      }

      let record = normalized.resource_id ? store.get(normalized.resource_id) : undefined
      if (!record) record = store.findByAuthority(normalized.authority)
      if (!record) return res.status(404).json({ success: false, verified: false, message: 'Payment resource not found', error_code: 'NOT_FOUND' })

      if (record.status === 'verified') {
        return res.json({
          success: true, verified: true, message: 'Payment already verified',
          ref_id: record.ref_id || '', tracking_code: record.resource_id, order_id: record.resource_id, resource_id: record.resource_id,
          data: { ref_id: record.ref_id || '', card_pan: record.card_pan || '', amount: record.amount, currency_code: 'irr', status: 'authorized', resource_id: record.resource_id, provider_code: record.provider_code ?? 101 },
        })
      }

      if (normalized.status !== 'OK') {
        record.status = 'cancelled'; record.updated_at = new Date().toISOString(); store.upsert(record)
        return res.status(400).json({ success: false, verified: false, message: 'Payment was cancelled by user', resource_id: record.resource_id, order_id: record.resource_id, tracking_code: record.resource_id })
      }

      if (record.authority !== normalized.authority) {
        return res.status(409).json({ success: false, verified: false, message: 'authority does not match resource_id', error_code: 'AUTHORITY_MISMATCH' })
      }

      let code = 100
      let refId = `TEST_REF_${record.resource_id}`
      let cardPan = '000000******0000'
      let message = 'Success'

      if (!config.testMode) {
        const providerBody = { merchant_id: config.merchantId, authority: normalized.authority, amount: record.amount }
        log('info', 'zarinpal.verify', { merchant: mask(config.merchantId), authority: mask(normalized.authority), amount: record.amount })
        const response = await fetch(verifyUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(providerBody) })
        const json = await response.json().catch(() => ({} as any))
        code = Number(json?.data?.code)
        log('info', 'zarinpal.verify.response', { status: response.status, code })
        if (![100, 101].includes(code)) {
          record.status = 'failed'; record.updated_at = new Date().toISOString(); record.provider_code = code; record.provider_message = json?.data?.message
          store.upsert(record)
          return res.status(400).json({ success: false, verified: false, message: json?.data?.message || 'Verification failed', resource_id: record.resource_id, order_id: record.resource_id, tracking_code: record.resource_id })
        }
        refId = String(json?.data?.ref_id || '')
        cardPan = String(json?.data?.card_pan || '')
        message = String(json?.data?.message || 'Verified')
      }

      record.status = 'verified'
      record.ref_id = refId
      record.card_pan = cardPan
      record.provider_code = code
      record.provider_message = message
      record.updated_at = new Date().toISOString()
      store.upsert(record)

      return res.json({
        success: true,
        verified: true,
        message: 'Payment verified successfully',
        ref_id: refId,
        tracking_code: record.resource_id,
        order_id: record.resource_id,
        resource_id: record.resource_id,
        data: { ref_id: refId, card_pan: cardPan, amount: record.amount, currency_code: 'irr', status: 'authorized', resource_id: record.resource_id, provider_code: code },
      })
    } catch (error: any) {
      log('error', 'payment.verify.error', { message: error?.message })
      return res.status(500).json({ success: false, verified: false, message: 'Internal server error', error_code: 'INTERNAL_ERROR' })
    }
  }

  router.options('*', (_req: Request, res: Response) => res.status(204).send())

  router.post('/payment/initiate', initiateHandler)
  router.post('/api/payment/initiate', initiateHandler)
  router.post('/api/checkout', initiateHandler)
  router.post('/store/cart/initiate-payment', initiateHandler)
  router.post('/medusa/store/cart/initiate-payment', initiateHandler)

  router.post('/payment/verify', verifyHandler)
  router.post('/api/payment/verify', verifyHandler)

  router.get('/payment/status/:resourceId', (req: Request, res: Response) => {
    const record = store.get(req.params.resourceId)
    if (!record) return res.status(404).json({ success: false, message: 'Payment resource not found', error_code: 'NOT_FOUND' })
    res.json({ success: true, payment: record })
  })

  return router
}
