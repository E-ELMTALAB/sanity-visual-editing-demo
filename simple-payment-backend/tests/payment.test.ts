import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { PaymentStore } from '../src/store.js'

test('store upsert/get and findByAuthority', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'paytest-'))
  const store = new PaymentStore(path.join(dir, 'payments.json'))
  store.upsert({
    resource_id: 'r1', authority: 'a1', amount: 1000, currency_code: 'irr', status: 'pending',
    description: 'd', items: [{ title: 'x', price: 1000, quantity: 1 }], payment_url: 'u', created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  })
  assert.equal(store.get('r1')?.authority, 'a1')
  assert.equal(store.findByAuthority('a1')?.resource_id, 'r1')

  const storeReloaded = new PaymentStore(path.join(dir, 'payments.json'))
  assert.equal(storeReloaded.get('r1')?.authority, 'a1')

  rmSync(dir, { recursive: true, force: true })
})
