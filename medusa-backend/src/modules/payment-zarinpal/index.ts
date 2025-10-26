import { ModuleProviderExports } from '@medusajs/framework/types'
import ZarinpalProviderService from './service'

console.log('[ZARINPAL-INDEX] Module loading started')
console.log('[ZARINPAL-INDEX] Importing ZarinpalProviderService...')

const services = [ZarinpalProviderService]

console.log('[ZARINPAL-INDEX] Services array created:', services.map(s => s.identifier || s.name))

const providerExport: ModuleProviderExports = {
  services,
}

console.log('[ZARINPAL-INDEX] Provider export configured with', providerExport.services.length, 'service(s)')
console.log('[ZARINPAL-INDEX] Exporting module...')

export default providerExport



