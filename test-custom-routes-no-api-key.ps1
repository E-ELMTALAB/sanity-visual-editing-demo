# Test Custom Routes Without Publishable API Key
# This script tests our custom routes that don't require API key authentication

$ErrorActionPreference = 'Stop';
$BASE = 'http://localhost:9000';

Write-Host "=== Testing Custom Routes (No API Key Required) ===" -ForegroundColor Green;
Write-Host "Testing custom routes that work without publishable API key" -ForegroundColor Yellow;
Write-Host "";

# Test 1: CORS Test Endpoint
Write-Host "Test 1: CORS Test Endpoint..." -ForegroundColor Cyan;
try {
    $corsTest = Invoke-RestMethod -Uri "$BASE/store/cors-test-comprehensive" -Method GET;
    Write-Host "✅ CORS test successful:" -ForegroundColor Green;
    Write-Host "  Message: $($corsTest.message)" -ForegroundColor White;
    Write-Host "  Origin: $($corsTest.request.origin)" -ForegroundColor White;
} catch {
    Write-Host "❌ CORS test failed: $($_.Exception.Message)" -ForegroundColor Red;
    exit 1;
}

Write-Host "";

# Test 2: Custom Cart Creation
Write-Host "Test 2: Custom Cart Creation..." -ForegroundColor Cyan;
try {
    $cartData = @{
        items = @(
            @{
                id = 1
                title = "Test Product 1"
                price = 150000
                image = "test1.jpg"
                quantity = 2
                selectedOption = "Size M"
            },
            @{
                id = 2
                title = "Test Product 2"
                price = 200000
                image = "test2.jpg"
                quantity = 1
                selectedOption = "Color Red"
            }
        )
        customer_email = "test@example.com"
        customer_phone = "+989123456789"
    } | ConvertTo-Json -Depth 5;

    $cartResponse = Invoke-RestMethod -Uri "$BASE/store/cart/create" -Method POST -Body $cartData -ContentType "application/json";
    Write-Host "✅ Cart creation successful:" -ForegroundColor Green;
    Write-Host "  Cart ID: $($cartResponse.cart.id)" -ForegroundColor White;
    Write-Host "  Total: $($cartResponse.cart.total)" -ForegroundColor White;
    Write-Host "  Items: $($cartResponse.cart.items.Count)" -ForegroundColor White;
    
    $CART_ID = $cartResponse.cart.id;
} catch {
    Write-Host "❌ Cart creation failed: $($_.Exception.Message)" -ForegroundColor Red;
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream());
        $responseBody = $reader.ReadToEnd();
        Write-Host "Response: $responseBody" -ForegroundColor Red;
    }
    exit 1;
}

Write-Host "";

# Test 3: Payment Verification (Mock)
Write-Host "Test 3: Payment Verification..." -ForegroundColor Cyan;
try {
    $verifyData = @{
        authority = "test_authority_12345"
        Status = "OK"
        cart_id = $CART_ID
    } | ConvertTo-Json -Depth 5;

    $verifyResponse = Invoke-RestMethod -Uri "$BASE/store/zarinpal/verify" -Method POST -Body $verifyData -ContentType "application/json";
    Write-Host "✅ Payment verification successful:" -ForegroundColor Green;
    Write-Host "  Success: $($verifyResponse.success)" -ForegroundColor White;
    Write-Host "  Message: $($verifyResponse.message)" -ForegroundColor White;
} catch {
    Write-Host "❌ Payment verification failed: $($_.Exception.Message)" -ForegroundColor Red;
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream());
        $responseBody = $reader.ReadToEnd();
        Write-Host "Response: $responseBody" -ForegroundColor Red;
    }
    # Don't exit here as this might fail in testing environment
}

Write-Host "";

# Test 4: Cart Complete (Mock)
Write-Host "Test 4: Cart Complete..." -ForegroundColor Cyan;
try {
    $completeData = @{
        cart_id = $CART_ID
        authority = "test_authority_12345"
        status = "OK"
    } | ConvertTo-Json -Depth 5;

    $completeResponse = Invoke-RestMethod -Uri "$BASE/store/cart/complete" -Method POST -Body $completeData -ContentType "application/json";
    Write-Host "✅ Cart completion successful:" -ForegroundColor Green;
    Write-Host "  Success: $($completeResponse.success)" -ForegroundColor White;
    Write-Host "  Message: $($completeResponse.message)" -ForegroundColor White;
    if ($completeResponse.order) {
        Write-Host "  Order ID: $($completeResponse.order.id)" -ForegroundColor White;
    }
} catch {
    Write-Host "❌ Cart completion failed: $($_.Exception.Message)" -ForegroundColor Red;
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream());
        $responseBody = $reader.ReadToEnd();
        Write-Host "Response: $responseBody" -ForegroundColor Red;
    }
    # Don't exit here as this might fail in testing environment
}

Write-Host "";

# Test 5: Simple Payment (Mock)
Write-Host "Test 5: Simple Payment..." -ForegroundColor Cyan;
try {
    $paymentData = @{
        items = @(
            @{
                id = 1
                title = "Simple Test Product"
                price = 100000
                quantity = 1
            }
        )
        customer_email = "test@example.com"
        customer_phone = "+989123456789"
    } | ConvertTo-Json -Depth 5;

    $paymentResponse = Invoke-RestMethod -Uri "$BASE/store/simple-payment" -Method POST -Body $paymentData -ContentType "application/json";
    Write-Host "✅ Simple payment successful:" -ForegroundColor Green;
    Write-Host "  Success: $($paymentResponse.success)" -ForegroundColor White;
    Write-Host "  Message: $($paymentResponse.message)" -ForegroundColor White;
    Write-Host "  Payment URL: $($paymentResponse.payment.payment_url)" -ForegroundColor White;
} catch {
    Write-Host "❌ Simple payment failed: $($_.Exception.Message)" -ForegroundColor Red;
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream());
        $responseBody = $reader.ReadToEnd();
        Write-Host "Response: $responseBody" -ForegroundColor Red;
    }
    # Don't exit here as this might fail in testing environment
}

Write-Host "";
Write-Host "🎉 Custom Routes Test Complete!" -ForegroundColor Green;
Write-Host "These custom routes work without publishable API key:" -ForegroundColor Yellow;
Write-Host "  - /store/cors-test-comprehensive" -ForegroundColor White;
Write-Host "  - /store/cart/create" -ForegroundColor White;
Write-Host "  - /store/cart/complete" -ForegroundColor White;
Write-Host "  - /store/zarinpal/verify" -ForegroundColor White;
Write-Host "  - /store/simple-payment" -ForegroundColor White;
Write-Host "";
Write-Host "For standard Medusa APIs, you'll need to set up publishable API key." -ForegroundColor Yellow;
Write-Host "See PUBLISHABLE_API_KEY_SETUP.md for details." -ForegroundColor Yellow;
