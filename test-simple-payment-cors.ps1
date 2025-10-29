# Test Simple Payment CORS
# This script specifically tests the simple-payment endpoint for CORS issues

$ErrorActionPreference = 'Stop';
$BASE = 'http://localhost:9000';

Write-Host "=== Simple Payment CORS Test ===" -ForegroundColor Green;
Write-Host "Testing simple-payment endpoint for CORS issues" -ForegroundColor Yellow;
Write-Host "";

# Test 1: OPTIONS preflight request
Write-Host "Test 1: OPTIONS Preflight Request..." -ForegroundColor Cyan;
try {
    $preflightResponse = Invoke-RestMethod -Uri "$BASE/store/simple-payment" -Method OPTIONS -Headers @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "Content-Type"
    };
    Write-Host "✅ OPTIONS preflight successful" -ForegroundColor Green;
    Write-Host "  Status: $($preflightResponse)" -ForegroundColor White;
} catch {
    Write-Host "❌ OPTIONS preflight failed: $($_.Exception.Message)" -ForegroundColor Red;
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream());
        $responseBody = $reader.ReadToEnd();
        Write-Host "Response: $responseBody" -ForegroundColor Red;
    }
}

Write-Host "";

# Test 2: POST request with CORS headers
Write-Host "Test 2: POST Request with CORS Headers..." -ForegroundColor Cyan;
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

# Test 3: Test from different origin
Write-Host "Test 3: Different Origin Test..." -ForegroundColor Cyan;
try {
    $paymentData = @{
        items = @(
            @{
                id = 2
                title = "Test Product 2"
                price = 200000
                quantity = 2
            }
        )
        customer_email = "test2@example.com"
        customer_phone = "+989123456789"
    } | ConvertTo-Json -Depth 5;

    $response = Invoke-RestMethod -Uri "$BASE/store/simple-payment" -Method POST -Body $paymentData -ContentType "application/json" -Headers @{
        "Origin" = "https://sharifgpt.com"
    };
    
    Write-Host "✅ Different origin request successful" -ForegroundColor Green;
    Write-Host "  Success: $($response.success)" -ForegroundColor White;
} catch {
    Write-Host "❌ Different origin request failed: $($_.Exception.Message)" -ForegroundColor Red;
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream());
        $responseBody = $reader.ReadToEnd();
        Write-Host "Response: $responseBody" -ForegroundColor Red;
    }
}

Write-Host "";

# Test 4: Test simple-verify endpoint
Write-Host "Test 4: Simple Verify Endpoint..." -ForegroundColor Cyan;
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
Write-Host "🎉 Simple Payment CORS Test Complete!" -ForegroundColor Green;
Write-Host "If all tests passed, CORS is properly configured for simple-payment endpoint." -ForegroundColor Yellow;
Write-Host "If any tests failed, check the backend logs and ensure it's running." -ForegroundColor Yellow;
