import { type Request, type Response, Router } from 'express'
import { z } from 'zod'
import { config, requestUrl, verifyUrl } from '../config.js'
import { log } from '../logger.js'
import type { InitiateRequest, PaymentItem, VerifyRequest } from '../types.js'
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

const verifySchema = z.object({
  authority: z.string().min(1),
  Status: z.string().min(1),
  resource_id: z.string().min(1),
})

const buildDescription = (items: PaymentItem[]) => items.map((i) => `${i.title}${i.quantity > 1 ? ` (${i.quantity})` : ''}`).join('، ')
const totalAmount = (items: PaymentItem[]) => Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0))
const resourceId = () => `pay_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`

export function createPaymentRouter(store: PaymentStore) {
  const router = Router()

  router.post('/payment/initiate', async (req: Request, res: Response) => {
    const parsed = initiateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.message } })

    const body = parsed.data as InitiateRequest
    const amount = totalAmount(body.items)
    const description = body.description || buildDescription(body.items)
    const rid = resourceId()
    const callbackUrl = `${config.callbackBaseUrl}${config.callbackPath}?resource_id=${encodeURIComponent(rid)}`

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
      log('info', 'zarinpal.request', { providerBody: { ...providerBody, merchant_id: providerBody.merchant_id ? '***' : '' } })
      const response = await fetch(requestUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(providerBody) })
      const json = await response.json().catch(() => ({} as any))
      log('info', 'zarinpal.request.response', { json })
      if (!response.ok || !json?.data?.authority) {
        return res.status(502).json({ success: false, error: { code: 'PROVIDER_ERROR', message: json?.errors?.[0]?.message || 'Failed to create payment authority' } })
      }
      authority = json.data.authority
      payment_url = `${config.sandbox ? 'https://sandbox.zarinpal.com/pg/checkout/start/' : 'https://www.zarinpal.com/pg/checkout/start/'}${authority}`
    } else {
      log('info', 'initiate.test_mode', { resource_id: rid })
    }

    const now = new Date().toISOString()
    store.upsert({
      resource_id: rid, authority, amount, currency_code: 'irr', status: 'pending', description,
      customer_email: body.customer_email, customer_phone: body.customer_phone, items: body.items,
      payment_url, metadata: body.metadata, created_at: now, updated_at: now,
    })

    return res.json({
      success: true,
      payment: { resource_id: rid, authority, payment_url, amount, currency_code: 'irr', status: 'pending' },
      order: { resource_id: rid, total: amount, currency_code: 'irr', item_count: body.items.length, items: body.items },
    })
  })

  router.post('/payment/verify', async (req: Request, res: Response) => {
    const parsed = verifySchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.message } })
    const body = parsed.data as VerifyRequest

    const record = store.get(body.resource_id)
    if (!record) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Payment resource not found' } })
    if (record.status === 'verified') {
      return res.json({ success: true, message: 'Payment already verified', data: { ref_id: record.ref_id, card_pan: record.card_pan, amount: record.amount, currency_code: 'irr', status: 'authorized', resource_id: record.resource_id, idempotent: true } })
    }
    if (body.Status !== 'OK') {
      record.status = 'cancelled'; record.updated_at = new Date().toISOString(); store.upsert(record)
      return res.status(400).json({ success: false, error: { code: 'PAYMENT_CANCELLED', message: 'Payment was cancelled by user' }, data: { status: 'cancelled', resource_id: record.resource_id } })
    }
    if (record.authority !== body.authority) {
      return res.status(409).json({ success: false, error: { code: 'AUTHORITY_MISMATCH', message: 'authority does not match resource_id' } })
    }

    let code = 100
    let refId = `TEST_REF_${record.resource_id}`
    let cardPan = '000000******0000'
    let message = 'Success'

    if (!config.testMode) {
      const providerBody = { merchant_id: config.merchantId, authority: body.authority, amount: record.amount }
      log('info', 'zarinpal.verify', { providerBody: { ...providerBody, merchant_id: providerBody.merchant_id ? '***' : '' } })
      const response = await fetch(verifyUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(providerBody) })
      const json = await response.json().catch(() => ({} as any))
      log('info', 'zarinpal.verify.response', { json })
      code = Number(json?.data?.code)
      if (![100, 101].includes(code)) {
        record.status = 'failed'; record.updated_at = new Date().toISOString(); record.provider_code = code; record.provider_message = json?.data?.message
        store.upsert(record)
        return res.status(400).json({ success: false, error: { code: 'VERIFY_FAILED', message: json?.data?.message || 'Verification failed' }, provider_code: code })
      }
      refId = String(json?.data?.ref_id || '')
      cardPan = String(json?.data?.card_pan || '')
      message = String(json?.data?.message || 'Verified')
    } else {
      log('info', 'verify.test_mode', { resource_id: record.resource_id, authority: body.authority })
      code = body.authority.startsWith('TESTAUTH_') ? 100 : 101
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
      message: code === 101 ? 'Payment already verified' : 'Payment verified successfully',
      data: { ref_id: refId, card_pan: cardPan, amount: record.amount, currency_code: 'irr', status: 'authorized', resource_id: record.resource_id, provider_code: code },
    })
  })

  router.get('/payment/status/:resourceId', (req: Request, res: Response) => {
    const record = store.get(req.params.resourceId)
    if (!record) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Payment resource not found' } })
    res.json({ success: true, payment: record })
  })

  return router
}
