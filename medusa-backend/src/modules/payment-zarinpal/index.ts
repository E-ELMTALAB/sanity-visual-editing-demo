import { ModuleProviderExports } from '@medusajs/framework/types'
import ZarinpalProviderService from './service'

const services = [ZarinpalProviderService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport


