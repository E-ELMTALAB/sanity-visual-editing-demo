import { createClient } from '@sanity/client'

import {
  SANITY_API_TOKEN,
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
} from './env.server'

export const sanityServerClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false,
  token: SANITY_API_TOKEN,
})

