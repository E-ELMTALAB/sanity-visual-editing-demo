import { type Request, type Response, Router } from 'express'
import { config } from '../config.js'

export const healthRouter = Router()

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    mode: config.testMode ? 'test' : 'live',
    sandbox: config.sandbox,
  })
})
