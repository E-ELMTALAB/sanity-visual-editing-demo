# Simple Payment Backend

Minimal standalone backend for Zarinpal-compatible payment initiation/verification.

## Setup

```bash
cd simple-payment-backend
npm install
cp .env.example .env
npm run dev
```

## Environment variables
- `PORT` server port
- `PAYMENT_TEST_MODE=true|false` deterministic mock mode
- `ZARINPAL_MERCHANT_ID` merchant id for live mode
- `ZARINPAL_SANDBOX=true|false`
- `PAYMENT_CALLBACK_BASE_URL` frontend origin for callback
- `PAYMENT_CALLBACK_PATH` callback path (default `/payment/callback`)
- `STORE_FILE` JSON file persistence path
- `CORS_ORIGINS` comma-separated origins

## API

### Health
```bash
curl http://localhost:8080/health
```

### Initiate
```bash
curl -X POST http://localhost:8080/payment/initiate \
  -H 'Content-Type: application/json' \
  -d '{"items":[{"title":"Course","price":100000,"quantity":1}],"customer_email":"a@b.com"}'
```

### Verify
```bash
curl -X POST http://localhost:8080/payment/verify \
  -H 'Content-Type: application/json' \
  -d '{"authority":"TESTAUTH_x","Status":"OK","resource_id":"pay_x"}'
```

### Status
```bash
curl http://localhost:8080/payment/status/pay_x
```

## Test mode
When `PAYMENT_TEST_MODE=true`:
- `/payment/initiate` returns deterministic test authority (`TESTAUTH_*`) and mock URL.
- `/payment/verify` maps test authorities to deterministic success behavior.

## Frontend integration
Set:
- `NEXT_PUBLIC_PAYMENT_PROVIDER_MODE=simple_backend`
- `NEXT_PUBLIC_SIMPLE_PAYMENT_BACKEND_URL=http://localhost:8080`

Legacy modes still supported:
- `medusa_legacy`
- `frontend_direct_test`
