# Medusa.js Integration Plan for SharifGPT E-commerce Platform

## Executive Summary

This document outlines a comprehensive plan to integrate Medusa.js as the e-commerce backend for the SharifGPT platform while maintaining Sanity CMS for content management. The integration will establish a clean separation of concerns where:

- **Sanity**: Handles content (descriptions, images, SEO, blog posts, courses content)
- **Medusa**: Handles commerce (pricing, inventory, discounts, cart, checkout, payments, orders)

## Table of Contents

1. [Current Architecture Analysis](#1-current-architecture-analysis)
2. [Target Architecture](#2-target-architecture)
3. [Data Separation Strategy](#3-data-separation-strategy)
4. [Product Synchronization Strategy](#4-product-synchronization-strategy)
5. [Frontend Integration Points](#5-frontend-integration-points)
6. [Payment Gateway Integration](#6-payment-gateway-integration)
7. [Cart & Checkout Flow](#7-cart--checkout-flow)
8. [Customer Management](#8-customer-management)
9. [Order Management](#9-order-management)
10. [Discount & Promotion Engine](#10-discount--promotion-engine)
11. [Inventory Management](#11-inventory-management)
12. [Digital Product Delivery](#12-digital-product-delivery)
13. [Multi-Currency Support](#13-multi-currency-support)
14. [Admin Dashboard Strategy](#14-admin-dashboard-strategy)
15. [Migration Strategy](#15-migration-strategy)
16. [Implementation Phases](#16-implementation-phases)
17. [API Architecture](#17-api-architecture)
18. [Security Considerations](#18-security-considerations)
19. [Performance Optimization](#19-performance-optimization)
20. [Testing Strategy](#20-testing-strategy)
21. [Monitoring & Analytics](#21-monitoring--analytics)
22. [Backup & Disaster Recovery](#22-backup--disaster-recovery)
23. [Scalability Considerations](#23-scalability-considerations)
24. [Cost Analysis](#24-cost-analysis)
25. [Alternative Approaches](#25-alternative-approaches)

---

## 1. Current Architecture Analysis

### Current State

**Technology Stack:**
- **Frontend**: Next.js 14 (App Router) with TypeScript
- **CMS**: Sanity CMS (content + commerce data)
- **Styling**: TailwindCSS
- **State Management**: React Context API (cart-context.tsx)
- **Storage**: localStorage for cart persistence
- **Deployment**: Vercel

**Current Data Flow:**
```
User → Next.js Frontend → Sanity API → Sanity Content Lake
                ↓
        localStorage (cart)
                ↓
     Manual checkout process (no payment integration)
```

### Key Pain Points

1. **No Real Payment Processing**: Checkout page exists but has no actual payment gateway
2. **No Backend Logic**: All pricing, discounts managed manually in Sanity
3. **No Order Management**: No order history, fulfillment tracking, or customer accounts
4. **Limited Cart Functionality**: Basic localStorage cart with no server-side validation
5. **No Inventory Management**: Stock status is a boolean field with no real tracking
6. **No Discount Engine**: Discounts are hardcoded percentages, not rule-based
7. **No Customer Data**: No customer profiles, purchase history, or preferences
8. **Manual Product Management**: All product data including prices must be manually updated
9. **No Digital Product Delivery**: No system to deliver digital products post-purchase

### Current Product Schema Issues

The current Sanity product schema mixes content and commerce:
- `price`, `originalPrice`, `discountPercentage` (should be in Medusa)
- `inStock` (should be real inventory in Medusa)
- `options` (should be variants in Medusa)
- `name`, `description`, `images`, `features` (should stay in Sanity)

---

## 2. Target Architecture

### Desired State

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                    │
│  ┌────────────────────┐         ┌────────────────────┐     │
│  │   Product Pages    │         │  Checkout Flow     │     │
│  │   (Content +       │         │  (Commerce)        │     │
│  │    Commerce)       │         │                    │     │
│  └────────────────────┘         └────────────────────┘     │
│           ↓                              ↓                   │
└───────────┼──────────────────────────────┼──────────────────┘
            ↓                              ↓
    ┌───────────────┐            ┌─────────────────┐
    │  Sanity CMS   │            │  Medusa Backend │
    │  (Content)    │←──Sync────→│  (Commerce)     │
    └───────────────┘            └─────────────────┘
            ↓                              ↓
    Content Data                  ┌───────────────────┐
    • Descriptions                │  Payment Gateway  │
    • Images                      │  • Stripe         │
    • SEO                         │  • Razorpay       │
    • Blog Posts                  │  • PayPal         │
    • Course Content              └───────────────────┘
                                           ↓
                                  PostgreSQL/Redis
                                  • Products
                                  • Prices
                                  • Inventory
                                  • Orders
                                  • Customers
                                  • Cart Sessions
```

### Technology Stack (Target)

**Backend:**
- **Medusa.js v2**: E-commerce engine
- **PostgreSQL**: Primary database for Medusa
- **Redis**: Session management, caching, queues
- **Node.js v18+**: Runtime environment

**Integrations:**
- **Payment Gateways**: Stripe, Razorpay (Iran-friendly), PayPal
- **Email Service**: SendGrid/Resend for transactional emails
- **Storage**: AWS S3/Cloudflare R2 for digital product files
- **CDN**: Cloudflare for static assets

---

## 3. Data Separation Strategy

### Principle: Single Source of Truth

Each piece of data should have ONE authoritative source:

### Data in Sanity (Content Management)

**Product Content:**
```typescript
// Sanity Product Schema (Content Only)
{
  _id: string                    // Product ID
  _type: 'product'
  
  // Content Fields
  name: string                   // Product name
  slug: { current: string }      // URL slug
  description: text              // Short description
  longDescription: portableText  // Rich content description
  
  // Media
  featuredImage: image           // Main product image
  gallery: image[]               // Additional images
  videoUrl?: string              // Product video
  
  // Content Details
  features: string[]             // Feature list for marketing
  specifications: object[]       // Technical specs (display only)
  useCases: portableText         // How to use content
  
  // Taxonomy
  category: string               // Primary category
  tags: string[]                 // Search/filter tags
  collectionType: string         // Collection membership
  
  // SEO
  seo: {
    metaTitle: string
    metaDescription: string
    canonicalUrl: url
    structuredData: text
    openGraphImage: image
    // ... other SEO fields
  }
  
  // Relations
  relatedBlogs: reference[]      // Related blog posts
  relatedCourses: reference[]    // Related courses
  
  // Sync Metadata
  medusaProductId: string        // Reference to Medusa product
  lastSyncedAt: datetime         // Last sync timestamp
}
```

### Data in Medusa (Commerce Management)

**Product Commerce Data:**
```typescript
// Medusa Product (Commerce Only)
{
  id: string                     // Medusa product ID
  
  // Commerce Fields
  variants: [
    {
      id: string
      title: string              // e.g., "1 Month", "6 Months"
      sku: string               // Unique identifier
      prices: [
        {
          amount: number         // Price in smallest unit (cents)
          currency_code: string  // IRR, USD, EUR
          region_id: string      // Price per region
        }
      ]
      inventory_quantity: number // Stock level
      manage_inventory: boolean  // Track inventory?
      allow_backorder: boolean   // Allow overselling?
      options: [
        { option_id: string, value: string }
      ]
    }
  ]
  
  // Pricing
  discountable: boolean          // Can apply discounts?
  
  // Product Type
  type: {
    value: 'digital' | 'physical' | 'subscription'
  }
  
  // Status
  status: 'draft' | 'published' | 'archived'
  
  // Inventory
  manage_inventory: boolean
  
  // Metadata
  metadata: {
    sanityId: string             // Reference to Sanity
    isDigital: boolean
    deliveryMethod: string       // 'email' | 'download' | 'api'
    requiresAccount: boolean
    subscriptionPeriod?: string
  }
  
  // Weight/Dimensions (not relevant for digital)
  weight?: number
  length?: number
  width?: number
  height?: number
}
```

### Synchronization Fields

Both systems maintain references to each other:
- Sanity stores `medusaProductId`
- Medusa stores `sanityId` in metadata

This bidirectional reference enables efficient lookups and sync operations.

---

## 4. Product Synchronization Strategy

### Why Synchronization is Needed

Products need to exist in both systems:
- **Sanity**: For content editors to manage descriptions, images, SEO
- **Medusa**: For commerce operations (pricing, inventory, orders)

### Synchronization Approaches

#### Approach 1: Sanity as Master (RECOMMENDED)

**Flow:**
```
Content Editor → Sanity Studio → Webhook → Sync Service → Medusa API
```

**Process:**
1. Editor creates/updates product in Sanity
2. Sanity webhook triggers on publish
3. Sync service receives webhook payload
4. Sync service checks if product exists in Medusa
5. If exists: Update Medusa product
6. If not: Create new Medusa product
7. Store Medusa product ID back in Sanity

**Advantages:**
- Content editors work in familiar environment
- Single point of truth for product existence
- Better content management workflow

**Implementation:**
```typescript
// app/api/webhooks/sanity-product-sync/route.ts
export async function POST(request: Request) {
  const payload = await request.json()
  
  // Verify webhook signature
  const isValid = verifySanityWebhook(payload)
  if (!isValid) return new Response('Unauthorized', { status: 401 })
  
  const { _id: sanityId, name, slug, medusaProductId } = payload
  
  // Check if product exists in Medusa
  if (medusaProductId) {
    // Update existing product
    await medusaClient.products.update(medusaProductId, {
      title: name,
      handle: slug.current,
      metadata: { sanityId }
    })
  } else {
    // Create new product
    const medusaProduct = await medusaClient.products.create({
      title: name,
      handle: slug.current,
      status: 'draft',
      metadata: { sanityId }
    })
    
    // Update Sanity with Medusa ID
    await sanityClient.patch(sanityId).set({
      medusaProductId: medusaProduct.id,
      lastSyncedAt: new Date().toISOString()
    }).commit()
  }
  
  return new Response('Synced', { status: 200 })
}
```

#### Approach 2: Medusa as Master

Commerce team manages products in Medusa admin, content team fills in Sanity details.

**Advantages:**
- Better for inventory-heavy businesses
- Commerce team has full control

**Disadvantages:**
- Requires two separate workflows
- Content team needs to manually create Sanity entries

#### Approach 3: Dual Entry (NOT RECOMMENDED)

Products created independently in both systems.

**Disadvantages:**
- Data inconsistency
- Manual reconciliation required
- Error-prone

### Recommended: Sanity as Master

For your use case (digital products, content-heavy), **Approach 1** is best because:
1. Content editors already familiar with Sanity
2. Rich content creation capabilities
3. Visual editing experience
4. Automated sync to Medusa for commerce operations

### Sync Service Architecture

```typescript
// lib/services/product-sync.service.ts
export class ProductSyncService {
  
  async syncProductToMedusa(sanityProduct: SanityProduct) {
    const medusaProduct = this.transformToMedusaFormat(sanityProduct)
    
    if (sanityProduct.medusaProductId) {
      return await this.updateMedusaProduct(
        sanityProduct.medusaProductId,
        medusaProduct
      )
    } else {
      return await this.createMedusaProduct(medusaProduct)
    }
  }
  
  async syncPricesToMedusa(sanityProduct: SanityProduct) {
    // Update variant prices based on regions
    const variants = await this.getMedusaVariants(
      sanityProduct.medusaProductId
    )
    
    for (const variant of variants) {
      await this.updateVariantPrices(variant.id, {
        // Price logic here
      })
    }
  }
  
  private transformToMedusaFormat(sanityProduct: SanityProduct) {
    return {
      title: sanityProduct.name,
      handle: sanityProduct.slug.current,
      description: sanityProduct.description,
      metadata: {
        sanityId: sanityProduct._id,
        isDigital: true,
        // ... other metadata
      }
    }
  }
}
```

### Webhook Configuration

**Sanity Webhook Setup:**
1. Go to Sanity project settings
2. Add webhook: `https://yourdomain.com/api/webhooks/sanity-product-sync`
3. Select triggers: `Create`, `Update`, `Delete`
4. Filter: `_type == "product"`
5. Add secret token for verification

### Conflict Resolution

**What if both systems are updated simultaneously?**

**Strategy:**
- Sanity = source of truth for content
- Medusa = source of truth for prices/inventory
- Timestamp-based conflict resolution
- Admin dashboard to review and resolve conflicts

---

## 5. Frontend Integration Points

### Product Listing Page (`/products`)

**Current State:**
- Fetches all products from Sanity
- Displays price, discount from Sanity

**Target State:**
- Fetch content from Sanity
- Fetch pricing/availability from Medusa
- Merge data client-side or server-side

**Implementation:**

```typescript
// app/products/page.tsx (Server Component)
import { getClient } from 'lib/sanity.client'
import { productsListQuery } from 'lib/sanity.queries'
import { medusaClient } from 'lib/medusa.client'

export default async function ProductsPage() {
  // Fetch content from Sanity
  const sanityProducts = await getClient().fetch(productsListQuery)
  
  // Fetch commerce data from Medusa
  const medusaProducts = await medusaClient.products.list({
    limit: 100,
    expand: 'variants,variants.prices'
  })
  
  // Merge data
  const products = sanityProducts.map(sanityProduct => {
    const medusaProduct = medusaProducts.products.find(
      mp => mp.metadata.sanityId === sanityProduct._id
    )
    
    return {
      // Content from Sanity
      id: sanityProduct._id,
      name: sanityProduct.name,
      description: sanityProduct.description,
      image: sanityProduct.image,
      slug: sanityProduct.slug.current,
      
      // Commerce from Medusa
      price: medusaProduct?.variants[0]?.prices[0]?.amount / 100,
      currency: medusaProduct?.variants[0]?.prices[0]?.currency_code,
      inStock: (medusaProduct?.variants[0]?.inventory_quantity ?? 0) > 0,
      variantId: medusaProduct?.variants[0]?.id,
      
      // Merged
      available: medusaProduct?.status === 'published'
    }
  })
  
  return <ProductsPageClient products={products} />
}
```

### Product Detail Page (`/products/[slug]`)

**Responsibilities:**
1. Display product content (Sanity)
2. Show current price and availability (Medusa)
3. Handle variant selection (Medusa variants)
4. Add to cart (Medusa cart)

**Implementation:**

```typescript
// app/products/[slug]/page.tsx
export default async function ProductPage({ params }: { params: { slug: string } }) {
  // Fetch from Sanity
  const sanityProduct = await getClient().fetch(productDocBySlugQuery, { slug: params.slug })
  
  // Fetch from Medusa using stored ID
  const medusaProduct = await medusaClient.products.retrieve(
    sanityProduct.medusaProductId,
    { expand: 'variants,variants.prices,variants.options' }
  )
  
  return (
    <ProductDetailClient
      content={sanityProduct}        // Content from Sanity
      commerce={medusaProduct}       // Commerce from Medusa
    />
  )
}
```

### Cart Integration

**Replace localStorage cart with Medusa cart:**

```typescript
// contexts/medusa-cart-context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { medusaClient } from 'lib/medusa.client'

interface CartContextType {
  cart: Cart | null
  addItem: (variantId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>
  loading: boolean
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export function MedusaCartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Initialize cart on mount
  useEffect(() => {
    initializeCart()
  }, [])
  
  async function initializeCart() {
    const cartId = localStorage.getItem('medusa_cart_id')
    
    if (cartId) {
      try {
        const { cart } = await medusaClient.carts.retrieve(cartId)
        setCart(cart)
      } catch (error) {
        // Cart not found or expired, create new
        await createNewCart()
      }
    } else {
      await createNewCart()
    }
  }
  
  async function createNewCart() {
    const { cart } = await medusaClient.carts.create({
      region_id: 'default-region-id',  // Iran region
      context: { ip: await getClientIP() }
    })
    localStorage.setItem('medusa_cart_id', cart.id)
    setCart(cart)
  }
  
  async function addItem(variantId: string, quantity: number) {
    if (!cart) return
    setLoading(true)
    
    try {
      const { cart: updatedCart } = await medusaClient.carts.lineItems.create(cart.id, {
        variant_id: variantId,
        quantity
      })
      setCart(updatedCart)
    } catch (error) {
      console.error('Failed to add item:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }
  
  async function removeItem(lineItemId: string) {
    if (!cart) return
    setLoading(true)
    
    try {
      const { cart: updatedCart } = await medusaClient.carts.lineItems.delete(
        cart.id,
        lineItemId
      )
      setCart(updatedCart)
    } finally {
      setLoading(false)
    }
  }
  
  async function updateQuantity(lineItemId: string, quantity: number) {
    if (!cart) return
    setLoading(true)
    
    try {
      const { cart: updatedCart } = await medusaClient.carts.lineItems.update(
        cart.id,
        lineItemId,
        { quantity }
      )
      setCart(updatedCart)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, loading }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within MedusaCartProvider')
  }
  return context
}
```

---

## 6. Payment Gateway Integration

### Payment Gateways for Iran Market

#### Primary: Razorpay / ZarinPal
Iranian payment gateway that supports local payment methods and international cards.

**Medusa Plugin:**
```bash
npm install medusa-payment-zarinpal
```

**Configuration:**
```typescript
// medusa-config.js
module.exports = {
  plugins: [
    {
      resolve: 'medusa-payment-zarinpal',
      options: {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        sandbox: process.env.NODE_ENV !== 'production',
        callback_url: `${process.env.STORE_URL}/checkout/payment-callback`
      }
    }
  ]
}
```

#### Secondary: Stripe (for international customers)

**Medusa Plugin:**
```bash
npm install @medusajs/medusa-payment-stripe
```

**Configuration:**
```typescript
// medusa-config.js
module.exports = {
  plugins: [
    {
      resolve: '@medusajs/medusa-payment-stripe',
      options: {
        api_key: process.env.STRIPE_API_KEY,
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
      }
    }
  ]
}
```

#### Tertiary: PayPal

**Medusa Plugin:**
```bash
npm install medusa-payment-paypal
```

### Payment Flow

```
1. Customer fills checkout form
        ↓
2. Frontend calls Medusa Cart API to add shipping/billing
        ↓
3. Frontend initializes payment session
        ↓
4. Medusa creates payment session with selected provider
        ↓
5. Frontend redirects to payment gateway
        ↓
6. Customer completes payment
        ↓
7. Payment gateway calls Medusa webhook
        ↓
8. Medusa verifies payment and completes order
        ↓
9. Medusa triggers order fulfillment
        ↓
10. Customer receives confirmation email
```

### Frontend Implementation

```typescript
// app/checkout/page.tsx
'use client'

import { useCart } from '@/contexts/medusa-cart-context'
import { medusaClient } from '@/lib/medusa.client'

export default function CheckoutPage() {
  const { cart } = useCart()
  const [loading, setLoading] = useState(false)
  
  async function handlePayment(paymentProviderId: string) {
    if (!cart) return
    
    setLoading(true)
    
    try {
      // 1. Add email and billing address to cart
      await medusaClient.carts.update(cart.id, {
        email: formData.email,
        billing_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          city: formData.city,
          country_code: 'ir',
          postal_code: formData.postalCode,
          phone: formData.phone
        }
      })
      
      // 2. Initialize payment session
      const { cart: updatedCart } = await medusaClient.carts.createPaymentSessions(cart.id)
      
      // 3. Select payment provider
      const { cart: cartWithPayment } = await medusaClient.carts.setPaymentSession(
        cart.id,
        { provider_id: paymentProviderId }
      )
      
      // 4. Complete cart and create order
      const { type, data } = await medusaClient.carts.complete(cart.id)
      
      if (type === 'order') {
        // Order created successfully
        const order = data as Order
        
        // Redirect to success page
        router.push(`/order/confirmed?id=${order.id}`)
      } else if (type === 'cart') {
        // Payment requires additional action (e.g., 3DS)
        const cart = data as Cart
        
        // Redirect to payment gateway
        window.location.href = cart.payment_session.data.redirect_url
      }
    } catch (error) {
      console.error('Payment failed:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      {/* Checkout form */}
      <CheckoutForm onSubmit={handlePayment} />
    </div>
  )
}
```

### Webhook Handling

```typescript
// app/api/webhooks/payment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/medusa-webhook'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-medusa-signature')
  
  // Verify webhook signature
  const isValid = verifyWebhookSignature(body, signature)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  const event = JSON.parse(body)
  
  switch (event.type) {
    case 'order.placed':
      await handleOrderPlaced(event.data)
      break
    case 'order.payment_captured':
      await handlePaymentCaptured(event.data)
      break
    case 'order.fulfillment_created':
      await handleFulfillmentCreated(event.data)
      break
  }
  
  return NextResponse.json({ received: true })
}

async function handleOrderPlaced(order: Order) {
  // Send confirmation email
  await sendOrderConfirmationEmail(order)
  
  // For digital products, trigger fulfillment immediately
  if (isDigitalOrder(order)) {
    await fulfillDigitalProducts(order)
  }
}
```

---

## 7. Cart & Checkout Flow

### Detailed Checkout Steps

#### Step 1: Cart Review
- Display cart items with Sanity images/content
- Show pricing from Medusa
- Allow quantity adjustments
- Show real-time total calculation
- Display applied discounts

#### Step 2: Customer Information
- Email (required for guest checkout)
- First name, Last name
- Phone number (for SMS notifications)
- Optional: Create account checkbox

#### Step 3: Billing Details (for invoicing)
- Full address
- City, Postal code
- Country (default: Iran)
- Tax/VAT ID (if applicable)

#### Step 4: Payment Method Selection
- Display available payment methods based on:
  - Customer location
  - Cart total
  - Currency
- Icons and descriptions for each method

#### Step 5: Order Review
- Final summary
- Terms & conditions checkbox
- Privacy policy agreement

#### Step 6: Payment Processing
- Redirect to payment gateway
- Show loading state
- Handle return from gateway

#### Step 7: Order Confirmation
- Thank you page
- Order number
- Email confirmation sent
- For digital products: Display download links

### Abandoned Cart Recovery

**Implementation:**
```typescript
// medusa-config.js
module.exports = {
  plugins: [
    {
      resolve: 'medusa-plugin-abandoned-cart',
      options: {
        from: 'noreply@sharifgpt.com',
        enableUI: true,
        subject: 'شما یک محصول در سبد خرید باقی گذاشته‌اید',
        templateId: 'abandoned-cart-template',
        days_to_track: 7,
        exclude_statuses: ['completed']
      }
    }
  ]
}
```

**Email Template:**
```html
<div dir="rtl">
  <h2>سبد خرید شما در انتظار است!</h2>
  <p>سلام {{customer.first_name}}،</p>
  <p>محصولاتی که انتخاب کرده‌اید هنوز در سبد خرید شما باقی مانده‌اند:</p>
  
  {{#each cart.items}}
    <div>
      <img src="{{this.thumbnail}}" alt="{{this.title}}" />
      <h3>{{this.title}}</h3>
      <p>{{this.unit_price}} تومان</p>
    </div>
  {{/each}}
  
  <p><strong>مجموع: {{cart.total}} تومان</strong></p>
  
  <a href="{{cart_url}}">بازگشت به سبد خرید</a>
</div>
```

---

## 8. Customer Management

### Customer Registration Flow

**Option 1: Guest Checkout (Recommended for initial launch)**
- Minimal friction
- Collect only email and name
- Create customer account in Medusa automatically
- Send account creation email with password setup link

**Option 2: Required Registration**
- Create account before checkout
- Store additional preferences
- Enable order history viewing

### Customer Account Features

**Must-Have:**
1. Order history
2. Download digital products
3. Invoice management
4. Email notifications preferences

**Nice-to-Have:**
1. Wishlist
2. Saved payment methods
3. Address book
4. Loyalty points
5. Course progress tracking (if applicable)

### Medusa Customer API

```typescript
// app/api/customers/register/route.ts
import { medusaClient } from '@/lib/medusa.client'

export async function POST(request: Request) {
  const { email, password, first_name, last_name } = await request.json()
  
  try {
    const { customer } = await medusaClient.customers.create({
      email,
      password,
      first_name,
      last_name,
      metadata: {
        marketing_consent: true,
        preferred_language: 'fa'
      }
    })
    
    // Send welcome email
    await sendWelcomeEmail(customer)
    
    return Response.json({ customer }, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }
}
```

### Customer Login

```typescript
// contexts/auth-context.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  
  async function login(email: string, password: string) {
    const { customer } = await medusaClient.auth.authenticate({
      email,
      password
    })
    
    // Store auth token in httpOnly cookie
    await fetch('/api/auth/session', {
      method: 'POST',
      body: JSON.stringify({ customer })
    })
    
    setCustomer(customer)
  }
  
  async function logout() {
    await medusaClient.auth.deleteSession()
    await fetch('/api/auth/session', { method: 'DELETE' })
    setCustomer(null)
  }
  
  return (
    <AuthContext.Provider value={{ customer, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

---

## 9. Order Management

### Order Lifecycle

```
1. Cart Completion → Order Created (status: pending)
        ↓
2. Payment Authorized → Order Updated (payment_status: awaiting)
        ↓
3. Payment Captured → Order Updated (payment_status: captured)
        ↓
4. Fulfillment Created → Order Updated (fulfillment_status: fulfilled)
        ↓
5. Order Completed (status: completed)
```

### Order Status Types

**Order Status:**
- `pending`: Order created, payment not yet processed
- `completed`: Order fully paid and fulfilled
- `archived`: Order archived (for cleanup)
- `canceled`: Order canceled by customer or admin

**Payment Status:**
- `not_paid`: No payment made
- `awaiting`: Payment authorized but not captured
- `captured`: Payment successfully captured
- `refunded`: Payment refunded
- `partially_refunded`: Partial refund issued
- `canceled`: Payment canceled

**Fulfillment Status:**
- `not_fulfilled`: No fulfillment
- `fulfilled`: All items fulfilled
- `partially_fulfilled`: Some items fulfilled
- `shipped`: Physical items shipped (not applicable for digital)
- `returned`: Items returned
- `canceled`: Fulfillment canceled

### Digital Product Fulfillment

**Automated Fulfillment Service:**

```typescript
// lib/services/digital-fulfillment.service.ts
export class DigitalFulfillmentService {
  
  async fulfillOrder(order: Order) {
    const digitalItems = order.items.filter(
      item => item.variant.product.metadata.isDigital === true
    )
    
    if (digitalItems.length === 0) return
    
    for (const item of digitalItems) {
      await this.deliverDigitalProduct(order, item)
    }
    
    // Mark order as fulfilled
    await medusaClient.orders.createFulfillment(order.id, {
      items: digitalItems.map(item => ({
        item_id: item.id,
        quantity: item.quantity
      }))
    })
  }
  
  private async deliverDigitalProduct(order: Order, item: LineItem) {
    const deliveryMethod = item.variant.product.metadata.deliveryMethod
    
    switch (deliveryMethod) {
      case 'email':
        await this.sendProductEmail(order.customer, item)
        break
      case 'download':
        await this.generateDownloadLink(order.customer, item)
        break
      case 'api_key':
        await this.generateAPIKey(order.customer, item)
        break
      case 'account_credentials':
        await this.createServiceAccount(order.customer, item)
        break
    }
  }
  
  private async sendProductEmail(customer: Customer, item: LineItem) {
    // Get product details from Sanity
    const sanityProduct = await sanityClient.fetch(
      `*[_id == $id][0]`,
      { id: item.variant.product.metadata.sanityId }
    )
    
    // Send email with product access details
    await emailService.send({
      to: customer.email,
      template: 'digital-product-delivery',
      data: {
        customerName: customer.first_name,
        productName: item.title,
        instructions: sanityProduct.deliveryInstructions,
        downloadLink: await this.getProductFile(item),
        supportEmail: 'support@sharifgpt.com'
      }
    })
  }
  
  private async generateDownloadLink(customer: Customer, item: LineItem) {
    // Generate signed URL for product file
    const productFile = await this.getProductFileMetadata(item)
    
    const downloadUrl = await storageService.generateSignedUrl(
      productFile.path,
      { expiresIn: 7 * 24 * 60 * 60 } // 7 days
    )
    
    // Store download link in order metadata
    await medusaClient.orders.update(order.id, {
      metadata: {
        ...order.metadata,
        [`download_${item.id}`]: downloadUrl
      }
    })
    
    return downloadUrl
  }
  
  private async generateAPIKey(customer: Customer, item: LineItem) {
    // Generate unique API key for service
    const apiKey = generateSecureToken()
    
    // Store in separate API key service
    await apiKeyService.create({
      customerId: customer.id,
      productId: item.variant.product.id,
      key: apiKey,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    })
    
    return apiKey
  }
  
  private async createServiceAccount(customer: Customer, item: LineItem) {
    // For products like ChatGPT, Spotify accounts
    // Create credentials and deliver via email
    
    const credentials = await thirdPartyService.createAccount({
      email: customer.email,
      product: item.variant.product.metadata.serviceType
    })
    
    await emailService.send({
      to: customer.email,
      template: 'service-account-delivery',
      data: {
        productName: item.title,
        username: credentials.username,
        password: credentials.password,
        loginUrl: credentials.loginUrl,
        expiryDate: credentials.expiryDate
      }
    })
  }
}
```

### Customer Order History

```typescript
// app/account/orders/page.tsx
export default async function OrdersPage() {
  const { customer } = await getServerSession()
  
  const orders = await medusaClient.orders.list({
    customer_id: customer.id,
    expand: 'items,items.variant,items.variant.product',
    limit: 50,
    offset: 0
  })
  
  return (
    <div>
      <h1>تاریخچه سفارشات</h1>
      
      {orders.orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}
```

---

## 10. Discount & Promotion Engine

### Medusa Discount Types

#### 1. Percentage Discounts
```typescript
// Create 20% off discount
await medusaClient.admin.discounts.create({
  code: 'WELCOME20',
  rule: {
    type: 'percentage',
    value: 20,
    allocation: 'total' // or 'item'
  },
  regions: ['reg_iran'],
  usage_limit: 100,
  starts_at: new Date(),
  ends_at: new Date('2024-12-31')
})
```

#### 2. Fixed Amount Discounts
```typescript
// Create 50,000 IRR off discount
await medusaClient.admin.discounts.create({
  code: 'SAVE50K',
  rule: {
    type: 'fixed',
    value: 5000000, // In smallest unit (rials)
    allocation: 'total'
  },
  regions: ['reg_iran']
})
```

#### 3. Free Shipping
```typescript
await medusaClient.admin.discounts.create({
  code: 'FREESHIP',
  rule: {
    type: 'free_shipping'
  },
  regions: ['reg_iran']
})
```

#### 4. Buy X Get Y (BOGO)
Requires custom plugin or manual configuration.

### Discount Conditions

**Limit by:**
- Minimum cart value
- Specific products
- Product collections
- Customer groups
- Number of uses per customer
- Total usage limit
- Date range

**Example: VIP Customer Discount**
```typescript
// Create customer group
const { customer_group } = await medusaClient.admin.customerGroups.create({
  name: 'VIP Customers'
})

// Create discount for VIP group
await medusaClient.admin.discounts.create({
  code: 'VIP30',
  rule: {
    type: 'percentage',
    value: 30,
    allocation: 'total'
  },
  regions: ['reg_iran'],
  conditions: [
    {
      type: 'customer_groups',
      operator: 'in',
      customer_groups: [customer_group.id]
    }
  ]
})
```

### Frontend Discount Application

```typescript
// app/checkout/components/discount-form.tsx
'use client'

export function DiscountForm() {
  const { cart } = useCart()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  async function applyDiscount() {
    if (!cart || !code) return
    
    setLoading(true)
    setError(null)
    
    try {
      const { cart: updatedCart } = await medusaClient.carts.update(cart.id, {
        discounts: [{ code }]
      })
      
      toast.success('کد تخفیف با موفقیت اعمال شد')
      setCode('')
    } catch (error) {
      setError('کد تخفیف نامعتبر است')
      toast.error('کد تخفیف نامعتبر است')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="کد تخفیف"
        className="flex-1 px-4 py-2 border rounded"
        dir="ltr"
      />
      <button
        onClick={applyDiscount}
        disabled={loading || !code}
        className="px-6 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'در حال اعمال...' : 'اعمال'}
      </button>
    </div>
  )
}
```

### Dynamic Pricing Rules

For complex pricing (e.g., volume discounts), use Medusa price lists:

```typescript
// Create price list for bulk buyers
const { price_list } = await medusaClient.admin.priceLists.create({
  name: 'Bulk Purchase Discount',
  description: '10% off for orders of 10+ items',
  type: 'sale',
  starts_at: new Date(),
  ends_at: new Date('2024-12-31'),
  customer_groups: [{ id: 'bulk_buyers_group_id' }],
  prices: [
    {
      variant_id: 'variant_123',
      amount: 270000, // 10% off original 300,000
      currency_code: 'irr'
    }
  ]
})
```

---

## 11. Inventory Management

### Inventory Tracking Setup

**For Digital Products:**
```typescript
// Most digital products have unlimited stock
await medusaClient.admin.products.updateVariant(productId, variantId, {
  manage_inventory: false,
  allow_backorder: true
})
```

**For Limited License Products:**
```typescript
// For products with limited keys/licenses
await medusaClient.admin.products.updateVariant(productId, variantId, {
  manage_inventory: true,
  inventory_quantity: 100,
  allow_backorder: false
})
```

### Inventory Locations

For businesses with multiple warehouses or suppliers:

```typescript
// Create inventory location
const { inventory_location } = await medusaClient.admin.inventoryItems.createLocation({
  name: 'Digital Warehouse Iran'
})

// Associate with stock location
await medusaClient.admin.inventoryItems.updateLocationLevel(
  inventoryItemId,
  inventory_location.id,
  {
    stocked_quantity: 1000
  }
)
```

### Low Stock Alerts

```typescript
// medusa-backend/src/subscribers/inventory-monitor.ts
export default async function inventoryMonitor({ data, eventName }: SubscriberArgs) {
  if (eventName === 'inventory.updated') {
    const { variant_id, quantity } = data
    
    // Check if stock is below threshold
    if (quantity < 10) {
      await notificationService.send({
        to: 'admin@sharifgpt.com',
        subject: 'Low Stock Alert',
        template: 'low-stock',
        data: { variant_id, quantity }
      })
    }
  }
}
```

---

## 12. Digital Product Delivery

### Delivery Methods

#### Method 1: Email with Instructions
Best for: Service accounts (ChatGPT, Spotify, etc.)

```typescript
// Email template
{
  subject: 'دسترسی به {{product_name}}',
  body: `
    سلام {{customer_name}},
    
    از خرید شما متشکریم! اطلاعات دسترسی به {{product_name}}:
    
    نام کاربری: {{username}}
    رمز عبور: {{password}}
    لینک ورود: {{login_url}}
    
    تاریخ انقضا: {{expiry_date}}
    
    راهنمای استفاده: {{help_url}}
  `
}
```

#### Method 2: Download Link
Best for: Digital files, courses, ebooks

```typescript
// Generate secure download link
const downloadUrl = await generateSecureDownloadUrl({
  orderId: order.id,
  customerId: customer.id,
  productId: product.id,
  expiresIn: 7 * 24 * 60 * 60 // 7 days
})
```

**Implementation:**
```typescript
// app/api/downloads/[token]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  // Verify token
  const { orderId, customerId, productId } = await verifyDownloadToken(params.token)
  
  // Check if order belongs to customer
  const order = await medusaClient.orders.retrieve(orderId)
  if (order.customer_id !== customerId) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Get file from storage
  const file = await storageService.getFile(productId)
  
  // Stream file to client
  return new Response(file.stream, {
    headers: {
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.name}"`,
      'Content-Length': file.size.toString()
    }
  })
}
```

#### Method 3: API Key Generation
Best for: API services, developer tools

```typescript
await apiKeyService.generateKey({
  customerId: customer.id,
  productId: product.id,
  scopes: ['read', 'write'],
  rateLimit: 1000, // requests per hour
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
})
```

#### Method 4: Service Account Creation
Best for: SaaS products with API integration

```typescript
// Integration with external service
await externalServiceAPI.createAccount({
  email: customer.email,
  plan: product.metadata.planType,
  duration: product.metadata.subscriptionPeriod
})
```

### Delivery Tracking

**Customer Dashboard:**
```typescript
// app/account/products/page.tsx
export default async function MyProductsPage() {
  const { customer } = await getServerSession()
  
  const orders = await medusaClient.orders.list({
    customer_id: customer.id,
    fulfillment_status: ['fulfilled']
  })
  
  const digitalProducts = orders.orders
    .flatMap(order => order.items)
    .filter(item => item.variant.product.metadata.isDigital)
  
  return (
    <div>
      <h1>محصولات دیجیتال من</h1>
      
      {digitalProducts.map(item => (
        <ProductAccessCard
          key={item.id}
          product={item}
          downloadUrl={getDownloadUrl(item)}
          credentials={getCredentials(item)}
        />
      ))}
    </div>
  )
}
```

---

## 13. Multi-Currency Support

### Currency Configuration

**Supported Currencies:**
1. **IRR (Iranian Rial)**: Primary currency
2. **USD (US Dollar)**: For international customers
3. **EUR (Euro)**: Optional

### Region Setup

```typescript
// Create Iran region
const { region: iranRegion } = await medusaClient.admin.regions.create({
  name: 'Iran',
  currency_code: 'irr',
  tax_rate: 9, // Iran VAT
  payment_providers: [
    { id: 'zarinpal' },
    { id: 'mellat-bank' }
  ],
  fulfillment_providers: [
    { id: 'digital-fulfillment' }
  ],
  countries: ['ir']
})

// Create international region
const { region: intlRegion } = await medusaClient.admin.regions.create({
  name: 'International',
  currency_code: 'usd',
  tax_rate: 0,
  payment_providers: [
    { id: 'stripe' },
    { id: 'paypal' }
  ],
  countries: ['us', 'ca', 'gb', 'de', 'fr']
})
```

### Price Management

**Set prices for each region:**
```typescript
await medusaClient.admin.products.updateVariant(productId, variantId, {
  prices: [
    {
      currency_code: 'irr',
      amount: 300000000, // 3,000,000 IRR in rials (smallest unit)
      region_id: iranRegion.id
    },
    {
      currency_code: 'usd',
      amount: 1000, // $10.00 in cents
      region_id: intlRegion.id
    }
  ]
})
```

### Currency Detection

```typescript
// lib/currency-detector.ts
export async function detectCustomerCurrency(request: Request) {
  // Method 1: IP-based geolocation
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
  const geo = await ipGeolocation.lookup(ip)
  
  if (geo.country === 'IR') {
    return { currency: 'irr', region: 'reg_iran' }
  }
  
  // Method 2: Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage?.includes('fa')) {
    return { currency: 'irr', region: 'reg_iran' }
  }
  
  // Method 3: User preference (if logged in)
  const session = await getServerSession(request)
  if (session?.customer?.metadata?.preferred_currency) {
    return {
      currency: session.customer.metadata.preferred_currency,
      region: session.customer.metadata.preferred_region
    }
  }
  
  // Default to USD
  return { currency: 'usd', region: 'reg_intl' }
}
```

### Currency Switcher UI

```typescript
// components/currency-switcher.tsx
'use client'

export function CurrencySwitcher() {
  const { region, switchRegion } = useRegion()
  
  return (
    <select
      value={region.currency_code}
      onChange={(e) => switchRegion(e.target.value)}
      className="px-3 py-1 border rounded"
    >
      <option value="irr">تومان (IRR)</option>
      <option value="usd">Dollar ($)</option>
      <option value="eur">Euro (€)</option>
    </select>
  )
}
```

---

## 14. Admin Dashboard Strategy

### Medusa Admin Panel

Medusa comes with a built-in admin panel at `/admin`.

**Features:**
- Product management
- Order management
- Customer management
- Discount codes
- Inventory tracking
- Analytics
- Settings

**Access:**
```
URL: https://yourdomain.com/admin
Default credentials: Set during Medusa setup
```

### Custom Admin Features

**Extend Medusa admin for your needs:**

#### 1. Sanity Sync Status
Show which products are synced between Sanity and Medusa.

```typescript
// medusa-backend/src/admin/widgets/sanity-sync-status.tsx
export default function SanitySyncStatus() {
  const [syncStatus, setSyncStatus] = useState([])
  
  useEffect(() => {
    fetchSyncStatus().then(setSyncStatus)
  }, [])
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Sanity Sync Status</h2>
      
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Sanity ID</th>
            <th>Last Synced</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {syncStatus.map(product => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.metadata.sanityId}</td>
              <td>{formatDate(product.metadata.lastSyncedAt)}</td>
              <td>
                <Badge color={product.syncStatus === 'synced' ? 'green' : 'red'}>
                  {product.syncStatus}
                </Badge>
              </td>
              <td>
                <button onClick={() => syncProduct(product.id)}>
                  Sync Now
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

#### 2. Digital Product Delivery Monitor
Track digital product delivery status.

#### 3. Revenue Analytics
Extended analytics for Iranian market.

### Role-Based Access Control

```typescript
// Create admin users with different roles
const { user: contentManager } = await medusaClient.admin.users.create({
  email: 'content@sharifgpt.com',
  role: 'member', // Limited access
  metadata: {
    permissions: ['view_products', 'edit_product_content']
  }
})

const { user: salesManager } = await medusaClient.admin.users.create({
  email: 'sales@sharifgpt.com',
  role: 'admin', // Full access
  metadata: {
    permissions: ['*']
  }
})
```

---

## 15. Migration Strategy

### Phase 1: Setup Medusa (Week 1-2)

**Tasks:**
1. ✅ Set up Medusa backend server
2. ✅ Configure PostgreSQL database
3. ✅ Configure Redis for caching
4. ✅ Set up regions and currencies
5. ✅ Install payment plugins
6. ✅ Configure email service
7. ✅ Set up admin access

**Deliverables:**
- Medusa backend running on staging
- Admin panel accessible
- Basic configuration complete

### Phase 2: Product Sync (Week 3-4)

**Tasks:**
1. ✅ Create sync service
2. ✅ Set up Sanity webhooks
3. ✅ Migrate existing products to Medusa
4. ✅ Verify data integrity
5. ✅ Test sync process

**Migration Script:**
```typescript
// scripts/migrate-products-to-medusa.ts
import { getClient } from '../lib/sanity.client'
import { medusaClient } from '../lib/medusa.client'

async function migrateProducts() {
  // Fetch all products from Sanity
  const sanityProducts = await getClient().fetch(`
    *[_type == "product"]{
      _id,
      name,
      slug,
      price,
      originalPrice,
      options
    }
  `)
  
  console.log(`Found ${sanityProducts.length} products to migrate`)
  
  for (const sanityProduct of sanityProducts) {
    console.log(`Migrating: ${sanityProduct.name}`)
    
    try {
      // Create product in Medusa
      const medusaProduct = await medusaClient.admin.products.create({
        title: sanityProduct.name,
        handle: sanityProduct.slug.current,
        status: 'published',
        metadata: {
          sanityId: sanityProduct._id,
          isDigital: true
        }
      })
      
      // Create variants from options
      if (sanityProduct.options && sanityProduct.options.length > 0) {
        for (const option of sanityProduct.options) {
          await medusaClient.admin.products.createVariant(medusaProduct.id, {
            title: option.name,
            sku: `${sanityProduct.slug.current}-${option.id}`,
            prices: [
              {
                currency_code: 'irr',
                amount: option.price * 10000, // Convert to rials
                region_id: 'reg_iran'
              }
            ],
            manage_inventory: false
          })
        }
      } else {
        // Create single variant
        await medusaClient.admin.products.createVariant(medusaProduct.id, {
          title: 'Default',
          sku: sanityProduct.slug.current,
          prices: [
            {
              currency_code: 'irr',
              amount: sanityProduct.price * 10000,
              region_id: 'reg_iran'
            }
          ],
          manage_inventory: false
        })
      }
      
      // Update Sanity with Medusa ID
      await getClient()
        .patch(sanityProduct._id)
        .set({
          medusaProductId: medusaProduct.id,
          lastSyncedAt: new Date().toISOString()
        })
        .commit()
      
      console.log(`✅ Migrated: ${sanityProduct.name}`)
    } catch (error) {
      console.error(`❌ Failed to migrate ${sanityProduct.name}:`, error)
    }
  }
  
  console.log('Migration complete!')
}

migrateProducts()
```

### Phase 3: Frontend Integration (Week 5-6)

**Tasks:**
1. ✅ Implement Medusa cart context
2. ✅ Update product pages to fetch from both systems
3. ✅ Implement checkout flow
4. ✅ Add payment gateway integration
5. ✅ Test end-to-end purchase flow

### Phase 4: Testing (Week 7)

**Testing Checklist:**
- [ ] Product display shows correct prices
- [ ] Cart operations work correctly
- [ ] Checkout flow completes successfully
- [ ] Payment processing works
- [ ] Order confirmation emails sent
- [ ] Digital products delivered
- [ ] Customer account creation works
- [ ] Order history displays correctly
- [ ] Discounts apply correctly
- [ ] Multi-currency switching works

### Phase 5: Launch (Week 8)

**Pre-launch:**
1. ✅ Final security audit
2. ✅ Performance testing
3. ✅ Backup procedures
4. ✅ Monitoring setup
5. ✅ Support team training

**Launch Day:**
1. Deploy Medusa backend to production
2. Update frontend to use production Medusa
3. Monitor error logs
4. Be ready for quick rollback if needed

**Post-launch:**
1. Monitor performance metrics
2. Collect user feedback
3. Fix urgent issues
4. Plan phase 2 features

---

## 16. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

**Infrastructure:**
- Set up Medusa backend server (Railway/Heroku/AWS)
- Configure PostgreSQL database
- Configure Redis instance
- Set up environment variables
- Deploy to staging environment

**Initial Configuration:**
- Create regions (Iran, International)
- Set up currencies (IRR, USD)
- Install payment plugins
- Configure SMTP for emails

### Phase 2: Data Migration (Weeks 3-4)

**Product Migration:**
- Export products from Sanity
- Transform data structure
- Import into Medusa
- Verify data integrity
- Update Sanity with Medusa IDs

**Sync Setup:**
- Create sync service
- Set up Sanity webhooks
- Test bidirectional sync
- Monitor sync logs

### Phase 3: Frontend Integration (Weeks 5-7)

**Cart System:**
- Replace localStorage cart with Medusa cart
- Implement add/remove/update operations
- Add cart persistence
- Test cart recovery

**Checkout Flow:**
- Build checkout form
- Integrate payment gateways
- Implement order completion
- Add confirmation page

**Customer Accounts:**
- Login/registration
- Order history
- Account management
- Password reset

### Phase 4: Testing (Week 8)

**Testing Types:**
- Unit tests
- Integration tests
- End-to-end tests
- Payment gateway testing (sandbox)
- Performance testing
- Security testing

### Phase 5: Launch (Week 9)

**Deployment:**
- Deploy backend to production
- Update frontend configuration
- DNS configuration
- SSL certificates
- Final smoke tests

**Monitoring:**
- Set up error tracking (Sentry)
- Configure analytics
- Set up uptime monitoring
- Create alert rules

### Phase 6: Post-Launch (Week 10+)

**Optimization:**
- Performance tuning
- A/B testing
- User feedback collection
- Feature enhancements

---

## 17. API Architecture

### API Layer Structure

```
┌──────────────────────────────────────────────────────────┐
│                    Next.js Frontend                       │
└────────────────┬────────────────────┬────────────────────┘
                 │                    │
                 ↓                    ↓
    ┌────────────────────┐  ┌──────────────────┐
    │  Sanity Client API │  │ Medusa Client API │
    └────────────────────┘  └──────────────────┘
                 │                    │
                 ↓                    ↓
         ┌──────────────┐    ┌──────────────┐
         │ Sanity CDN   │    │ Medusa API   │
         └──────────────┘    └──────────────┘
```

### API Route Organization

```
app/api/
├── products/
│   ├── route.ts              # List products (merged data)
│   ├── [slug]/
│   │   └── route.ts          # Get single product
│   └── sync/
│       └── route.ts          # Manual sync trigger
├── cart/
│   ├── route.ts              # Get cart
│   ├── items/
│   │   └── route.ts          # Add/update items
│   └── complete/
│       └── route.ts          # Complete checkout
├── customers/
│   ├── register/
│   │   └── route.ts          # Register customer
│   ├── login/
│   │   └── route.ts          # Login
│   └── me/
│       ├── route.ts          # Get profile
│       └── orders/
│           └── route.ts      # Order history
├── webhooks/
│   ├── sanity-sync/
│   │   └── route.ts          # Sanity → Medusa sync
│   ├── medusa-order/
│   │   └── route.ts          # Order events
│   └── payment/
│       └── route.ts          # Payment gateway webhooks
└── admin/
    └── sync-status/
        └── route.ts          # Sync status dashboard
```

### Example API Routes

**Get Product with Merged Data:**
```typescript
// app/api/products/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Fetch content from Sanity
    const sanityProduct = await sanityClient.fetch(
      productDocBySlugQuery,
      { slug: params.slug }
    )
    
    if (!sanityProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Fetch commerce data from Medusa
    const medusaProduct = await medusaClient.products.retrieve(
      sanityProduct.medusaProductId,
      {
        expand: 'variants,variants.prices,variants.inventory',
        region_id: request.nextUrl.searchParams.get('region') || 'reg_iran'
      }
    )
    
    // Merge data
    const product = {
      // Content from Sanity
      id: sanityProduct._id,
      name: sanityProduct.name,
      description: sanityProduct.description,
      longDescription: sanityProduct.longDescription,
      images: sanityProduct.gallery?.map(img => urlForImage(img).url()),
      features: sanityProduct.features,
      seo: sanityProduct.seo,
      relatedBlogs: sanityProduct.relatedBlogs,
      
      // Commerce from Medusa
      variants: medusaProduct.variants.map(variant => ({
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        price: variant.prices[0].amount / 100,
        currency: variant.prices[0].currency_code,
        inStock: variant.inventory_quantity > 0 || !variant.manage_inventory
      })),
      
      // Computed
      availableForPurchase: medusaProduct.status === 'published'
    }
    
    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## 18. Security Considerations

### Authentication & Authorization

**Customer Authentication:**
- Use Medusa's built-in JWT authentication
- Store tokens in httpOnly cookies (not localStorage)
- Implement CSRF protection
- Use short-lived access tokens + refresh tokens

**Admin Authentication:**
- Separate admin authentication
- Multi-factor authentication (MFA) recommended
- IP whitelisting for admin panel
- Regular password rotation policy

### Data Protection

**PCI Compliance:**
- Never store credit card numbers
- Use payment gateway tokenization
- Log all payment events
- Regular security audits

**GDPR/Data Privacy:**
- Clear privacy policy
- Data retention policy
- Customer data export functionality
- Right to deletion (data anonymization)

**API Security:**
- Rate limiting on all endpoints
- Request validation (Zod schemas)
- API key rotation
- Webhook signature verification

### Security Best Practices

```typescript
// middleware.ts - Rate limiting
import { rateLimit } from '@/lib/rate-limit'

export async function middleware(request: NextRequest) {
  // Rate limit based on IP
  const ip = request.ip || request.headers.get('x-forwarded-for')
  const rateLimitResult = await rateLimit(ip, {
    limit: 100, // requests
    window: 60 // seconds
  })
  
  if (!rateLimitResult.success) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }
  
  // Verify webhook signatures
  if (request.nextUrl.pathname.startsWith('/api/webhooks')) {
    const signature = request.headers.get('x-webhook-signature')
    const body = await request.text()
    
    if (!verifySignature(body, signature)) {
      return new NextResponse('Invalid Signature', { status: 401 })
    }
  }
  
  return NextResponse.next()
}
```

### Environment Variables Security

**Never commit:**
```bash
# .env.local (NEVER commit!)
MEDUSA_API_URL=
MEDUSA_PUBLISHABLE_KEY=
MEDUSA_API_KEY=
DATABASE_URL=
REDIS_URL=
STRIPE_SECRET_KEY=
ZARINPAL_MERCHANT_ID=
SANITY_API_TOKEN=
JWT_SECRET=
WEBHOOK_SECRET=
```

**Use secure secrets management:**
- Vercel environment variables
- AWS Secrets Manager
- HashiCorp Vault

---

## 19. Performance Optimization

### Caching Strategy

**Redis Caching:**
```typescript
// lib/cache.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCachedProduct(productId: string) {
  const cached = await redis.get(`product:${productId}`)
  if (cached) return JSON.parse(cached)
  
  // Fetch from APIs
  const product = await fetchProductData(productId)
  
  // Cache for 5 minutes
  await redis.setex(
    `product:${productId}`,
    300,
    JSON.stringify(product)
  )
  
  return product
}
```

**Next.js Caching:**
```typescript
// app/products/[slug]/page.tsx
export const revalidate = 300 // Revalidate every 5 minutes

export async function generateStaticParams() {
  // Generate static paths for top products
  const products = await getTopProducts()
  return products.map(p => ({ slug: p.slug }))
}
```

### Database Optimization

**Indexes:**
```sql
-- PostgreSQL indexes for Medusa
CREATE INDEX idx_products_handle ON product(handle);
CREATE INDEX idx_products_status ON product(status);
CREATE INDEX idx_variants_product_id ON product_variant(product_id);
CREATE INDEX idx_prices_variant_id ON money_amount(variant_id);
CREATE INDEX idx_orders_customer_id ON order(customer_id);
CREATE INDEX idx_orders_created_at ON order(created_at DESC);
```

**Connection Pooling:**
```typescript
// medusa-config.js
module.exports = {
  projectConfig: {
    database_type: 'postgres',
    database_url: process.env.DATABASE_URL,
    database_extra: {
      max: 20, // Max connections
      min: 2   // Min connections
    }
  }
}
```

### Image Optimization

**Use Sanity Image Pipeline:**
```typescript
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(sanityClient)

function urlForImage(source: Image) {
  return builder.image(source)
    .auto('format')
    .fit('max')
    .quality(80)
}

// Usage
const imageUrl = urlForImage(product.image)
  .width(800)
  .height(600)
  .url()
```

**Next.js Image Optimization:**
```typescript
import Image from 'next/image'

<Image
  src={urlForImage(product.image).url()}
  alt={product.name}
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL={urlForImage(product.image).width(20).blur(10).url()}
/>
```

### API Response Optimization

**Pagination:**
```typescript
// app/api/products/route.ts
export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get('limit')) || 20
  const offset = Number(request.nextUrl.searchParams.get('offset')) || 0
  
  const products = await medusaClient.products.list({
    limit,
    offset,
    expand: 'variants.prices'
  })
  
  return NextResponse.json({
    products: products.products,
    count: products.count,
    offset,
    limit
  })
}
```

**Field Selection:**
```typescript
// Only fetch needed fields
const products = await sanityClient.fetch(`
  *[_type == "product"]{
    _id,
    name,
    slug,
    "image": image.asset->url
  }
`)
```

---

## 20. Testing Strategy

### Unit Tests

**Test Cart Operations:**
```typescript
// __tests__/cart.test.ts
import { render, screen, fireEvent } from '@testing-library/react'
import { CartProvider, useCart } from '@/contexts/medusa-cart-context'

describe('Cart Context', () => {
  it('should add item to cart', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider
    })
    
    await act(async () => {
      await result.current.addItem('variant_123', 1)
    })
    
    expect(result.current.cart?.items).toHaveLength(1)
    expect(result.current.cart?.items[0].variant_id).toBe('variant_123')
  })
})
```

### Integration Tests

**Test Checkout Flow:**
```typescript
// __tests__/integration/checkout.test.ts
describe('Checkout Flow', () => {
  it('should complete purchase successfully', async () => {
    // 1. Add item to cart
    await addToCart('variant_123')
    
    // 2. Navigate to checkout
    await navigateToCheckout()
    
    // 3. Fill customer info
    await fillCheckoutForm({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    })
    
    // 4. Select payment method
    await selectPaymentMethod('stripe')
    
    // 5. Complete order
    await completeOrder()
    
    // 6. Verify order created
    expect(screen.getByText(/order confirmed/i)).toBeInTheDocument()
  })
})
```

### E2E Tests (Playwright)

```typescript
// e2e/purchase-flow.spec.ts
import { test, expect } from '@playwright/test'

test('complete purchase flow', async ({ page }) => {
  // 1. Browse products
  await page.goto('/products')
  await expect(page.locator('h1')).toContainText('محصولات')
  
  // 2. View product detail
  await page.click('text=ChatGPT Plus')
  await expect(page).toHaveURL(/\/products\/chatgpt-plus/)
  
  // 3. Add to cart
  await page.click('button:has-text("افزودن به سبد")')
  await expect(page.locator('.cart-count')).toHaveText('1')
  
  // 4. Go to checkout
  await page.click('a[href="/checkout"]')
  await expect(page).toHaveURL('/checkout')
  
  // 5. Fill form
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="firstName"]', 'Test')
  await page.fill('input[name="lastName"]', 'User')
  
  // 6. Complete (using test payment)
  await page.click('button:has-text("پرداخت")')
  
  // 7. Verify success
  await expect(page).toHaveURL(/\/order\/confirmed/)
  await expect(page.locator('h1')).toContainText('سفارش شما ثبت شد')
})
```

### Load Testing

```bash
# Using k6
k6 run - <<EOF
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up to 50 users
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
};

export default function() {
  // Test product listing
  let res = http.get('https://yourdomain.com/api/products');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
EOF
```

---

## 21. Monitoring & Analytics

### Error Tracking (Sentry)

```typescript
// app/layout.tsx
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ]
})
```

### Business Analytics

**Track Key Metrics:**
```typescript
// lib/analytics.ts
export function trackPurchase(order: Order) {
  // Google Analytics
  gtag('event', 'purchase', {
    transaction_id: order.id,
    value: order.total / 100,
    currency: order.currency_code,
    items: order.items.map(item => ({
      item_id: item.variant.sku,
      item_name: item.title,
      price: item.unit_price / 100,
      quantity: item.quantity
    }))
  })
  
  // Facebook Pixel
  fbq('track', 'Purchase', {
    value: order.total / 100,
    currency: order.currency_code
  })
  
  // Custom analytics
  await analytics.track({
    event: 'order_completed',
    properties: {
      orderId: order.id,
      total: order.total,
      itemCount: order.items.length,
      paymentMethod: order.payment_session.provider_id,
      customerType: order.customer.metadata.isReturning ? 'returning' : 'new'
    }
  })
}
```

### Performance Monitoring

**Web Vitals:**
```typescript
// app/layout.tsx
import { reportWebVitals } from 'next/web-vitals'

export function reportWebVitals(metric) {
  // Log to analytics
  console.log(metric)
  
  // Send to monitoring service
  fetch('/api/vitals', {
    method: 'POST',
    body: JSON.stringify(metric)
  })
}
```

**Uptime Monitoring:**
- Use UptimeRobot or Pingdom
- Monitor critical endpoints:
  - `/api/health`
  - `/api/products`
  - `/api/cart`
  - Medusa admin

---

## 22. Backup & Disaster Recovery

### Database Backups

**Automated PostgreSQL Backups:**
```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="medusa_backup_$DATE.sql"

pg_dump $DATABASE_URL > "$BACKUP_DIR/$FILENAME"
gzip "$BACKUP_DIR/$FILENAME"

# Upload to S3
aws s3 cp "$BACKUP_DIR/$FILENAME.gz" s3://your-backup-bucket/postgres/

# Delete local backup older than 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
```

**Run as cron job:**
```cron
0 2 * * * /path/to/backup-script.sh
```

### Redis Persistence

```redis
# redis.conf
save 900 1      # Save if 1 key changed in 15 minutes
save 300 10     # Save if 10 keys changed in 5 minutes
save 60 10000   # Save if 10000 keys changed in 1 minute

appendonly yes
appendfilename "appendonly.aof"
```

### Sanity Backups

Sanity automatically backs up content. Export for local backup:

```bash
# Export Sanity dataset
sanity dataset export production backup.tar.gz

# Upload to S3
aws s3 cp backup.tar.gz s3://your-backup-bucket/sanity/
```

### Disaster Recovery Plan

**RTO (Recovery Time Objective): 1 hour**
**RPO (Recovery Point Objective): 24 hours**

**Recovery Steps:**
1. Restore PostgreSQL from latest backup
2. Restore Redis AOF file
3. Redeploy Medusa backend
4. Verify data integrity
5. Update DNS if needed
6. Test critical flows

---

## 23. Scalability Considerations

### Horizontal Scaling

**Medusa Backend:**
- Run multiple Medusa instances behind load balancer
- Use Redis for shared session storage
- PostgreSQL read replicas for queries

**Architecture:**
```
             Load Balancer
                  |
    ┌─────────────┼─────────────┐
    ↓             ↓             ↓
Medusa-1     Medusa-2     Medusa-3
    ↓             ↓             ↓
    └─────────────┼─────────────┘
                  |
        ┌─────────┴─────────┐
        ↓                   ↓
   PostgreSQL           Redis
   (Primary)           (Shared)
        |
   Read Replicas
```

### Database Scaling

**Strategies:**
1. **Vertical Scaling**: Increase server resources (first step)
2. **Read Replicas**: Route read queries to replicas
3. **Partitioning**: Partition large tables (orders, line_items)
4. **Archiving**: Move old orders to archive database

### Caching Layers

```
User Request
    ↓
CDN (Cloudflare)
    ↓
Next.js Cache
    ↓
Redis Cache
    ↓
Database
```

### Queue System (Optional)

For high-volume operations:

```typescript
// Using BullMQ
import { Queue, Worker } from 'bullmq'

const orderProcessingQueue = new Queue('order-processing', {
  connection: { host: 'redis', port: 6379 }
})

// Add job to queue
await orderProcessingQueue.add('process-order', {
  orderId: order.id
})

// Worker processes jobs
const worker = new Worker('order-processing', async job => {
  const { orderId } = job.data
  await processOrder(orderId)
})
```

---

## 24. Cost Analysis

### Infrastructure Costs (Monthly Estimates)

**Development Environment:**
- Vercel Hobby: $0
- Railway (Medusa + PostgreSQL + Redis): ~$20-30
- Sanity Content Lake: $0 (free tier)
- Total: **~$25/month**

**Production Environment (Small Scale):**
- Vercel Pro: $20
- Railway Pro (Medusa): $50
- PostgreSQL (managed): $50
- Redis (managed): $30
- Sanity Pro: $99
- Payment Gateway: Transaction fees only
- Email Service (SendGrid): $20
- File Storage (S3): ~$10
- Monitoring (Sentry): $26
- Total: **~$305/month**

**Production Environment (Medium Scale - 1000 orders/month):**
- Vercel Pro: $20
- AWS (Medusa on ECS): $150
- PostgreSQL RDS: $150
- ElastiCache Redis: $80
- Sanity Growth: $249
- Payment Gateway: 2.9% + $0.30 per transaction
- Email Service: $50
- S3 Storage: $50
- CDN (Cloudflare): $20
- Monitoring: $80
- Total: **~$850/month** (+ transaction fees)

**Production Environment (Large Scale - 10,000+ orders/month):**
- Vercel Enterprise: Custom pricing
- AWS Infrastructure: $1000+
- Database: $500+
- Sanity Enterprise: Custom
- Payment processing: 2.5% + $0.30
- Total: **$3000+/month** (+ transaction fees)

### Transaction Fees

**Zarinpal (Iran):**
- 2.5% per transaction
- No setup fee
- No monthly fee

**Stripe (International):**
- 2.9% + $0.30 per transaction
- No setup fee
- No monthly fee

### ROI Analysis

**Break-even Calculation:**

Assuming:
- Average order value: 500,000 IRR (~$10)
- Profit margin: 30%
- Monthly costs: $305

Break-even orders per month:
```
$305 / ($10 × 0.30) = ~102 orders/month
```

---

## 25. Alternative Approaches

### Alternative 1: Sanity Commerce API (Simpler)

**Pros:**
- Simpler architecture
- Single system to manage
- Lower cost
- Faster initial setup

**Cons:**
- Limited commerce features
- Manual payment integration
- No built-in order management
- Limited scalability

**When to choose:**
- MVP/prototype stage
- Very small product catalog
- Limited budget
- Simple requirements

### Alternative 2: Shopify + Sanity (No-code friendly)

**Pros:**
- Mature platform
- Extensive app ecosystem
- No backend maintenance
- PCI compliant out of the box

**Cons:**
- Monthly fees even at low volume
- Transaction fees (2% on Basic plan)
- Less flexibility
- Vendor lock-in
- Not optimized for Iran market

**When to choose:**
- Non-technical team
- Need quick launch
- Want managed solution
- International customers primarily

### Alternative 3: WooCommerce + Headless (WordPress-based)

**Pros:**
- Familiar to many developers
- Large plugin ecosystem
- Low cost
- Good for Iran market plugins

**Cons:**
- PHP-based (less modern)
- WordPress overhead
- Security concerns
- Not as performant

**When to choose:**
- Team experienced with WordPress
- Existing WordPress infrastructure
- Need specific plugins
- Budget-conscious

### Alternative 4: Build Custom Backend (Full Control)

**Pros:**
- Complete customization
- No vendor lock-in
- Optimized for your exact needs

**Cons:**
- High development cost
- Long development time
- Maintenance burden
- Need security expertise

**When to choose:**
- Very specific requirements
- Large team
- Long-term project
- Need full control

---

## Conclusion

### Why Medusa is Recommended

For your SharifGPT platform, **Medusa.js** is the best choice because:

1. **Modern Architecture**: Built for headless commerce with Next.js
2. **Full Commerce Features**: Cart, checkout, orders, customers, inventory
3. **Flexible**: Highly customizable for digital products
4. **Developer-Friendly**: Great API, good documentation, TypeScript support
5. **Cost-Effective**: Open-source, scales with your business
6. **Iran-Friendly**: Can integrate with Iranian payment gateways
7. **Digital Product Support**: Perfect for your use case
8. **Active Community**: Growing ecosystem and support

### Success Criteria

Your Medusa integration will be successful when:
- ✅ Customers can purchase products with real payments
- ✅ Digital products are delivered automatically
- ✅ Order management is streamlined
- ✅ Prices and inventory are centrally managed
- ✅ Discounts and promotions work correctly
- ✅ Customer accounts track purchase history
- ✅ Analytics provide business insights
- ✅ System handles expected traffic load
- ✅ Data is secure and backed up
- ✅ Revenue increases with better UX

### Next Steps

After approving this plan:

1. **Immediate (This Week)**:
   - Review and finalize plan
   - Set up development environments
   - Create Medusa project
   - Configure databases

2. **Short-term (Next 2 Weeks)**:
   - Migrate products to Medusa
   - Set up sync service
   - Configure payment gateways (test mode)

3. **Medium-term (Next Month)**:
   - Complete frontend integration
   - Thorough testing
   - Security audit
   - Soft launch to beta users

4. **Long-term (2-3 Months)**:
   - Full production launch
   - Monitor and optimize
   - Gather feedback
   - Plan enhancements

---

## Appendix

### Useful Resources

**Medusa Documentation:**
- https://docs.medusajs.com/
- https://github.com/medusajs/medusa

**Payment Gateways:**
- Zarinpal: https://www.zarinpal.com/
- Stripe: https://stripe.com/docs
- PayPal: https://developer.paypal.com/

**Iranian Payment Gateways:**
- Zarinpal: Most popular
- Mellat Bank: Direct bank gateway
- Saman Bank: Another option
- Pasargad: Government-backed

**Community:**
- Medusa Discord: https://discord.gg/medusajs
- Sanity Slack: https://slack.sanity.io/

### Glossary

- **SKU**: Stock Keeping Unit - unique product identifier
- **Variant**: Product option (e.g., "1 Month" vs "6 Months")
- **Line Item**: Individual item in cart/order
- **Fulfillment**: Process of delivering product to customer
- **Region**: Geographic area with specific currency and tax rules
- **Price List**: Group of prices for specific customer segments
- **Idempotency**: Ensuring same operation isn't performed twice
- **Webhook**: HTTP callback triggered by events
- **JWT**: JSON Web Token for authentication

---

**Document Version**: 1.0
**Last Updated**: October 2024
**Author**: AI Assistant
**Status**: Ready for Review

This plan provides a complete roadmap for integrating Medusa.js with your existing Sanity-based e-commerce platform. The phased approach ensures manageable implementation while maintaining business continuity. The separation of concerns (Sanity for content, Medusa for commerce) creates a robust, scalable architecture that can grow with your business.

