# Auto-retry product creation script
# This will keep trying until Railway finishes deploying

Write-Output "`n🚀 Automated Product Creation Script"
Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"

$url = "https://backend-production-ea59.up.railway.app/test/add-sample-product"
$maxAttempts = 20
$attempt = 0
$success = $false

Write-Output "🔄 Will try up to $maxAttempts times (every 10 seconds)...`n"

while ($attempt -lt $maxAttempts -and -not $success) {
    $attempt++
    Write-Output "[$attempt/$maxAttempts] Attempting to create product..."
    
    try {
        $result = Invoke-RestMethod -Method POST -Uri $url -TimeoutSec 10
        
        # Success!
        $success = $true
        Write-Output "`n╔═══════════════════════════════════════════════════╗"
        Write-Output "║   🎉 PRODUCT CREATED SUCCESSFULLY! 🎉           ║"
        Write-Output "╚═══════════════════════════════════════════════════╝`n"
        
        Write-Output "📦 Product Information:"
        Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        Write-Output "ID:       $($result.product.id)"
        Write-Output "Title:    $($result.product.title)"
        Write-Output "Handle:   $($result.product.handle)"
        Write-Output "Status:   $($result.product.status)"
        Write-Output "Variants: $($result.product.variants.Count) colors`n"
        
        Write-Output "🎨 Color Variants:"
        Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        foreach($v in $result.product.variants) {
            $price = [math]::Round($v.prices[0].amount / 100, 2)
            Write-Output "✓ $($v.title)"
            Write-Output "  SKU: $($v.sku)"
            Write-Output "  Stock: $($v.inventory_quantity) units"
            Write-Output "  Price: `$$price`n"
        }
        
        Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        Write-Output "🔗 Quick Links:"
        Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        Write-Output "Admin: $($result.admin_url)"
        Write-Output "Store: $($result.store_url)`n"
        
        Write-Output "✅ Product successfully added to your Medusa backend!`n"
        
    } catch {
        $errorMsg = $_.Exception.Message
        
        if ($errorMsg -like "*404*" -or $errorMsg -like "*Cannot POST*") {
            Write-Output "  ⏳ Endpoint not ready yet (Railway still deploying)..."
        } elseif ($errorMsg -like "*500*") {
            Write-Output "  ⚠️ Server error - check Railway logs"
            Write-Output "  Error: $errorMsg"
            break
        } else {
            Write-Output "  ⚠️ Error: $errorMsg"
        }
        
        if ($attempt -lt $maxAttempts) {
            Write-Output "  ⏱️  Waiting 10 seconds before retry...`n"
            Start-Sleep -Seconds 10
        }
    }
}

if (-not $success) {
    Write-Output "`n❌ Could not create product after $maxAttempts attempts.`n"
    Write-Output "This might mean:"
    Write-Output "  1. Railway is taking longer than expected to deploy"
    Write-Output "  2. There is a build error - check Railway dashboard"
    Write-Output "  3. The endpoint path may have changed`n"
    Write-Output "You can:"
    Write-Output "  - Check Railway dashboard: https://railway.app"
    Write-Output "  - Try manually in browser: $url"
    Write-Output "  - Run this script again in a few minutes`n"
}

