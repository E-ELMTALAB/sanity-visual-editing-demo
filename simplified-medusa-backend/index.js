const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { products, promotions, saveData, getData } = require('./mock-data');

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  try {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  } catch (e) {
    stripe = null;
  }
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin-secret-key';

const orders = [];

// Middleware to verify admin key
const verifyAdmin = (req, res, next) => {
  const key = req.headers['x-admin-key'] || req.query.admin_key;
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

function findProduct(id) {
  return getData().products.find((p) => p.id === id);
}

function applyPromotion(subtotal_cents, code) {
  if (!code) return { discount_cents: 0, promotion: null };
  const promo = getData().promotions.find((p) => p.code === code);
  if (!promo || !promo.is_active) return { discount_cents: 0, promotion: null };

  let discount_cents = 0;
  if (promo.type === 'percentage') {
    discount_cents = Math.round((subtotal_cents * promo.value) / 100);
  } else if (promo.type === 'fixed') {
    discount_cents = promo.value_cents || 0;
  }
  if (discount_cents > subtotal_cents) discount_cents = subtotal_cents;
  return { discount_cents, promotion: promo };
}

function calculateCart(items, promoCode, currency = 'usd') {
  // items: [{ product_id, variant_id?, quantity }]
  const lines = [];
  let subtotal_cents = 0;
  
  for (const it of items) {
    const product = findProduct(it.product_id);
    if (!product) continue;
    
    const qty = Math.max(0, Math.floor(it.quantity || 1));
    let variant = null;
    let price_cents = 0;
    
    // Find variant and its price for the requested currency
    if (it.variant_id && product.variants) {
      variant = product.variants.find(v => v.id === it.variant_id);
    } else if (product.variants && product.variants.length > 0) {
      variant = product.variants[0];
    }
    
    if (variant) {
      const priceObj = variant.prices?.find(p => p.currency_code === currency);
      price_cents = priceObj?.amount || variant.prices?.[0]?.amount || 0;
    }
    
    const line_total = price_cents * qty;
    subtotal_cents += line_total;
    
    lines.push({
      product_id: product.id,
      product_title: product.title,
      variant_id: variant?.id || null,
      variant_title: variant?.title || null,
      quantity: qty,
      unit_price_cents: price_cents,
      line_total_cents: line_total
    });
  }

  const { discount_cents, promotion } = applyPromotion(subtotal_cents, promoCode);
  const tax_rate = parseFloat(process.env.DEFAULT_TAX_RATE || '0.1');
  const taxed_base = subtotal_cents - discount_cents;
  const tax_cents = Math.round(taxed_base * tax_rate);
  const shipping_cents = 0;
  const total_cents = Math.max(0, taxed_base + tax_cents + shipping_cents);

  return {
    lines,
    subtotal_cents,
    discount_cents,
    promotion: promotion || null,
    tax_cents,
    shipping_cents,
    total_cents,
    currency
  };
}

// ============================================
// PUBLIC ENDPOINTS
// ============================================

app.get('/', (req, res) => {
  res.json({
    name: 'simplified-medusa-backend',
    version: '0.1.0',
    description: 'Medusa-compatible backend with configurable products and promotions'
  });
});

// Helper: Format product for API response (Medusa-compatible)
function formatProductResponse(product, expandPrices = false) {
  const formatted = {
    id: product.id,
    title: product.title,
    subtitle: product.subtitle || null,
    description: product.description || null,
    handle: product.handle || null,
    is_giftcard: product.is_giftcard || false,
    discountable: product.discountable !== false,
    thumbnail: product.thumbnail || null,
    collection_id: product.collection_id || null,
    type_id: product.type_id || null,
    weight: product.weight || null,
    length: product.length || null,
    height: product.height || null,
    width: product.width || null,
    hs_code: product.hs_code || null,
    origin_country: product.origin_country || null,
    mid_code: product.mid_code || null,
    material: product.material || null,
    created_at: product.created_at || new Date().toISOString(),
    updated_at: product.updated_at || new Date().toISOString(),
    type: product.type || null,
    collection: product.collection || null,
    tags: product.tags || [],
    images: product.images || [],
    options: product.options || [],
    variants: (product.variants || []).map(v => ({
      id: v.id,
      title: v.title || null,
      sku: v.sku || null,
      barcode: v.barcode || null,
      ean: v.ean || null,
      upc: v.upc || null,
      allow_backorder: v.allow_backorder || false,
      manage_inventory: v.manage_inventory !== false,
      hs_code: v.hs_code || null,
      origin_country: v.origin_country || null,
      mid_code: v.mid_code || null,
      material: v.material || null,
      weight: v.weight || null,
      length: v.length || null,
      height: v.height || null,
      width: v.width || null,
      metadata: v.metadata || null,
      variant_rank: v.variant_rank || 0,
      product_id: v.product_id || product.id,
      created_at: v.created_at || new Date().toISOString(),
      updated_at: v.updated_at || new Date().toISOString(),
      deleted_at: null,
      options: v.options || [],
      // If expandPrices, include full price objects; otherwise null (Medusa default)
      prices: expandPrices && v.prices ? v.prices.map(p => ({
        id: p.id || `price_${Date.now()}_${Math.random()}`,
        title: p.title || null,
        currency_code: p.currency_code,
        min_quantity: p.min_quantity || null,
        max_quantity: p.max_quantity || null,
        rules_count: p.rules_count || 0,
        price_set_id: p.price_set_id || `pset_${Date.now()}`,
        price_list_id: p.price_list_id || null,
        price_list: p.price_list || null,
        raw_amount: p.raw_amount || { value: String(p.amount), precision: 2 },
        created_at: p.created_at || new Date().toISOString(),
        updated_at: p.updated_at || new Date().toISOString(),
        deleted_at: null,
        amount: p.amount
      })) : null
    }))
  };
  return formatted;
}

// List products - Medusa /store/products endpoint
app.get('/store/products', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 100, 100);
  const offset = parseInt(req.query.offset) || 0;
  const handle = req.query.handle;
  const fields = req.query.fields || '';
  const expandPrices = fields.includes('variants.prices') || fields.includes('*variants.prices');
  
  let allProducts = getData().products;
  
  // Filter by handle if provided
  if (handle) {
    allProducts = allProducts.filter(p => p.handle === handle);
  }
  
  const products = allProducts.slice(offset, offset + limit).map(p => formatProductResponse(p, expandPrices));
  
  res.json({
    products,
    count: allProducts.length,
    offset,
    limit
  });
});

// Get single product - Medusa /store/products/:id endpoint
app.get('/store/products/:id', (req, res) => {
  const fields = req.query.fields || '';
  const expandPrices = fields.includes('variants.prices') || fields.includes('*variants.prices');
  const p = findProduct(req.params.id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json({ product: formatProductResponse(p, expandPrices) });
});

// Legacy /products endpoints for backward compatibility
app.get('/products', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 100, 100);
  const offset = parseInt(req.query.offset) || 0;
  const handle = req.query.handle;
  const fields = req.query.fields || '';
  const expandPrices = fields.includes('variants.prices') || fields.includes('*variants.prices');
  
  let allProducts = getData().products;
  
  if (handle) {
    allProducts = allProducts.filter(p => p.handle === handle);
  }
  
  const products = allProducts.slice(offset, offset + limit).map(p => formatProductResponse(p, expandPrices));
  
  res.json({
    products,
    count: allProducts.length,
    offset,
    limit
  });
});

app.get('/products/:id', (req, res) => {
  const fields = req.query.fields || '';
  const expandPrices = fields.includes('variants.prices') || fields.includes('*variants.prices');
  const p = findProduct(req.params.id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json({ product: formatProductResponse(p, expandPrices) });
});

// List promotions
app.get('/promotions', (req, res) => {
  const allPromos = getData().promotions;
  res.json({
    promotions: allPromos.map(p => ({
      id: p.id,
      code: p.code,
      type: p.type,
      description: p.description,
      value: p.value,
      value_cents: p.value_cents,
      is_active: p.is_active
    })),
    count: allPromos.length
  });
});

// Validate promotion code
app.get('/promotions/validate', (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'code required' });
  const promo = getData().promotions.find((p) => p.code === code);
  if (!promo || !promo.is_active) return res.status(404).json({ valid: false });
  res.json({ valid: true, promotion: promo });
});

// Calculate cart (legacy)
app.post('/cart', (req, res) => {
  const { items = [], promotion_code, currency = 'usd' } = req.body;
  const result = calculateCart(items, promotion_code, currency);
  res.json(result);
});

// Create cart - Medusa /store/cart/create endpoint
app.post('/store/cart/create', (req, res) => {
  const { items = [], customer_email, customer_phone, currency = 'usd' } = req.body;
  const cart = calculateCart(items, null, currency);
  
  const cartResponse = {
    id: `cart_${Date.now()}`,
    currency,
    items: cart.lines.map(line => ({
      id: `item_${Date.now()}_${Math.random()}`,
      product_id: line.product_id,
      product_title: line.product_title,
      variant_id: line.variant_id,
      variant_title: line.variant_title,
      quantity: line.quantity,
      unit_price: { ...cart },
      unit_price_cents: line.unit_price_cents,
      line_total_cents: line.line_total_cents
    })),
    subtotal_cents: cart.subtotal_cents,
    discount_cents: cart.discount_cents,
    tax_cents: cart.tax_cents,
    shipping_cents: 0,
    total_cents: cart.total_cents,
    customer_email: customer_email || null,
    customer_phone: customer_phone || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  res.json(cartResponse);
});

// Initiate payment - Medusa /store/cart/initiate-payment endpoint
app.post('/store/cart/initiate-payment', async (req, res) => {
  const { cart_id, customer_email, customer_phone } = req.body;
  
  if (!cart_id) {
    return res.status(400).json({ error: 'cart_id required' });
  }
  
  // In a real system, we'd retrieve the cart from storage
  // For now, we create a minimal order from the cart ID
  const order = {
    id: `order_${Date.now()}`,
    cart_id,
    status: 'pending',
    customer_email: customer_email || null,
    customer_phone: customer_phone || null,
    created_at: new Date().toISOString()
  };
  orders.push(order);
  
  // Zarinpal flow
  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  const sandbox = (process.env.ZARINPAL_SANDBOX || 'true') === 'true';
  const callbackBase = process.env.ZARINPAL_CALLBACK_BASE || `${req.protocol}://${req.get('host')}`;
  const conversionRate = parseFloat(process.env.ZARINPAL_CONVERSION_RATE || '0');
  
  if (merchantId && conversionRate > 0) {
    // Mock total for demo
    const amount_irr = Math.round(100 * conversionRate); // $100 default
    const callbackUrl = `${callbackBase.replace(/\/$/, '')}/pay/zarinpal/callback?order_id=${encodeURIComponent(order.id)}`;
    const zarinpalEndpoint = sandbox ? 'https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequest.json' : 'https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json';
    
    try {
      const resp = await fetch(zarinpalEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          MerchantID: merchantId,
          Amount: amount_irr,
          Description: `Cart ${cart_id}`,
          Email: customer_email || undefined,
          CallbackURL: callbackUrl
        })
      });
      
      const j = await resp.json();
      if (j && parseInt(j.Status, 10) === 100) {
        const authority = j.Authority;
        const payment_url = sandbox ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}` : `https://www.zarinpal.com/pg/StartPay/${authority}`;
        order.zarinpal = { authority, amount_irr };
        
        return res.json({
          payment: {
            id: `pay_${Date.now()}`,
            order_id: order.id,
            amount: amount_irr,
            currency_code: 'irr',
            status: 'pending',
            provider: 'zarinpal',
            data: {
              authority,
              payment_url
            }
          },
          payment_url,
          authority
        });
      } else {
        return res.status(502).json({ error: 'zarinpal_error', detail: j });
      }
    } catch (err) {
      return res.status(500).json({ error: 'zarinpal_request_failed', message: err.message });
    }
  }
  
  // Fallback to mock
  const payment_url = `${req.protocol}://${req.get('host')}/pay/mock/${order.id}`;
  res.json({
    payment: {
      id: `pay_${Date.now()}`,
      order_id: order.id,
      status: 'pending',
      provider: 'mock'
    },
    payment_url
  });
});

// Verify Zarinpal payment - Medusa /store/zarinpal/verify endpoint
app.post('/store/zarinpal/verify', async (req, res) => {
  const { authority, Status, cart_id } = req.body;
  
  if (!authority) {
    return res.status(400).json({ error: 'authority required' });
  }
  
  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  if (!merchantId) {
    return res.status(500).json({ error: 'Zarinpal not configured' });
  }
  
  // Status OK means successful payment from user
  if (String(Status) !== 'OK') {
    return res.json({
      success: false,
      message: 'Payment cancelled or failed',
      status: Status || 'CANCELLED'
    });
  }
  
  const sandbox = (process.env.ZARINPAL_SANDBOX || 'true') === 'true';
  const verificationEndpoint = sandbox 
    ? 'https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentVerification.json' 
    : 'https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json';
  
  try {
    // Find the order by authority to get the correct amount
    // For now, use mock amount
    const amount_irr = Math.round(100 * (parseFloat(process.env.ZARINPAL_CONVERSION_RATE || '0') || 42500));
    
    const resp = await fetch(verificationEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        MerchantID: merchantId,
        Authority: authority,
        Amount: amount_irr
      })
    });
    
    const j = await resp.json();
    
    // Zarinpal verification returns Status === 100 on success
    if (j && parseInt(j.Status, 10) === 100) {
      return res.json({
        success: true,
        message: 'Payment verified',
        ref_id: j.RefID,
        status: 'VERIFIED',
        payment_data: j
      });
    } else {
      return res.json({
        success: false,
        message: 'Payment verification failed',
        status: 'VERIFICATION_FAILED',
        error_code: j?.Status
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'verification_failed',
      message: err.message
    });
  }
});

// Create checkout / order (legacy)
app.post('/checkout', async (req, res) => {
  const { items = [], promotion_code, currency = 'usd', customer_email } = req.body;
  const cart = calculateCart(items, promotion_code, currency);

  const order = {
    id: `order_${Date.now()}`,
    items: cart.lines,
    promotion_code: promotion_code || null,
    subtotal_cents: cart.subtotal_cents,
    discount_cents: cart.discount_cents,
    tax_cents: cart.tax_cents,
    total_cents: cart.total_cents,
    currency,
    status: 'pending',
    customer_email: customer_email || null,
    created_at: new Date().toISOString()
  };
  orders.push(order);
  // Decide payment provider: Zarinpal preferred if configured and requested
  const useZarinpal = process.env.ZARINPAL_MERCHANT_ID && (req.body.payment_provider === 'zarinpal' || process.env.ZARINPAL_MERCHANT_ID);

  if (useZarinpal) {
    // Zarinpal requires amount in IRR. We expect `ZARINPAL_CONVERSION_RATE` to convert from USD cents to IRR.
    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    const sandbox = (process.env.ZARINPAL_SANDBOX || 'true') === 'true';
    const callbackBase = process.env.ZARINPAL_CALLBACK_BASE || `${req.protocol}://${req.get('host')}`;
    const conversionRate = parseFloat(process.env.ZARINPAL_CONVERSION_RATE || '0');

    if (!merchantId || !conversionRate || conversionRate <= 0) {
      return res.status(500).json({ error: 'zarinpal_misconfigured', message: 'ZARINPAL_MERCHANT_ID and ZARINPAL_CONVERSION_RATE must be set' });
    }

    // Convert total to IRR (integer). If currency is already 'irr', assume total_cents is in IRR-smallest-unit.
    let amount_irr = 0;
    if (currency === 'irr') {
      // total_cents interpreted as IRR
      amount_irr = Math.round(order.total_cents);
    } else {
      // total_cents is in cents of another currency (e.g., USD). Convert to major unit then to IRR.
      const major = order.total_cents / 100; // e.g., $329.99
      amount_irr = Math.round(major * conversionRate);
    }

    const callbackUrl = `${callbackBase.replace(/\/$/, '')}/pay/zarinpal/callback?order_id=${encodeURIComponent(order.id)}`;
    const zarinpalEndpoint = sandbox ? 'https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequest.json' : 'https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json';

    try {
      const resp = await fetch(zarinpalEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          MerchantID: merchantId,
          Amount: amount_irr,
          Description: `Order ${order.id}`,
          Email: customer_email || undefined,
          Mobile: undefined,
          CallbackURL: callbackUrl
        })
      });

      const j = await resp.json();
      // Zarinpal returns { Status: 100, Authority: '...' }
      if (j && parseInt(j.Status, 10) === 100) {
        const authority = j.Authority;
        const payment_url = sandbox ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}` : `https://www.zarinpal.com/pg/StartPay/${authority}`;
        order.zarinpal = { authority, amount_irr };
        res.json({ order: order, payment_url, provider: 'zarinpal', authority });
      } else {
        res.status(502).json({ error: 'zarinpal_error', detail: j });
      }
    } catch (err) {
      res.status(500).json({ error: 'zarinpal_request_failed', message: err.message });
    }
    return;
  }

  // Fallback: Stripe if configured
  if (stripe) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: order.total_cents,
        currency: currency,
        receipt_email: customer_email || undefined,
        metadata: { order_id: order.id }
      });
      order.payment_intent = paymentIntent.id;
      res.json({ 
        order: order, 
        client_secret: paymentIntent.client_secret 
      });
    } catch (err) {
      res.status(500).json({ error: 'stripe_error', message: err.message });
    }
  } else {
    // Mock payment URL for environments without Stripe or Zarinpal
    const payment_url = `${req.protocol}://${req.get('host')}/pay/mock/${order.id}`;
    res.json({ 
      order: order,
      payment_url 
    });
  }
});

// Zarinpal callback endpoint
app.get('/pay/zarinpal/callback', async (req, res) => {
  const { Authority, Status } = req.query;
  const orderId = req.query.order_id;
  if (!orderId) return res.status(400).send('order_id missing');

  const order = orders.find(o => o.id === orderId);
  if (!order) return res.status(404).send('order not found');

  if (!process.env.ZARINPAL_MERCHANT_ID) return res.status(500).send('Zarinpal not configured');

  if (!Authority || !Status) return res.status(400).send('Invalid callback');

  // If user cancelled or failed
  if (String(Status) !== 'OK') {
    order.status = 'cancelled';
    const failureRedirect = (process.env.FRONTEND_FAILURE_URL || '/').replace(/\/$/, '') + `?order_id=${encodeURIComponent(order.id)}`;
    return res.redirect(failureRedirect);
  }

  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  const sandbox = (process.env.ZARINPAL_SANDBOX || 'true') === 'true';
  const verificationEndpoint = sandbox ? 'https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentVerification.json' : 'https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json';

  const amount_irr = order.zarinpal?.amount_irr;
  if (!amount_irr) return res.status(400).send('order missing zarinpal amount');

  try {
    const resp = await fetch(verificationEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ MerchantID: merchantId, Authority: Authority, Amount: amount_irr })
    });
    const j = await resp.json();
    // Successful verification has Status === 100
    if (j && parseInt(j.Status, 10) === 100) {
      order.status = 'paid';
      order.zarinpal.verification = j;
      const successRedirect = (process.env.FRONTEND_SUCCESS_URL || '/').replace(/\/$/, '') + `?order_id=${encodeURIComponent(order.id)}&ref_id=${encodeURIComponent(j.RefID || '')}`;
      return res.redirect(successRedirect);
    } else {
      order.status = 'failed';
      order.zarinpal.verification = j;
      const failureRedirect = (process.env.FRONTEND_FAILURE_URL || '/').replace(/\/$/, '') + `?order_id=${encodeURIComponent(order.id)}`;
      return res.redirect(failureRedirect);
    }
  } catch (err) {
    return res.status(500).send('verification_failed');
  }
});

// Get order details
app.get('/orders/:id', (req, res) => {
  const o = orders.find((x) => x.id === req.params.id);
  if (!o) return res.status(404).json({ error: 'Order not found' });
  res.json({ order: o });
});

// Mock payment confirmation
app.get('/pay/mock/:orderId', (req, res) => {
  const o = orders.find((x) => x.id === req.params.orderId);
  if (!o) return res.status(404).send('Order not found');
  o.status = 'paid';
  res.send(`✅ Mock payment accepted for order ${o.id}`);
});

// ============================================
// ADMIN ENDPOINTS (Protected by X-Admin-Key header)
// ============================================

// Get all data (admin)
app.get('/admin/data', verifyAdmin, (req, res) => {
  res.json(getData());
});

// Update/upsert a product (admin)
app.post('/admin/products', verifyAdmin, (req, res) => {
  const productData = req.body;
  if (!productData.id) {
    return res.status(400).json({ error: 'Product id required' });
  }

  const data = getData();
  const idx = data.products.findIndex(p => p.id === productData.id);
  
  if (idx >= 0) {
    data.products[idx] = { ...data.products[idx], ...productData };
  } else {
    data.products.push(productData);
  }
  
  if (saveData(data)) {
    res.json({ success: true, product: data.products[idx >= 0 ? idx : data.products.length - 1] });
  } else {
    res.status(500).json({ error: 'Failed to save product' });
  }
});

// Delete product (admin)
app.delete('/admin/products/:id', verifyAdmin, (req, res) => {
  const data = getData();
  const idx = data.products.findIndex(p => p.id === req.params.id);
  
  if (idx < 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const removed = data.products.splice(idx, 1)[0];
  if (saveData(data)) {
    res.json({ success: true, message: 'Product deleted', product: removed });
  } else {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Update promotion (admin)
app.post('/admin/promotions', verifyAdmin, (req, res) => {
  const promoData = req.body;
  if (!promoData.id) {
    return res.status(400).json({ error: 'Promotion id required' });
  }

  const data = getData();
  const idx = data.promotions.findIndex(p => p.id === promoData.id);
  
  if (idx >= 0) {
    data.promotions[idx] = { ...data.promotions[idx], ...promoData };
  } else {
    data.promotions.push(promoData);
  }
  
  if (saveData(data)) {
    res.json({ success: true, promotion: data.promotions[idx >= 0 ? idx : data.promotions.length - 1] });
  } else {
    res.status(500).json({ error: 'Failed to save promotion' });
  }
});

// Delete promotion (admin)
app.delete('/admin/promotions/:id', verifyAdmin, (req, res) => {
  const data = getData();
  const idx = data.promotions.findIndex(p => p.id === req.params.id);
  
  if (idx < 0) {
    return res.status(404).json({ error: 'Promotion not found' });
  }
  
  const removed = data.promotions.splice(idx, 1)[0];
  if (saveData(data)) {
    res.json({ success: true, message: 'Promotion deleted', promotion: removed });
  } else {
    res.status(500).json({ error: 'Failed to delete promotion' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ simplified-medusa-backend listening on port ${PORT}`);
  console.log(`📁 Data loaded from data.json (${getData().products.length} products, ${getData().promotions.length} promotions)`);
  if (stripe) console.log(`💳 Stripe integration active`);
});
