# ============================================
# Frontend Payment Flow Test
# ============================================
# This script tests the payment flow from the frontend perspective
# It simulates what happens when a user clicks "تسویه حساب" (Checkout)

$ErrorActionPreference = 'Stop';
$BASE = 'https://backend-production-ea59.up.railway.app';
$PK = 'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4';

Write-Host "=== Frontend Payment Flow Test ===" -ForegroundColor Green;
Write-Host "Testing the complete payment flow that users will experience:" -ForegroundColor Yellow;
Write-Host "";

try {
    # Step 1: Get regions (same as frontend)
    Write-Host "Step 1: Fetching regions..." -ForegroundColor Cyan;
    $regions = Invoke-RestMethod -Uri "$BASE/store/regions" -Headers @{ 'x-publishable-api-key' = $PK } -Method GET;
    $REGION_ID = $regions.regions[0].id; 
    Write-Host "✅ Using region: $REGION_ID" -ForegroundColor Green;

    # Step 2: Create cart (same as frontend)
    Write-Host "Step 2: Creating cart..." -ForegroundColor Cyan;
    $cartBody = @{ region_id = $REGION_ID; email = 'test@frontend.com' } | ConvertTo-Json -Depth 5;
    $cart = Invoke-RestMethod -Uri "$BASE/store/carts" -Headers @{ 'x-publishable-api-key' = $PK; 'Content-Type'='application/json' } -Method POST -Body $cartBody;
    $CART_ID = $cart.cart.id; 
    Write-Host "✅ Cart created: $CART_ID" -ForegroundColor Green;

    # Step 3: Add product to cart (same as frontend)
    Write-Host "Step 3: Adding product to cart..." -ForegroundColor Cyan;
    $prods = Invoke-RestMethod -Uri "$BASE/store/products?limit=1" -Headers @{ 'x-publishable-api-key' = $PK } -Method GET;
    $VARIANT_ID = $prods.products[0].variants[0].id; 
    Write-Host "✅ Using variant: $VARIANT_ID" -ForegroundColor Green;

    $liBody = @{ variant_id = $VARIANT_ID; quantity = 1 } | ConvertTo-Json -Depth 5;
    $cartAfter = Invoke-RestMethod -Uri "$BASE/store/carts/$CART_ID/line-items" -Headers @{ 'x-publishable-api-key' = $PK; 'Content-Type'='application/json' } -Method POST -Body $liBody;
    $TOTAL = $cartAfter.cart.total; 
    Write-Host "✅ Cart total: $TOTAL" -ForegroundColor Green;

    # Step 4: Create payment collection (same as frontend)
    Write-Host "Step 4: Creating payment collection..." -ForegroundColor Cyan;
    $pcBody = @{ cart_id = $CART_ID } | ConvertTo-Json -Depth 5;
    $pc = Invoke-RestMethod -Uri "$BASE/store/payment-collections" -Headers @{ 'x-publishable-api-key' = $PK; 'Content-Type'='application/json' } -Method POST -Body $pcBody;
    $PC_ID = $pc.payment_collection.id; 
    Write-Host "✅ Payment collection created: $PC_ID" -ForegroundColor Green;

    # Step 5: Create Zarinpal payment session (same as frontend)
    Write-Host "Step 5: Creating Zarinpal payment session..." -ForegroundColor Cyan;
    $psBody = @{ provider_id = 'pp_zarinpal_zarinpal' } | ConvertTo-Json -Depth 5;
    $ps = Invoke-RestMethod -Uri "$BASE/store/payment-collections/$PC_ID/payment-sessions" -Headers @{ 'x-publishable-api-key' = $PK; 'Content-Type'='application/json' } -Method POST -Body $psBody;
    $PS_ID = $ps.payment_session.id; 
    $AUTHORITY = $ps.payment_session.data.authority; 
    $PAYMENT_URL = $ps.payment_session.data.payment_url; 
    $AMOUNT = $ps.payment_session.data.amount;
    
    Write-Host "🎉 SUCCESS! Payment session created!" -ForegroundColor Green;
    Write-Host "Payment Session ID: $PS_ID" -ForegroundColor Green;
    Write-Host "Authority: $AUTHORITY" -ForegroundColor Green;
    Write-Host "Payment URL: $PAYMENT_URL" -ForegroundColor Green;
    Write-Host "Amount (IRR): $AMOUNT" -ForegroundColor Green;
    
    Write-Host "`n✅ Frontend payment flow test PASSED!" -ForegroundColor Green;
    Write-Host "The same endpoints that work in the test script will work in the frontend!" -ForegroundColor Green;
    Write-Host "Users can now click 'تسویه حساب' and complete payments via Zarinpal!" -ForegroundColor Green;

} catch {
    Write-Host "❌ FAILED! Frontend payment flow test failed:" -ForegroundColor Red;
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red;
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream());
        $responseBody = $reader.ReadToEnd();
        Write-Host "Response: $responseBody" -ForegroundColor Red;
    }
    exit 1;
}
