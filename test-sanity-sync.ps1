# Test script for Sanity Sync
# This script helps you monitor the sync process

Write-Output "🔄 Sanity → Medusa Sync Test"
Write-Output "================================`n"

# Step 1: Check current product count
Write-Output "📊 Step 1: Checking current Medusa products..."
$url = "https://backend-production-ea59.up.railway.app/diagnostics"
try {
    $resp = Invoke-WebRequest -Method GET -Uri $url -UseBasicParsing -TimeoutSec 30
    $json = $resp.Content | ConvertFrom-Json
    Write-Output ("  ✅ Current products in Medusa: {0}" -f $json.products.total)
} catch {
    Write-Output "  ⚠️  Could not fetch diagnostics (might be expected)"
}

Write-Output "`n📝 Step 2: What to do next:"
Write-Output "  1. Go to Railway Dashboard → Your Medusa Backend Service"
Write-Output "  2. Click 'Redeploy' button (or wait for auto-deploy)"
Write-Output "  3. Watch the deployment logs for:"
Write-Output "     ✅ 'Running Sanity → Medusa sync (build-time)...'"
Write-Output "     ✅ '[sanitySync] CREATED sanityId=xxx productId=xxx'"
Write-Output "     ✅ '[sanitySync] Done. updated=X created=Y failed=0'"
Write-Output "`n  4. After deployment, run this script again to verify!"

Write-Output "`n🎯 Expected Result:"
Write-Output "  - Products from your Sanity CMS will appear in Medusa"
Write-Output "  - Each product will have its correct:"
Write-Output "    • Title, Description"
Write-Output "    • Image/Thumbnail"
Write-Output "    • Price (if configured)"
Write-Output "    • Tags (in metadata)"
Write-Output "    • Handle/Slug"

Write-Output "`n📖 Documentation:"
Write-Output "  - medusa-backend/SANITY_SYNC_GUIDE.md"
Write-Output "  - medusa-backend/SANITY_SYNC_TESTING.md"
Write-Output "  - medusa-backend/SANITY_SYNC_ENV_VARS.md"


