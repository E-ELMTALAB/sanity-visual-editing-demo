# Zarinpal Payment Gateway Test Script
# This script tests the Zarinpal integration with your Medusa backend

$ErrorActionPreference = "Stop"

# Configuration (env override supported)
$BACKEND_URL = if ($env:BACKEND_URL) { $env:BACKEND_URL } else { "http://localhost:9000" }
$REGION_ID = "" # Will be fetched automatically
$CART_ID = ""
$PAYMENT_COLLECTION_ID = ""
$PAYMENT_SESSION_ID = ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Zarinpal Payment Gateway Test" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Function to make API calls
function Invoke-ApiCall {
    param (
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null
    )
    
    $uri = "$BACKEND_URL$Endpoint"
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    try {
        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json -Depth 10
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -Body $jsonBody
        } else {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers
        }
        return $response
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
        throw
    }
}

# Step 1: Get available regions
Write-Host "Step 1: Fetching available regions..." -ForegroundColor Yellow
try {
    $regions = Invoke-ApiCall -Method "GET" -Endpoint "/store/regions"
    if ($regions.regions.Count -gt 0) {
        $REGION_ID = $regions.regions[0].id
        Write-Host "✓ Region found: $REGION_ID" -ForegroundColor Green
        Write-Host "  Currency: $($regions.regions[0].currency_code)" -ForegroundColor Gray
    } else {
        Write-Host "✗ No regions found. Please create a region in Medusa Admin." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Failed to fetch regions" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Create a cart
Write-Host "Step 2: Creating a cart..." -ForegroundColor Yellow
try {
    $cartBody = @{
        region_id = $REGION_ID
        email = "test@zarinpal.com"
    }
    $cart = Invoke-ApiCall -Method "POST" -Endpoint "/store/carts" -Body $cartBody
    $CART_ID = $cart.cart.id
    Write-Host "✓ Cart created: $CART_ID" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to create cart" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Get available products
Write-Host "Step 3: Fetching products..." -ForegroundColor Yellow
try {
    $products = Invoke-ApiCall -Method "GET" -Endpoint "/store/products?limit=1"
    if ($products.products.Count -gt 0) {
        $product = $products.products[0]
        $variant = $product.variants[0]
        Write-Host "✓ Product found: $($product.title)" -ForegroundColor Green
        Write-Host "  Variant ID: $($variant.id)" -ForegroundColor Gray
        Write-Host "  Price: $($variant.calculated_price.calculated_amount)" -ForegroundColor Gray
        
        # Step 4: Add item to cart
        Write-Host ""
        Write-Host "Step 4: Adding item to cart..." -ForegroundColor Yellow
        $lineItemBody = @{
            variant_id = $variant.id
            quantity = 1
        }
        $cartWithItem = Invoke-ApiCall -Method "POST" -Endpoint "/store/carts/$CART_ID/line-items" -Body $lineItemBody
        Write-Host "✓ Item added to cart" -ForegroundColor Green
        Write-Host "  Total: $($cartWithItem.cart.total)" -ForegroundColor Gray
    } else {
        Write-Host "✗ No products found. Please create a product in Medusa Admin." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Failed to add item to cart" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 5: Initialize payment collection
Write-Host "Step 5: Initializing payment collection..." -ForegroundColor Yellow
try {
    $paymentCollection = Invoke-ApiCall -Method "POST" -Endpoint "/store/carts/$CART_ID/payment-collection"
    $PAYMENT_COLLECTION_ID = $paymentCollection.payment_collection.id
    Write-Host "✓ Payment collection created: $PAYMENT_COLLECTION_ID" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to create payment collection" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 6: Create Zarinpal payment session
Write-Host "Step 6: Creating Zarinpal payment session..." -ForegroundColor Yellow
try {
    $paymentSessionBody = @{
        provider_id = "zarinpal"
    }
    $paymentSession = Invoke-ApiCall -Method "POST" -Endpoint "/store/payment-collections/$PAYMENT_COLLECTION_ID/payment-sessions" -Body $paymentSessionBody
    $PAYMENT_SESSION_ID = $paymentSession.payment_session.id
    
    Write-Host "✓ Zarinpal payment session created!" -ForegroundColor Green
    Write-Host ""
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "Payment Details:" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "Session ID: $PAYMENT_SESSION_ID" -ForegroundColor White
    Write-Host "Authority: $($paymentSession.payment_session.data.authority)" -ForegroundColor White
    Write-Host "Amount: $($paymentSession.payment_session.data.amount) IRR" -ForegroundColor White
    Write-Host ""
    Write-Host "Payment URL:" -ForegroundColor Yellow
    Write-Host "$($paymentSession.payment_session.data.payment_url)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "Next Steps:" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "1. Open the Payment URL in your browser" -ForegroundColor White
    Write-Host "2. Complete the payment (use test card in sandbox mode)" -ForegroundColor White
    Write-Host "3. After payment, you'll be redirected to your callback URL" -ForegroundColor White
    Write-Host "4. Use the Authority code to verify payment:" -ForegroundColor White
    Write-Host ""
    Write-Host "   Verification Command:" -ForegroundColor Yellow
    Write-Host "   curl -X POST http://localhost:9000/store/zarinpal/verify \\" -ForegroundColor Gray
    Write-Host "     -H 'Content-Type: application/json' \\" -ForegroundColor Gray
    Write-Host "     -d '{" -ForegroundColor Gray
    Write-Host "       `"authority`": `"$($paymentSession.payment_session.data.authority)`"," -ForegroundColor Gray
    Write-Host "       `"Status`": `"OK`"," -ForegroundColor Gray
    Write-Host "       `"cart_id`": `"$CART_ID`"" -ForegroundColor Gray
    Write-Host "     }'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "5. Complete the order:" -ForegroundColor White
    Write-Host "   curl -X POST http://localhost:9000/store/carts/$CART_ID/complete" -ForegroundColor Gray
    Write-Host ""
    
    # Save details to file
    $testDetails = @{
        cart_id = $CART_ID
        payment_collection_id = $PAYMENT_COLLECTION_ID
        payment_session_id = $PAYMENT_SESSION_ID
        authority = $paymentSession.payment_session.data.authority
        payment_url = $paymentSession.payment_session.data.payment_url
        amount = $paymentSession.payment_session.data.amount
    }
    $testDetails | ConvertTo-Json -Depth 10 | Out-File "zarinpal-test-details.json"
    Write-Host "Test details saved to: zarinpal-test-details.json" -ForegroundColor Green
    
} catch {
    Write-Host "✗ Failed to create Zarinpal payment session" -ForegroundColor Red
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "  1. ZARINPAL_MERCHANT_ID is set in .env" -ForegroundColor Yellow
    Write-Host "  2. ZARINPAL_SANDBOX is set to true for testing" -ForegroundColor Yellow
    Write-Host "  3. Zarinpal provider is enabled in your region" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Test completed successfully! 🎉" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan

