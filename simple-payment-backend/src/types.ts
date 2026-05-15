export type PaymentState = 'pending' | 'verified' | 'failed' | 'cancelled'

export interface PaymentItem {
  id?: number | string
  title: string
  price: number
  quantity: number
}

export interface InitiateRequest {
  items: PaymentItem[]
  customer_email?: string
  customer_phone?: string
  description?: string
  metadata?: Record<string, unknown>
}

export interface VerifyRequest {
  authority: string
  Status: string
  resource_id: string
}

export interface PaymentRecord {
  resource_id: string
  authority: string
  amount: number
  currency_code: 'irr'
  status: PaymentState
  description: string
  customer_email?: string
  customer_phone?: string
  items: PaymentItem[]
  payment_url: string
  metadata?: Record<string, unknown>
  ref_id?: string
  card_pan?: string
  provider_code?: number
  provider_message?: string
  created_at: string
  updated_at: string
}
