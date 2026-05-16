export function makeRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function log(level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...meta,
  }
  console[level](JSON.stringify(payload))
}
