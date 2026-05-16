import cors from 'cors'
import express from 'express'
import { config } from './config.js'
import { log, makeRequestId } from './logger.js'
import { createPaymentRouter } from './routes/payment.js'
import { healthRouter } from './routes/health.js'
import { PaymentStore } from './store.js'

const app = express()
const store = new PaymentStore(config.storeFile)

app.use(express.json())
app.use(cors({
  origin: config.corsOrigins.includes('*') ? true : config.corsOrigins,
  credentials: config.corsCredentials,
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}))

app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
  const requestId = makeRequestId()
  ;(req as any).requestId = requestId
  log('info', 'incoming_request', { requestId, method: req.method, path: req.path })
  next()
})

app.use(healthRouter)
app.use(createPaymentRouter(store))

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  log('error', 'unhandled_error', { error: err.message })
  res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
})

app.listen(config.port, () => {
  log('info', 'server_started', { port: config.port, testMode: config.testMode, sandbox: config.sandbox })
})
