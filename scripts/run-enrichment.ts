import 'dotenv/config'

import { runEnrichment } from './enrichment/enrichProducts'

const parseLimit = (argv: string[]): number | undefined => {
  for (const arg of argv) {
    if (arg.startsWith('--limit=')) {
      const value = Number(arg.split('=')[1])
      if (Number.isFinite(value)) {
        return value
      }
    } else if (/^\d+$/.test(arg)) {
      return Number(arg)
    }
  }

  return undefined
}

async function main() {
  const limit = parseLimit(process.argv.slice(2))

  try {
    await runEnrichment(limit)
    process.exit(0)
  } catch (error) {
    console.error('Failed to run enrichment.', error)
    process.exit(1)
  }
}

main()




