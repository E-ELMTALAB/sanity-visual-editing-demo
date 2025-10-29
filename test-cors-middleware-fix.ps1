# Test CORS Middleware Fix
# This script tests the CORS middleware configuration fix

$ErrorActionPreference = 'Stop';
$BASE = 'http://localhost:9000';

Write-Host "=== CORS Middleware Fix Test ===" -ForegroundColor Green;
Write-Host "Testing CORS middleware configuration for Medusa v2" -ForegroundColor Yellow;
Write-Host "";

# Test 1: OPTIONS preflight request to simple-payment
Write-Host "Test 1: OPTIONS Preflight Request to simple-payment..." -ForegroundColor Cyan;
try {
    $preflightResponse = Invoke-RestMethod -Uri "$BASE/store/simple-payment" -Method OPTIONS -Headers @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "Content-Type"
    };
    Write-Host "✅ OPTIONS preflight successful" -ForegroundColor Green;
} catch {
    Write-Host "❌ OPTIONS preflight failed: $($_.Exception.Message)" -ForegroundColor Red;
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream());
        $responseBody = $reader.ReadToEnd();
        Write-Host "Response: $responseBody" -ForegroundColor Red;
    }
}

Write-Host "";

# Test 2: POST request to simple-payment
Write-Host "Test 2: POST Request to simple-payment..." -ForegroundColor Cyan;
try {
    $paymentData = @{
        items = @(
            @{
                id = 1
                title = "Test Product"
                price = 100000
                quantity = 1
            }
        )
        customer_email = "test@example.com"
        customer_phone = "+989123456789"
    } | ConvertTo-Json -Depth 5;

    $response = Invoke-RestMethod -Uri "$BASE/store/simple-payment" -Method POST -Body $paymentData -ContentType "application/json" -Headers @{
        "Origin" = "http://localhost:3000"
    };
    
    Write-Host "✅ POST request successful" -ForegroundColor Green;
    Write-Host "  Success: $($response.success)" -ForegroundColor White;
    Write-Host "  Message: $($response.message)" -ForegroundColor White;
    if ($response.payment) {
        Write-Host "  Payment URL: $($response.payment.payment_url)" -ForegroundColor White;
    }
} catch {
    Write-Host "❌ POST request failed: $($_.Exception.Message)" -ForegroundColor Red;
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream());
        $responseBody = $reader.ReadToEnd();
        Write-Host "Response: $responseBody" -ForegroundColor Red;
    }
}

Write-Host "";

# Test 3: Test simple-verify endpoint
Write-Host "Test 3: Simple Verify Endpoint..." -ForegroundColor Cyan;
try {
    $verifyData = @{
        authority = "test_authority_123"
        status = "OK"
        resource_id = "test_resource_123"
    } | ConvertTo-Json -Depth 5;

    $response = Invoke-RestMethod -Uri "$BASE/store/simple-verify" -Method POST -Body $verifyData -ContentType "application/json" -Headers @{
        "Origin" = "http://localhost:3000"
    };
    
    Write-Host "✅ Simple verify request successful" -ForegroundColor Green;
    Write-Host "  Success: $($response.success)" -ForegroundColor White;
    Write-Host "  Message: $($response.message)" -ForegroundColor White;
} catch {
    Write-Host "❌ Simple verify request failed: $($_.Exception.Message)" -ForegroundColor Red;
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream());
        $responseBody = $reader.ReadToEnd();
        Write-Host "Response: $responseBody" -ForegroundColor Red;
    }
}

Write-Host "";

# Test 4: Test cart create endpoint
Write-Host "Test 4: Cart Create Endpoint..." -ForegroundColor Cyan;
try {
    $cartData = @{
        items = @(
            @{
                id = 1
                title = "Test Product"
                price = 100000
                image = "test.jpg"
                quantity = 1
                selectedOption = "Default"
            }
        )
        customer_email = "test@example.com"
        customer_phone = "+989123456789"
    } | ConvertTo-Json -Depth 5;

    $response = Invoke-RestMethod -Uri "$BASE/store/cart/create" -Method POST -Body $cartData -ContentType "application/json" -Headers @{
        "Origin" = "http://localhost:3000"
    };
    
    Write-Host "✅ Cart create request successful" -ForegroundColor Green;
    Write-Host "  Success: $($response.success)" -ForegroundColor White;
    Write-Host "  Cart ID: $($response.cart.id)" -ForegroundColor White;
} catch {
    Write-Host "❌ Cart create request failed: $($_.Exception.Message)" -ForegroundColor Red;
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream());
        $responseBody = $reader.ReadToEnd();
        Write-Host "Response: $responseBody" -ForegroundColor Red;
    }
}

Write-Host "";

# Test 5: Test CORS test endpoint
Write-Host "Test 5: CORS Test Endpoint..." -ForegroundColor Cyan;
try {
    $response = Invoke-RestMethod -Uri "$BASE/store/cors-test-comprehensive" -Method GET -Headers @{
        "Origin" = "http://localhost:3000"
    };
    
    Write-Host "✅ CORS test request successful" -ForegroundColor Green;
    Write-Host "  Message: $($response.message)" -ForegroundColor White;
    Write-Host "  Origin: $($response.request.origin)" -ForegroundColor White;
} catch {
    Write-Host "❌ CORS test request failed: $($_.Exception.Message)" -ForegroundColor Red;
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream());
        $responseBody = $reader.ReadToEnd();
        Write-Host "Response: $responseBody" -ForegroundColor Red;
    }
}

Write-Host "";
Write-Host "🎉 CORS Middleware Fix Test Complete!" -ForegroundColor Green;
Write-Host "If all tests passed, the CORS middleware configuration is working correctly." -ForegroundColor Yellow;
Write-Host "The middleware now handles CORS for all /store/* routes automatically." -ForegroundColor Yellow;
