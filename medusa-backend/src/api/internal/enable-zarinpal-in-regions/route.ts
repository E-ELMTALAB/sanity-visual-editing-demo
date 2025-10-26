import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

/**
 * POST /internal/enable-zarinpal-in-regions
 * Optional body: { region_ids?: string[] }
 *
 * Ensures the payment provider 'zarinpal' is enabled for the specified regions,
 * or all regions if none specified.
 *
 * Secured by INTERNAL_ADMIN_SECRET if set.
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const requiredSecret = process.env.INTERNAL_ADMIN_SECRET
    if (requiredSecret) {
      const provided = (req.headers["x-internal-secret"] as string) || ""
      if (!provided || provided !== requiredSecret) {
        res.status(401).json({ error: "Unauthorized: invalid internal secret" })
        return
      }
    }

    const body = (req.body as any) || {}
    const targetRegionIds: string[] | undefined = Array.isArray(body.region_ids) ? body.region_ids : undefined

    const regionModule: any = req.scope.resolve(Modules.REGION)

    const [regions] = await regionModule.listAndCountRegions()
    const toProcess = targetRegionIds?.length ? regions.filter((r: any) => targetRegionIds.includes(r.id)) : regions

    const updated: string[] = []
    const skipped: string[] = []

    for (const region of toProcess) {
      const providers: string[] = Array.isArray((region as any).payment_providers)
        ? (region as any).payment_providers
        : []

      console.log(`[enable-zarinpal] Region ${region.id} current providers:`, providers)

      // Medusa creates provider IDs as "pp_{provider}_{id}" format
      // We need to check for the full provider ID
      const zarinpalProviderId = "pp_zarinpal_zarinpal"
      
      if (providers.includes(zarinpalProviderId)) {
        console.log(`[enable-zarinpal] Region ${region.id} already has zarinpal provider`)
        skipped.push(region.id)
        continue
      }

      console.log(`[enable-zarinpal] Adding ${zarinpalProviderId} to region ${region.id}`)
      const nextProviders = [...providers, zarinpalProviderId]
      await regionModule.updateRegions(region.id, {
        payment_providers: nextProviders,
      })
      updated.push(region.id)
    }

    console.log(`[enable-zarinpal] Summary: updated=${updated.length}, skipped=${skipped.length}`)

    res.status(200).json({ success: true, updated, skipped })
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Internal error" })
  }
}


