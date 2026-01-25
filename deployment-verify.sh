#!/bin/bash
# Comprehensive deployment verification script
# Ensures all cache files are in dist and ready for deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Functions
print_header() {
  echo ""
  echo -e "${BOLD}${BLUE}════════════════════════════════════════════════════════════${NC}"
  echo -e "${BOLD}${BLUE}$1${NC}"
  echo -e "${BOLD}${BLUE}════════════════════════════════════════════════════════════${NC}"
  echo ""
}

print_check() {
  echo -e "${GREEN}✅${NC} $1"
  ((PASSED++))
}

print_error() {
  echo -e "${RED}❌${NC} $1"
  ((FAILED++))
}

print_warning() {
  echo -e "${YELLOW}⚠️ ${NC} $1"
  ((WARNINGS++))
}

print_info() {
  echo -e "${BLUE}ℹ️ ${NC} $1"
}

# Main verification
print_header "🔍 DEPLOYMENT CACHE VERIFICATION"

# 1. Environment Check
print_header "1. Environment Check"

if [ -d "node_modules" ]; then
  print_check "node_modules directory exists"
else
  print_error "node_modules not found - run: npm install"
fi

if [ -f "package.json" ]; then
  print_check "package.json exists"
else
  print_error "package.json not found"
fi

if [ -f "next.config.mjs" ]; then
  print_check "next.config.mjs exists"
else
  print_error "next.config.mjs not found"
fi

# 2. Cache Script Check
print_header "2. Cache Script Check"

if [ -f "scripts/cache-sanity-data.ts" ]; then
  print_check "Cache script exists: scripts/cache-sanity-data.ts"
else
  print_error "Cache script not found: scripts/cache-sanity-data.ts"
fi

if [ -f "verify-cache-build.js" ]; then
  print_check "Verification script exists: verify-cache-build.js"
else
  print_error "Verification script not found: verify-cache-build.js"
fi

# 3. Source Cache Check
print_header "3. Source Cache Check (public/sanity-cache/)"

if [ -d "public/sanity-cache" ]; then
  print_check "Cache directory exists: public/sanity-cache/"
  
  # Check required cache files
  REQUIRED_FILES=("index.json" "homepage.json" "allProducts.json" "categories.json" "courses.json" "blogPosts.json" "faqs.json" "collections.json")
  
  for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "public/sanity-cache/$file" ]; then
      SIZE=$(ls -lh "public/sanity-cache/$file" | awk '{print $5}')
      print_check "$file ($SIZE)"
    else
      print_warning "$file not found (may need to run: npm run cache:sanity)"
    fi
  done
  
  # Total size
  TOTAL_SIZE=$(du -sh public/sanity-cache/ | cut -f1)
  print_info "Total cache size: $TOTAL_SIZE"
else
  print_warning "Cache directory not found: public/sanity-cache/ (expected after: npm run cache:sanity)"
fi

# 4. Build Output Check
print_header "4. Build Output Check (.next/static/)"

if [ -d ".next" ]; then
  print_check ".next directory exists"
  
  if [ -d ".next/static" ]; then
    print_check ".next/static directory exists"
    
    if [ -d ".next/static/sanity-cache" ]; then
      print_check "✅ Cache copied to .next/static/sanity-cache/"
      
      # Check files
      CACHE_COUNT=$(find ".next/static/sanity-cache" -type f | wc -l)
      print_info "Cache files in build: $CACHE_COUNT"
      
      for file in "${REQUIRED_FILES[@]}"; do
        if [ -f ".next/static/sanity-cache/$file" ]; then
          SIZE=$(ls -lh ".next/static/sanity-cache/$file" | awk '{print $5}')
          print_check "$file ($SIZE) in dist"
        else
          print_warning "$file not in build output"
        fi
      done
      
      DIST_SIZE=$(du -sh .next/static/sanity-cache/ | cut -f1)
      print_info "Build cache size: $DIST_SIZE"
    else
      print_error "Cache NOT in .next/static/ - run: npm run build"
    fi
  else
    print_error ".next/static not found"
  fi
else
  print_warning ".next directory not found - expected after: npm run build"
fi

# 5. Package.json Scripts Check
print_header "5. Package.json Scripts Check"

if grep -q '"prebuild"' package.json; then
  print_check "prebuild script configured"
else
  print_error "prebuild script not configured in package.json"
fi

if grep -q '"postbuild"' package.json; then
  print_check "postbuild script configured"
else
  print_warning "postbuild script not configured (optional)"
fi

if grep -q '"cache:sanity"' package.json; then
  print_check "cache:sanity command available"
else
  print_error "cache:sanity command not available"
fi

# 6. Git Configuration Check
print_header "6. Git Configuration Check"

if grep -q "public/sanity-cache" .gitignore 2>/dev/null; then
  print_check "Cache files ignored in git"
else
  print_warning "Cache files may not be ignored in .gitignore"
fi

# 7. Final Summary
print_header "📊 Verification Summary"

echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo -e "Errors: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}${BOLD}✅ VERIFICATION PASSED!${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Generate cache: npm run cache:sanity"
  echo "  2. Build: npm run build"
  echo "  3. Verify: npm run verify:build"
  echo "  4. Test: npm start"
  echo "  5. Deploy: git push"
  exit 0
else
  echo -e "${RED}${BOLD}❌ VERIFICATION FAILED!${NC}"
  echo ""
  echo "Issues to fix:"
  if [ ! -f "scripts/cache-sanity-data.ts" ]; then
    echo "  - Create scripts/cache-sanity-data.ts"
  fi
  if [ ! -d "public/sanity-cache" ]; then
    echo "  - Run: npm run cache:sanity"
  fi
  if [ ! -d ".next/static/sanity-cache" ]; then
    echo "  - Run: npm run build"
  fi
  exit 1
fi
