import type { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { linkSalesChannelsToApiKeyWorkflow } from "@medusajs/medusa/core-flows"

export default async function linkPublishableKey({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any

  const apiKeyModule = container.resolve(Modules.API_KEY) as any
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL) as any

  const tokenArgIdx = process.argv.findIndex((a) => a === "--token")
  const token = tokenArgIdx !== -1 ? process.argv[tokenArgIdx + 1] : process.env.PUBLISHABLE_KEY

  if (!token) {
    logger.error(
      "Missing publishable key. Pass with --token <key> or set PUBLISHABLE_KEY env variable."
    )
    process.exit(1)
  }

  logger.info(`Linking publishable key to sales channel…`)

  // Find the publishable API key by token or title
  const [apiKeys] = await apiKeyModule.listAndCountApiKeys({
    type: "publishable",
  })

  const publishable = apiKeys.find((k: any) => k.token === token) || apiKeys.find((k: any) => k.title === token)

  if (!publishable) {
    logger.error("Publishable API key not found. Ensure the key exists and is of type 'publishable'.")
    process.exit(1)
  }

  // Find a sales channel – prefer "Default Sales Channel"
  const [channels] = await salesChannelModule.listAndCountSalesChannels()
  if (!channels.length) {
    logger.error("No sales channels found. Create one first (e.g., 'Default Sales Channel').")
    process.exit(1)
  }

  const targetChannel =
    channels.find((c: any) => c.name?.toLowerCase() === "default sales channel") || channels[0]

  logger.info(
    `Linking API key '${publishable.title || publishable.id}' to sales channel '${targetChannel.name}' (${targetChannel.id})`
  )

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishable.id,
      add: [targetChannel.id],
    },
  })

  logger.info("✅ Publishable key linked to sales channel successfully.")
}


