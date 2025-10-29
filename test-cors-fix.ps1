# ============================================
# CORS Fix Test Script
# ============================================
# This script tests the CORS configuration after applying fixes

$ErrorActionPreference = 'Stop';
$BASE = 'https://backend-production-ea59.up.railway.app';

Write-Host "=== CORS Fix Test Script ===" -ForegroundColor Green;
Write-Host "Testing CORS configuration after fixes..." -ForegroundColor Yellow;
Write-Host "";

# Test 1: CORS Handler endpoint
Write-Host "Test 1: Testing CORS Handler endpoint..." -ForegroundColor Cyan;
try {
    $corsTest = Invoke-RestMethod -Uri "$BASE/store/cors-handler" -Method GET -Headers @{ 'Origin' = 'https://sanity-visual-editing-git-a2c1fe-arshanelmtalab-5364s-projects.vercel.app' };
    Write-Host "✅ CORS Handler working:" -ForegroundColor Green;
    $corsTest | ConvertTo-Json -Depth 3 | Write-Host;
} catch {
    Write-Host "❌ CORS Handler failed: $($_.Exception.Message)" -ForegroundColor Red;
}

Write-Host "";

# Test 2: Simple Payment endpoint (OPTIONS preflight)
Write-Host "Test 2: Testing Simple Payment OPTIONS preflight..." -ForegroundColor Cyan;
try {
    $optionsResponse = Invoke-WebRequest -Uri "$BASE/store/simple-payment" -Method OPTIONS -Headers @{ 
        'Origin' = 'https://sanity-visual-editing-git-a2c1fe-arshanelmtalab-5364s-projects.vercel.app';
        'Access-Control-Request-Method' = 'POST';
        'Access-Control-Request-Headers' = 'Content-Type';
    } -UseBasicParsing;
    
    Write-Host "✅ OPTIONS preflight successful:" -ForegroundColor Green;
    Write-Host "Status: $($optionsResponse.StatusCode)" -ForegroundColor Gray;
    Write-Host "CORS Headers:" -ForegroundColor Gray;
    $optionsResponse.Headers | Where-Object { $_.Key -like "*Access-Control*" } | ForEach-Object {
        Write-Host "  $($_.Key): $($_.Value)" -ForegroundColor Gray;
    }
} catch {
    Write-Host "❌ OPTIONS preflight failed: $($_.Exception.Message)" -ForegroundColor Red;
}

Write-Host "";

# Test 3: Simple Payment endpoint (POST request)
Write-Host "Test 3: Testing Simple Payment POST request..." -ForegroundColor Cyan;
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
    } | ConvertTo-Json -Depth 3;

    $paymentResponse = Invoke-RestMethod -Uri "$BASE/store/simple-payment" -Method POST -Headers @{ 
        'Content-Type' = 'application/json';
        'Origin' = 'https://sanity-visual-editing-git-a2c1fe-arshanelmtalab-5364s-projects.vercel.app';
    } -Body $paymentData;
    
    Write-Host "✅ Payment POST successful:" -ForegroundColor Green;
    $paymentResponse | ConvertTo-Json -Depth 3 | Write-Host;
} catch {
    Write-Host "❌ Payment POST failed: $($_.Exception.Message)" -ForegroundColor Red;
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream();
        $reader = New-Object System.IO.StreamReader($errorStream);
        $errorBody = $reader.ReadToEnd();
        Write-Host "Error Response: $errorBody" -ForegroundColor Red;
    }
}

Write-Host "";

# Test 4: Test CORS endpoint
Write-Host "Test 4: Testing existing CORS test endpoint..." -ForegroundColor Cyan;
try {
    $corsTest2 = Invoke-RestMethod -Uri "$BASE/store/cors-test" -Method GET -Headers @{ 'Origin' = 'https://sanity-visual-editing-git-a2c1fe-arshanelmtalab-5364s-projects.vercel.app' };
    Write-Host "✅ CORS Test endpoint working:" -ForegroundColor Green;
    $corsTest2 | ConvertTo-Json -Depth 3 | Write-Host;
} catch {
    Write-Host "❌ CORS Test endpoint failed: $($_.Exception.Message)" -ForegroundColor Red;
}

Write-Host "";
Write-Host "=== CORS Test Complete ===" -ForegroundColor Green;
Write-Host "If all tests pass, CORS should be working correctly!" -ForegroundColor Yellow;

