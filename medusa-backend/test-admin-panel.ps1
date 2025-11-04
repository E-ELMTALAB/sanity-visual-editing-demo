# Medusa Admin Panel Verification Script
# This script checks if the admin panel is properly configured and accessible

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Medusa Admin Panel Verification Script  " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-Not (Test-Path "medusa-config.js")) {
    Write-Host "[ERROR] Not in medusa-backend directory" -ForegroundColor Red
    Write-Host "   Please run this script from the medusa-backend folder" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] In correct directory (medusa-backend)" -ForegroundColor Green
Write-Host ""

# Check required packages
Write-Host "📦 Checking required packages..." -ForegroundColor Cyan
Write-Host ""

$packageJson = Get-Content "package.json" | ConvertFrom-Json

$requiredPackages = @{
    "@medusajs/dashboard" = "2.10.2"
    "@medusajs/admin-sdk" = "2.10.2"
    "@medusajs/framework" = "2.10.2"
    "@medusajs/medusa" = "2.10.2"
}

foreach ($package in $requiredPackages.GetEnumerator()) {
    $packageName = $package.Key
    $expectedVersion = $package.Value
    $installedVersion = $packageJson.dependencies.$packageName
    
    if ($installedVersion -eq $expectedVersion) {
        Write-Host "   [OK] $packageName : $installedVersion" -ForegroundColor Green
    } elseif ($installedVersion) {
        Write-Host "   [WARN] $packageName : $installedVersion (expected: $expectedVersion)" -ForegroundColor Yellow
    } else {
        Write-Host "   [ERROR] $packageName : NOT INSTALLED" -ForegroundColor Red
    }
}

Write-Host ""

# Check if admin is built
Write-Host "🏗️  Checking admin build..." -ForegroundColor Cyan
Write-Host ""

if (Test-Path ".medusa/server/public/admin/index.html") {
    Write-Host "   [OK] Admin panel is built" -ForegroundColor Green
    Write-Host "      Location: .medusa/server/public/admin/" -ForegroundColor Gray
} else {
    Write-Host "   [WARN] Admin panel not built yet" -ForegroundColor Yellow
    Write-Host "      Run 'npm run build' to build the admin panel" -ForegroundColor Yellow
}

Write-Host ""

# Check medusa-config.js
Write-Host "⚙️  Checking medusa-config.js..." -ForegroundColor Cyan
Write-Host ""

$configContent = Get-Content "medusa-config.js" -Raw

if ($configContent -match "admin:") {
    Write-Host "   [OK] Admin configuration found" -ForegroundColor Green
    
    if ($configContent -match "path:\s*['\`"]/app['\`"]") {
        Write-Host "   [OK] Admin path set to '/app'" -ForegroundColor Green
    } else {
        Write-Host "   [WARN] Admin path not explicitly set (will default to '/app')" -ForegroundColor Yellow
    }
    
    if ($configContent -match "backendUrl:") {
        Write-Host "   [OK] Backend URL configured" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] Backend URL not configured" -ForegroundColor Red
    }
    
    if ($configContent -match "disable:\s*SHOULD_DISABLE_ADMIN") {
        Write-Host "   [OK] Admin disable flag configured (controlled by env var)" -ForegroundColor Green
    } else {
        Write-Host "   [WARN] Admin disable flag not found" -ForegroundColor Yellow
    }
} else {
    Write-Host "   [ERROR] Admin configuration not found in medusa-config.js" -ForegroundColor Red
}

Write-Host ""

# Check constants.ts
Write-Host "🔧 Checking constants.ts..." -ForegroundColor Cyan
Write-Host ""

if (Test-Path "src/lib/constants.ts") {
    $constantsContent = Get-Content "src/lib/constants.ts" -Raw
    
    if ($constantsContent -match "SHOULD_DISABLE_ADMIN.*false\s*//\s*Enable admin by default") {
        Write-Host "   [OK] Admin enabled by default in constants" -ForegroundColor Green
    } else {
        Write-Host "   [WARN] Check SHOULD_DISABLE_ADMIN in constants.ts" -ForegroundColor Yellow
    }
}

Write-Host ""

# Check environment variables
Write-Host "🌍 Checking environment variables..." -ForegroundColor Cyan
Write-Host ""

$envVars = @(
    "DATABASE_URL",
    "JWT_SECRET",
    "COOKIE_SECRET",
    "MEDUSA_DISABLE_ADMIN"
)

foreach ($var in $envVars) {
    $value = [Environment]::GetEnvironmentVariable($var)
    
    if ($var -eq "MEDUSA_DISABLE_ADMIN") {
        if (-Not $value) {
            Write-Host "   [OK] $var : Not set (admin enabled by default)" -ForegroundColor Green
        } elseif ($value -eq "false") {
            Write-Host "   [OK] $var : false (admin enabled)" -ForegroundColor Green
        } elseif ($value -eq "true") {
            Write-Host "   [ERROR] $var : true (admin DISABLED)" -ForegroundColor Red
            Write-Host "      Set to 'false' or remove to enable admin" -ForegroundColor Yellow
        }
    } else {
        if ($value) {
            if ($var -match "SECRET") {
                Write-Host "   [OK] $var : ********** (set)" -ForegroundColor Green
            } else {
                Write-Host "   [OK] $var : $value" -ForegroundColor Green
            }
        } else {
            Write-Host "   [WARN] $var : Not set" -ForegroundColor Yellow
        }
    }
}

Write-Host ""

# Test if backend is running
Write-Host "🌐 Testing backend connection..." -ForegroundColor Cyan
Write-Host ""

$backendUrl = [Environment]::GetEnvironmentVariable("BACKEND_URL")
if (-Not $backendUrl) {
    $backendUrl = "http://localhost:9000"
}

try {
    $response = Invoke-WebRequest -Uri "$backendUrl/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   [OK] Backend is running at $backendUrl" -ForegroundColor Green
    Write-Host "      Status: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "   [WARN] Backend is not running at $backendUrl" -ForegroundColor Yellow
    Write-Host "      Start it with: npm run dev" -ForegroundColor Gray
}

Write-Host ""

# Test admin panel
Write-Host "🎨 Testing admin panel..." -ForegroundColor Cyan
Write-Host ""

try {
    $adminUrl = "$backendUrl/app"
    $response = Invoke-WebRequest -Uri $adminUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   [OK] Admin panel is accessible!" -ForegroundColor Green
    Write-Host "      URL: $adminUrl" -ForegroundColor Gray
    Write-Host "      Status: $($response.StatusCode)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   SUCCESS! Open your browser and go to:" -ForegroundColor Green
    Write-Host "      $adminUrl" -ForegroundColor Cyan -BackgroundColor Black
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "   [ERROR] Admin panel returned 404" -ForegroundColor Red
        Write-Host "      Possible causes:" -ForegroundColor Yellow
        Write-Host "      1. MEDUSA_DISABLE_ADMIN is set to 'true'" -ForegroundColor Gray
        Write-Host "      2. Admin panel not built (run 'npm run build')" -ForegroundColor Gray
        Write-Host "      3. Configuration issue in medusa-config.js" -ForegroundColor Gray
    } elseif ($_.Exception.Message -match "Unable to connect") {
        Write-Host "   [WARN] Could not connect to $adminUrl" -ForegroundColor Yellow
        Write-Host "      Backend may not be running" -ForegroundColor Gray
        Write-Host "      Start it with: npm run dev" -ForegroundColor Gray
    } else {
        Write-Host "   [WARN] Could not test admin panel" -ForegroundColor Yellow
        Write-Host "      Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Verification Complete" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Summary
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Configuration: " -NoNewline
if ($configContent -match "admin:") {
    Write-Host "[OK] CORRECT" -ForegroundColor Green
} else {
    Write-Host "[ERROR] NEEDS FIX" -ForegroundColor Red
}

Write-Host "   Packages: " -NoNewline
if ($packageJson.dependencies."@medusajs/dashboard") {
    Write-Host "[OK] INSTALLED" -ForegroundColor Green
} else {
    Write-Host "[ERROR] MISSING" -ForegroundColor Red
}

Write-Host "   Build: " -NoNewline
if (Test-Path ".medusa/server/public/admin/index.html") {
    Write-Host "[OK] BUILT" -ForegroundColor Green
} else {
    Write-Host "[WARN] NOT BUILT" -ForegroundColor Yellow
}

Write-Host ""

# Quick start guide
Write-Host "🚀 Quick Start:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1. Build the admin (if not built):" -ForegroundColor White
Write-Host "      npm run build" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Start the backend:" -ForegroundColor White
Write-Host "      npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Access the admin panel:" -ForegroundColor White
Write-Host "      $backendUrl/app" -ForegroundColor Gray
Write-Host ""
Write-Host "   4. Create admin user (if needed):" -ForegroundColor White
Write-Host "      npx medusa user -e admin@test.com -p admin123" -ForegroundColor Gray
Write-Host ""

Write-Host "📚 For detailed documentation, see:" -ForegroundColor Cyan
Write-Host "   medusa-backend/ADMIN_PANEL_SETUP.md" -ForegroundColor Gray
Write-Host ""

