export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'placeholder'
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2023-06-21'

export function validateSanityConfig() {
  const missingVars = []
  
  if (!import.meta.env.VITE_SANITY_PROJECT_ID || import.meta.env.VITE_SANITY_PROJECT_ID === 'placeholder') {
    missingVars.push('VITE_SANITY_PROJECT_ID')
  }
  
  if (missingVars.length > 0) {
    console.warn(
      `⚠️ Missing Sanity configuration: ${missingVars.join(', ')}\n` +
      'Please add these to your .env file.'
    )
    return false
  }
  
  return true
}

