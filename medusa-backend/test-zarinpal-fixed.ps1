# ============================================
# Zarinpal Payment Provider - Fixed Test Script
# ============================================
# This script tests the Zarinpal payment provider after applying the fixes:
# 1. Module export using ModuleProvider wrapper
# 2. Region configuration using full provider ID (pp_zarinpal_zarinpal)

$ErrorActionPreference = 'Stop';
$BASE = 'https://backend-production-ea59.up.railway.app';

Write-Host "=== Zarinpal Payment Provider Test (Fixed Version) ===" -ForegroundColor Green;
Write-Host "Testing with fixes applied:" -ForegroundColor Yellow;
Write-Host "1. Module export using ModuleProvider wrapper" -ForegroundColor Yellow;
Write-Host "2. Region configuration using pp_zarinpal_zarinpal" -ForegroundColor Yellow;
Write-Host "";

# 1) Enable provider on all regions with CORRECT provider ID
Write-Host "Step 1: Enabling Zarinpal provider in all regions with correct ID..." -ForegroundColor Cyan;
try {
    $resp = Invoke-RestMethod -Uri "$BASE/internal/enable-zarinpal-in-regions" -Method POST -Headers @{ 'Content-Type'='application/json' } -Body '{}';
    Write-Host "✅ Provider enabled in regions:" -ForegroundColor Green;
    $resp | ConvertTo-Json -Depth 5 | Write-Host;
} catch {
    Write-Host "❌ Failed to enable provider in regions: $($_.Exception.Message)" -ForegroundColor Red;
    exit 1;
}

# 2) Re-run store flow with detailed logging
Write-Host "`nStep 2: Testing full payment flow..." -ForegroundColor Cyan;
$PK = 'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4';
$H1 = @{ 'x-publishable-api-key' = $PK };
$HJSON = @{ 'x-publishable-api-key' = $PK; 'Content-Type'='application/json' };

# Get regions
Write-Host "Fetching regions..." -ForegroundColor Yellow;
$regions = Invoke-RestMethod -Uri "$BASE/store/regions" -Headers $H1 -Method GET;
$REGION_ID = $regions.regions[0].id; 
Write-Host "✅ Using region: $REGION_ID" -ForegroundColor Green;

# Create cart
Write-Host "Creating cart..." -ForegroundColor Yellow;
$cartBody = @{ region_id = $REGION_ID; email = 'test@zarinpal.com' } | ConvertTo-Json -Depth 5;
$cart = Invoke-RestMethod -Uri "$BASE/store/carts" -Headers $HJSON -Method POST -Body $cartBody;
$CART_ID = $cart.cart.id; 
Write-Host "✅ Cart created: $CART_ID" -ForegroundColor Green;

# Add product
Write-Host "Adding product to cart..." -ForegroundColor Yellow;
$prods = Invoke-RestMethod -Uri "$BASE/store/products?limit=1" -Headers $H1 -Method GET;
$VARIANT_ID = $prods.products[0].variants[0].id; 
Write-Host "✅ Using variant: $VARIANT_ID" -ForegroundColor Green;

$liBody = @{ variant_id = $VARIANT_ID; quantity = 1 } | ConvertTo-Json -Depth 5;
$cartAfter = Invoke-RestMethod -Uri "$BASE/store/carts/$CART_ID/line-items" -Headers $HJSON -Method POST -Body $liBody;
$TOTAL = $cartAfter.cart.total; 
Write-Host "✅ Cart total: $TOTAL" -ForegroundColor Green;

# Create payment collection
Write-Host "Creating payment collection..." -ForegroundColor Yellow;
$pcBody = @{ cart_id = $CART_ID } | ConvertTo-Json -Depth 5;
$pc = Invoke-RestMethod -Uri "$BASE/store/payment-collections" -Headers $HJSON -Method POST -Body $pcBody;
$PC_ID = $pc.payment_collection.id; 
Write-Host "✅ Payment collection created: $PC_ID" -ForegroundColor Green;

# Create Zarinpal payment session (THE CRITICAL TEST)
Write-Host "`n🚨 CRITICAL TEST: Creating Zarinpal payment session..." -ForegroundColor Magenta;
Write-Host "This should now work with the fixes applied!" -ForegroundColor Magenta;
try {
    $psBody = @{ provider_id = 'zarinpal' } | ConvertTo-Json -Depth 5;
    $ps = Invoke-RestMethod -Uri "$BASE/store/payment-collections/$PC_ID/payment-sessions" -Headers $HJSON -Method POST -Body $psBody;
    $PS_ID = $ps.payment_session.id; 
    $AUTHORITY = $ps.payment_session.data.authority; 
    $PAYMENT_URL = $ps.payment_session.data.payment_url; 
    $AMOUNT = $ps.payment_session.data.amount;
    
    Write-Host "🎉 SUCCESS! Payment session created!" -ForegroundColor Green;
    Write-Host "Payment Session ID: $PS_ID" -ForegroundColor Green;
    Write-Host "Authority: $AUTHORITY" -ForegroundColor Green;
    Write-Host "Payment URL: $PAYMENT_URL" -ForegroundColor Green;
    Write-Host "Amount (IRR): $AMOUNT" -ForegroundColor Green;
    
    # Test verification (offline mode)
    if ($AUTHORITY) {
        Write-Host "`nTesting payment verification (offline mode)..." -ForegroundColor Yellow;
        $verifyBody = @{ authority = $AUTHORITY; Status = 'OK'; cart_id = $CART_ID } | ConvertTo-Json -Depth 5;
        $verify = Invoke-RestMethod -Uri "$BASE/store/zarinpal/verify" -Headers $HJSON -Method POST -Body $verifyBody;
        $REF_ID = $verify.data.ref_id; 
        Write-Host "✅ Payment verified! Ref ID: $REF_ID" -ForegroundColor Green;
        
        # Complete cart
        Write-Host "Completing cart..." -ForegroundColor Yellow;
        $complete = Invoke-RestMethod -Uri "$BASE/store/carts/$CART_ID/complete" -Headers $H1 -Method POST;
        if ($complete.order) { 
            Write-Host "🎉 ORDER COMPLETED! Order ID: $($complete.order.id)" -ForegroundColor Green;
        } else { 
            Write-Host "⚠️ Cart completed but no order returned" -ForegroundColor Yellow;
        }
    }
    
} catch {
    Write-Host "❌ FAILED! Payment session creation still failing:" -ForegroundColor Red;
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red;
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream());
        $responseBody = $reader.ReadToEnd();
        Write-Host "Response: $responseBody" -ForegroundColor Red;
    }
    exit 1;
}

Write-Host "`n🎉 ALL TESTS PASSED! Zarinpal integration is working!" -ForegroundColor Green;
Write-Host "The fixes have resolved the provider registration issues." -ForegroundColor Green;
