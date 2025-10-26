import { ModuleProvider, Modules } from '@medusajs/framework/utils'
import ZarinpalProviderService from './service'

const services = [ZarinpalProviderService]

export default ModuleProvider(Modules.PAYMENT, {
  services,
})



