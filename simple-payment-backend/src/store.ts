import fs from 'node:fs'
import path from 'node:path'
import type { PaymentRecord } from './types.js'

export class PaymentStore {
  private map = new Map<string, PaymentRecord>()
  constructor(private filePath: string) {
    this.load()
  }

  private load() {
    const abs = path.resolve(this.filePath)
    if (!fs.existsSync(abs)) return
    const raw = fs.readFileSync(abs, 'utf8')
    if (!raw) return
    const data: PaymentRecord[] = JSON.parse(raw)
    data.forEach((r) => this.map.set(r.resource_id, r))
  }

  private save() {
    const abs = path.resolve(this.filePath)
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    fs.writeFileSync(abs, JSON.stringify(Array.from(this.map.values()), null, 2))
  }

  upsert(record: PaymentRecord) {
    this.map.set(record.resource_id, record)
    this.save()
  }

  get(resourceId: string) {
    return this.map.get(resourceId)
  }

  findByAuthority(authority: string) {
    return Array.from(this.map.values()).find((r) => r.authority === authority)
  }
}
