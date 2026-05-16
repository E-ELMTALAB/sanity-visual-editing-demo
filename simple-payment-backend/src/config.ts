import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: Number(process.env.PORT || 8080),
  testMode: process.env.PAYMENT_TEST_MODE === 'true',
  merchantId: process.env.ZARINPAL_MERCHANT_ID || '',
  sandbox: process.env.ZARINPAL_SANDBOX !== 'false',
  callbackBaseUrl: process.env.PAYMENT_CALLBACK_BASE_URL || 'http://localhost:3000',
  callbackPath: process.env.PAYMENT_CALLBACK_PATH || '/payment/callback',
  storeFile: process.env.STORE_FILE || './data/payments.json',
  corsOrigins: (process.env.CORS_ORIGINS || '*').split(',').map((s) => s.trim()),
  corsCredentials: process.env.CORS_CREDENTIALS === 'true',
}

export const requestUrl = config.sandbox
  ? 'https://sandbox.zarinpal.com/pg/v4/payment/request.json'
  : 'https://api.zarinpal.com/pg/v4/payment/request.json'

export const verifyUrl = config.sandbox
  ? 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json'
  : 'https://api.zarinpal.com/pg/v4/payment/verify.json'
