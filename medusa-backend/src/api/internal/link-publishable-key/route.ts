import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { linkSalesChannelsToApiKeyWorkflow } from "@medusajs/medusa/core-flows"

/**
 * POST /internal/link-publishable-key
 * Body: { token?: string }
 *
 * Links a publishable API key to a sales channel to enable Store APIs.
 *
 * Security:
 * - If INTERNAL_ADMIN_SECRET env is set, request must include header:
 *   x-internal-secret: <INTERNAL_ADMIN_SECRET>
 * - If not set, the route is open (intended for temporary testing only).
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

    const { token } = (req.body as any) || {}
    const publishableToken = token || process.env.PUBLISHABLE_KEY
    if (!publishableToken) {
      res.status(400).json({ error: "Missing token in body and PUBLISHABLE_KEY env variable is not set" })
      return
    }

    const apiKeyModule: any = req.scope.resolve(Modules.API_KEY)
    const salesChannelModule: any = req.scope.resolve(Modules.SALES_CHANNEL)

    const [apiKeys] = await apiKeyModule.listAndCountApiKeys({ type: "publishable" })
    const publishable = apiKeys.find((k: any) => k.token === publishableToken) || apiKeys.find((k: any) => k.title === publishableToken)
    if (!publishable) {
      res.status(404).json({ error: "Publishable API key not found" })
      return
    }

    const [channels] = await salesChannelModule.listAndCountSalesChannels()
    if (!channels?.length) {
      res.status(400).json({ error: "No sales channels found. Create one first." })
      return
    }
    const target = channels.find((c: any) => (c.name || "").toLowerCase() === "default sales channel") || channels[0]

    await linkSalesChannelsToApiKeyWorkflow(req.scope).run({
      input: {
        id: publishable.id,
        add: [target.id],
      },
    })

    res.status(200).json({
      success: true,
      publishable_key_id: publishable.id,
      sales_channel_id: target.id,
      sales_channel_name: target.name,
    })
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Internal error" })
  }
}


