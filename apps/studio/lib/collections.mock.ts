export type CollectionKey = 'chatbot-ai'

export interface CollectionFilterDefinition {
  categories?: string[]
  tags?: string[]
}

export interface CollectionMetadataFields {
  seo_title?: string
  seo_description?: string
  og_image?: string
}

export interface CollectionDocument extends CollectionMetadataFields {
  key: CollectionKey
  title: string
  slug: string
  hero_title: string
  hero_subtitle: string
  cover_image?: string
  filter_definition: CollectionFilterDefinition
  faq?: {
    question: string
    answer: string
  }[]
}

export interface CollectionPlan {
  id: string
  name: string
  price: number
  currency: string
  billing_cycle: 'monthly' | 'annual' | 'lifetime' | 'student'
  highlight?: boolean
}

export interface CollectionProduct {
  id: string
  slug: string
  title: string
  brand: string
  short_description: string
  rating_avg: number
  rating_count: number
  logo: string
  hero_image?: string
  badge_features: string[]
  plans: CollectionPlan[]
  price_range?: {
    min: number
    max: number
    currency: string
  }
  tags: string[]
  category: string
  is_new?: boolean
}

interface CollectionMock extends CollectionDocument {
  products: CollectionProduct[]
}

export const collectionMockData: Record<CollectionKey, CollectionMock> = {
  'chatbot-ai': {
    key: 'chatbot-ai',
    title: 'Chatbot AIs',
    slug: 'chatbot-ai',
    hero_title: 'Chatbot AIs',
    hero_subtitle:
      'Compare GPT, Gemini, Claude, Grok and more—plans, features, and perks in one place.',
    cover_image: '/images/collections/chatbot-hero.svg',
    seo_title: 'Chatbot AI Platforms Compared',
    seo_description:
      'Explore pricing, plans, and standout capabilities across the leading conversational AI assistants in one curated collection.',
    og_image: '/images/collections/chatbot-hero.svg',
    filter_definition: {
      categories: ['chatbot'],
      tags: ['chatbot-ai'],
    },
    faq: [
      {
        question: 'How do chatbot plans differ?',
        answer:
          'Plans typically vary based on usage limits, access to advanced models, and collaboration features such as team workspaces or admin controls.',
      },
      {
        question: 'Which models support images?',
        answer:
          'GPT-4o, Claude 3.5, and Gemini support multimodal prompts today. Check plan details for image understanding or generation capabilities.',
      },
      {
        question: 'Do these include team seats?',
        answer:
          'Team or enterprise plans bundle centralized billing and shared workspaces. Look for “Team” or “Enterprise” badges on each product card.',
      },
    ],
    products: [
      {
        id: 'chatgpt-plus',
        slug: 'chatgpt-plus',
        title: 'ChatGPT',
        brand: 'OpenAI',
        short_description:
          'GPT-4o and o1-preview access with advanced data analysis, voice, vision, and custom GPT integrations.',
        rating_avg: 4.8,
        rating_count: 12450,
        logo: '/images/products/openai-logo.svg',
        hero_image: '/images/products/chatgpt-hero.svg',
        badge_features: ['Advanced reasoning', 'Web browsing', 'GPTs ecosystem'],
        plans: [
          {
            id: 'plus',
            name: 'Plus',
            price: 20,
            currency: 'EUR',
            billing_cycle: 'monthly',
            highlight: true,
          },
          {
            id: 'team',
            name: 'Team',
            price: 25,
            currency: 'EUR',
            billing_cycle: 'monthly',
          },
        ],
        price_range: { min: 20, max: 25, currency: 'EUR' },
        tags: ['chatbot-ai', 'image-generation', 'api-access'],
        category: 'chatbot',
        is_new: false,
      },
      {
        id: 'gemini-advanced',
        slug: 'gemini-advanced',
        title: 'Gemini',
        brand: 'Google',
        short_description:
          'Access Gemini 1.5 Pro with native Google Workspace integrations, live data, and app extensions.',
        rating_avg: 4.5,
        rating_count: 8421,
        logo: '/images/products/google-gemini.svg',
        hero_image: '/images/products/gemini-hero.svg',
        badge_features: ['Image generation', 'Workspace add-ons', 'API access'],
        plans: [
          {
            id: 'advanced',
            name: 'Advanced',
            price: 19,
            currency: 'EUR',
            billing_cycle: 'monthly',
          },
          {
            id: 'business',
            name: 'Business',
            price: 29,
            currency: 'EUR',
            billing_cycle: 'monthly',
          },
        ],
        price_range: { min: 19, max: 29, currency: 'EUR' },
        tags: ['chatbot-ai', 'web-browsing', 'team'],
        category: 'chatbot',
      },
      {
        id: 'claude-pro',
        slug: 'claude-pro',
        title: 'Claude',
        brand: 'Anthropic',
        short_description:
          'Claude 3.5 Sonnet with projects, artifacts, and long context for knowledge workflows and teams.',
        rating_avg: 4.7,
        rating_count: 6540,
        logo: '/images/products/anthropic.svg',
        hero_image: '/images/products/claude-hero.svg',
        badge_features: ['Advanced reasoning', 'Artifacts', 'Team spaces'],
        plans: [
          {
            id: 'pro',
            name: 'Pro',
            price: 22,
            currency: 'EUR',
            billing_cycle: 'monthly',
          },
          {
            id: 'team',
            name: 'Team',
            price: 28,
            currency: 'EUR',
            billing_cycle: 'monthly',
          },
        ],
        price_range: { min: 22, max: 28, currency: 'EUR' },
        tags: ['chatbot-ai', 'advanced-reasoning', 'team'],
        category: 'chatbot',
      },
      {
        id: 'grok-premium',
        slug: 'grok',
        title: 'Grok',
        brand: 'xAI',
        short_description:
          'Real-time social graph understanding and humor-forward interactions powered by the Grok-1.5 series.',
        rating_avg: 4.2,
        rating_count: 2835,
        logo: '/images/products/grok.svg',
        hero_image: '/images/products/grok-hero.svg',
        badge_features: ['Real-time X data', 'Web browsing'],
        plans: [
          {
            id: 'premium',
            name: 'Premium',
            price: 8,
            currency: 'EUR',
            billing_cycle: 'monthly',
          },
          {
            id: 'premium-plus',
            name: 'Premium+ team',
            price: 16,
            currency: 'EUR',
            billing_cycle: 'monthly',
          },
        ],
        price_range: { min: 8, max: 16, currency: 'EUR' },
        tags: ['chatbot-ai', 'web-browsing', 'team'],
        category: 'chatbot',
        is_new: true,
      },
      {
        id: 'perplexity-pro',
        slug: 'perplexity-ai',
        title: 'Perplexity',
        brand: 'Perplexity',
        short_description:
          'Cited answers with focus mode, file uploads, and conversational research copilots for analysts.',
        rating_avg: 4.6,
        rating_count: 5190,
        logo: '/images/products/perplexity.svg',
        hero_image: '/images/products/perplexity-hero.svg',
        badge_features: ['Web browsing', 'Citation mode', 'Pro search'],
        plans: [
          {
            id: 'pro',
            name: 'Pro',
            price: 20,
            currency: 'EUR',
            billing_cycle: 'monthly',
          },
          {
            id: 'pro-annual',
            name: 'Pro Annual',
            price: 200,
            currency: 'EUR',
            billing_cycle: 'annual',
          },
        ],
        price_range: { min: 20, max: 200, currency: 'EUR' },
        tags: ['chatbot-ai', 'web-browsing', 'api-access'],
        category: 'chatbot',
      },
      {
        id: 'pi-ai',
        slug: 'pi',
        title: 'Pi',
        brand: 'Inflection AI',
        short_description:
          'Empathetic coach tuned for reflective conversations with optional voice calling and memory.',
        rating_avg: 4.4,
        rating_count: 2180,
        logo: '/images/products/pi.svg',
        hero_image: '/images/products/pi-hero.svg',
        badge_features: ['Voice', 'Memory'],
        plans: [
          {
            id: 'plus',
            name: 'Plus',
            price: 12,
            currency: 'EUR',
            billing_cycle: 'monthly',
          },
        ],
        price_range: { min: 12, max: 12, currency: 'EUR' },
        tags: ['chatbot-ai'],
        category: 'chatbot',
      },
      {
        id: 'meta-ai',
        slug: 'meta-ai',
        title: 'Meta AI',
        brand: 'Meta',
        short_description:
          'Free AI assistant across WhatsApp, Instagram, and web with image generation and search.',
        rating_avg: 4.1,
        rating_count: 7912,
        logo: '/images/products/meta.svg',
        hero_image: '/images/products/meta-hero.svg',
        badge_features: ['Image generation', 'Multi-platform'],
        plans: [
          {
            id: 'free',
            name: 'Free',
            price: 0,
            currency: 'EUR',
            billing_cycle: 'monthly',
            highlight: true,
          },
        ],
        price_range: { min: 0, max: 0, currency: 'EUR' },
        tags: ['chatbot-ai', 'image-generation'],
        category: 'chatbot',
      },
      {
        id: 'mistral-le-chat',
        slug: 'mistral-le-chat',
        title: 'Le Chat',
        brand: 'Mistral AI',
        short_description:
          'Fast multilingual assistant with Mistral Large and live code interpreter for builders.',
        rating_avg: 4.3,
        rating_count: 1650,
        logo: '/images/products/mistral.svg',
        hero_image: '/images/products/mistral-hero.svg',
        badge_features: ['Multilingual', 'Code interpreter'],
        plans: [
          {
            id: 'pro',
            name: 'Pro',
            price: 17,
            currency: 'EUR',
            billing_cycle: 'monthly',
          },
        ],
        price_range: { min: 17, max: 17, currency: 'EUR' },
        tags: ['chatbot-ai', 'api-access'],
        category: 'chatbot',
      },
    ],
  },
}

export function getMockCollection(slug: string) {
  return collectionMockData[slug as CollectionKey]
}
