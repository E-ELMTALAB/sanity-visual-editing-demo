# CORS Fix Test Script
# This script tests the CORS configuration on the Medusa backend

Write-Host "Testing CORS Configuration..." -ForegroundColor Green

$backendUrl = "http://localhost:9000"
$testEndpoint = "$backendUrl/store/cors-test-comprehensive"

Write-Host "Backend URL: $backendUrl" -ForegroundColor Yellow
Write-Host "Test Endpoint: $testEndpoint" -ForegroundColor Yellow

# Test 1: Basic GET request
Write-Host "`n1. Testing basic GET request..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri $testEndpoint -Method GET -Headers @{
        "Content-Type" = "application/json"
        "Origin" = "http://localhost:3000"
    }
    Write-Host "✓ GET request successful" -ForegroundColor Green
    Write-Host "Response: $($response.message)" -ForegroundColor White
} catch {
    Write-Host "✗ GET request failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: OPTIONS preflight request
Write-Host "`n2. Testing OPTIONS preflight request..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri $testEndpoint -Method OPTIONS -Headers @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "Content-Type"
    }
    Write-Host "✓ OPTIONS request successful" -ForegroundColor Green
    Write-Host "Response: $($response.message)" -ForegroundColor White
} catch {
    Write-Host "✗ OPTIONS request failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: POST request
Write-Host "`n3. Testing POST request..." -ForegroundColor Cyan
try {
    $testData = @{
        test = "CORS POST test"
        timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri $testEndpoint -Method POST -Body $testData -ContentType "application/json" -Headers @{
        "Origin" = "http://localhost:3000"
    }
    Write-Host "✓ POST request successful" -ForegroundColor Green
    Write-Host "Response: $($response.message)" -ForegroundColor White
} catch {
    Write-Host "✗ POST request failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Test cart creation endpoint
Write-Host "`n4. Testing cart creation endpoint..." -ForegroundColor Cyan
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
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$backendUrl/store/cart/create" -Method POST -Body $cartData -ContentType "application/json" -Headers @{
        "Origin" = "http://localhost:3000"
    }
    Write-Host "✓ Cart creation successful" -ForegroundColor Green
    Write-Host "Cart ID: $($response.cart.id)" -ForegroundColor White
} catch {
    Write-Host "✗ Cart creation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Test Zarinpal verification endpoint
Write-Host "`n5. Testing Zarinpal verification endpoint..." -ForegroundColor Cyan
try {
    $verifyData = @{
        authority = "test_authority_123"
        Status = "OK"
        cart_id = "test_cart_123"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$backendUrl/store/zarinpal/verify" -Method POST -Body $verifyData -ContentType "application/json" -Headers @{
        "Origin" = "http://localhost:3000"
    }
    Write-Host "✓ Zarinpal verification endpoint accessible" -ForegroundColor Green
    Write-Host "Response: $($response.message)" -ForegroundColor White
} catch {
    Write-Host "✗ Zarinpal verification failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nCORS Test Complete!" -ForegroundColor Green
Write-Host "If all tests passed, CORS is properly configured for testing." -ForegroundColor Yellow
Write-Host "If any tests failed, check the Medusa backend logs and ensure it's running." -ForegroundColor Yellow