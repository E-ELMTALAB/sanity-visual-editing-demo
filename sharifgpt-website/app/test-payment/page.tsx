"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TestPaymentPage() {
  const [proxyStatus, setProxyStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')
  const [initStatus, setInitStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')
  const [cartId, setCartId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [verifyData, setVerifyData] = useState<any>(null)

  useEffect(() => {
    try {
      const pending = localStorage.getItem('pending_resource_id')
      if (pending) setCartId(pending)
    } catch {}
  }, [])

  const testProxy = async () => {
    setProxyStatus('loading')
    setError(null)
    try {
      const res = await fetch('/api/payment/test')
      const json = await res.json()
      if (json.success) setProxyStatus('ok')
      else { setProxyStatus('err'); setError(json.error || 'Proxy failed') }
    } catch (e: any) {
      setProxyStatus('err')
      setError(e?.message || 'Proxy failed')
    }
  }

  const initiate = async () => {
    setInitStatus('loading')
    setError(null)
    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ id: 1, title: 'Test Product', price: 100000, quantity: 1 }],
          customer_email: 'test@example.com',
          customer_phone: '+989123456789'
        })
      })
      const json = await res.json()
      if (json.success) {
        setInitStatus('ok')
        const id = json?.cart?.id || json?.payment?.resource_id || json?.resourceId || json?.data?.cart_id
        if (id) {
          try { localStorage.setItem('pending_resource_id', id) } catch {}
          setCartId(id)
        }
      } else {
        setInitStatus('err')
        setError(json.error || json.message || `Init failed: ${res.status} ${res.statusText}`)
      }
    } catch (e: any) {
      setInitStatus('err')
      setError(e?.message || 'Init failed')
    }
  }

  const simulateCallback = () => {
    setError(null)
    if (!cartId) { setError('Cart ID لازم است'); return }
    const backend = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://backend-production-ea59.up.railway.app'
    const url = `${backend}/store/zarinpal/callback?Authority=TEST_${Date.now()}&Status=OK&resource_id=${encodeURIComponent(cartId)}`
    window.open(url, '_blank')
  }

  const directVerify = async () => {
    setError(null)
    setVerifyData(null)
    if (!cartId) { setError('Cart ID لازم است'); return }
    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authority: `TEST_${Date.now()}`, Status: 'OK', cart_id: cartId })
      })
      const json = await res.json()
      if (res.ok && json.success) setVerifyData(json)
      else setError(json.error || 'Verify failed')
    } catch (e: any) {
      setError(e?.message || 'Verify failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow rounded p-6 space-y-6">
        <h1 className="text-xl font-bold">تست فرآیند پس از پرداخت</h1>

        <div className="space-y-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={testProxy} disabled={proxyStatus==='loading'}>
            {proxyStatus==='loading' ? 'در حال تست...' : 'تست اتصال به بک‌اند'}
          </button>
          <div className="text-sm text-gray-600">وضعیت: {proxyStatus}</div>
        </div>

        <div className="space-y-2">
          <button className="px-4 py-2 border rounded" onClick={initiate} disabled={initStatus==='loading'}>
            {initStatus==='loading' ? 'در حال ایجاد...' : 'ایجاد پرداخت تستی'}
          </button>
          <div className="text-sm text-gray-600">وضعیت: {initStatus}</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Cart ID</label>
          <input className="w-full border rounded px-3 py-2" value={cartId} onChange={(e) => setCartId(e.target.value)} placeholder="cart_..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={simulateCallback}>شبیه‌سازی Callback</button>
          <button className="px-4 py-2 border rounded" onClick={directVerify}>تأیید مستقیم (بدون Callback)</button>
        </div>

        {verifyData && (
          <div className="bg-gray-50 rounded p-3 text-sm">
            <div>ref_id: {verifyData?.data?.ref_id}</div>
            <div>amount: {verifyData?.data?.amount} {verifyData?.data?.currency_code}</div>
            <div>items: {verifyData?.data?.items?.length || 0}</div>
            <div>status: {verifyData?.data?.status}</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 rounded p-3 text-sm">{error}</div>
        )}

        <div className="pt-2">
          <Link className="text-blue-600 underline" href="/checkout">رفتن به تسویه حساب</Link>
        </div>
      </div>
    </div>
  )
}


