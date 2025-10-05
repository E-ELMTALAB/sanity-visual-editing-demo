import { MetadataRoute } from 'next'
import { getClient } from 'lib/sanity.client'
import { groq } from 'next-sanity'

const defaultRobots: MetadataRoute.Robots = {
  rules: [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/studio/', '/_next/', '/admin/', '/login', '/cart', '/checkout'],
    },
  ],
  sitemap: 'https://sharifgpt.com/sitemap.xml',
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  try {
    const client = getClient()
    const settings = await client.fetch<{ robotsTxt?: string } | null>(
      groq`*[_type == "settings"][0]{ robotsTxt }`
    )

    // If custom robots.txt content exists in Sanity, parse and return it
    if (settings?.robotsTxt) {
      // Parse custom robots.txt content
      const lines = settings.robotsTxt.split('\n')
      const rules: any[] = []
      let currentRule: any = { userAgent: '*', allow: [], disallow: [] }
      let sitemap: string | undefined

      for (const line of lines) {
        const trimmedLine = line.trim()
        
        // Skip empty lines and comments
        if (!trimmedLine || trimmedLine.startsWith('#')) continue

        // Parse User-agent
        if (trimmedLine.toLowerCase().startsWith('user-agent:')) {
          if (currentRule.userAgent && (currentRule.allow.length > 0 || currentRule.disallow.length > 0)) {
            rules.push({ ...currentRule })
          }
          currentRule = {
            userAgent: trimmedLine.substring(11).trim(),
            allow: [],
            disallow: [],
          }
        }
        // Parse Allow
        else if (trimmedLine.toLowerCase().startsWith('allow:')) {
          const path = trimmedLine.substring(6).trim()
          if (path) currentRule.allow.push(path)
        }
        // Parse Disallow
        else if (trimmedLine.toLowerCase().startsWith('disallow:')) {
          const path = trimmedLine.substring(9).trim()
          if (path) currentRule.disallow.push(path)
        }
        // Parse Sitemap
        else if (trimmedLine.toLowerCase().startsWith('sitemap:')) {
          sitemap = trimmedLine.substring(8).trim()
        }
      }

      // Add the last rule
      if (currentRule.userAgent && (currentRule.allow.length > 0 || currentRule.disallow.length > 0)) {
        rules.push(currentRule)
      }

      // Clean up empty arrays
      const cleanedRules = rules.map(rule => {
        const cleaned: any = { userAgent: rule.userAgent }
        if (rule.allow.length > 0) cleaned.allow = rule.allow
        if (rule.disallow.length > 0) cleaned.disallow = rule.disallow
        return cleaned
      })

      return {
        rules: cleanedRules.length > 0 ? cleanedRules : defaultRobots.rules,
        sitemap: sitemap || defaultRobots.sitemap,
      }
    }

    // Return default robots if no custom content
    return defaultRobots
  } catch (error) {
    console.error('Error fetching robots.txt from Sanity:', error)
    return defaultRobots
  }
}
