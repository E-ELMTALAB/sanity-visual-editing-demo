const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const MEDUSA_SERVER_PATH = path.join(process.cwd(), '.medusa', 'server');

// Check if .medusa/server exists - if not, build process failed
if (!fs.existsSync(MEDUSA_SERVER_PATH)) {
  throw new Error('.medusa/server directory not found. This indicates the Medusa build process failed. Please check for build errors.');
}

// Copy pnpm-lock.yaml
fs.copyFileSync(
  path.join(process.cwd(), 'pnpm-lock.yaml'),
  path.join(MEDUSA_SERVER_PATH, 'pnpm-lock.yaml')
);

// Copy .env if it exists
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  fs.copyFileSync(
    envPath,
    path.join(MEDUSA_SERVER_PATH, '.env')
  );
}

// Install dependencies
console.log('Installing dependencies in .medusa/server...');
execSync('pnpm i --prod --frozen-lockfile', { 
  cwd: MEDUSA_SERVER_PATH,
  stdio: 'inherit'
});

// Optionally run Sanity sync after build when required envs exist
try {
  const missing = [];
  
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    missing.push('NEXT_PUBLIC_SANITY_PROJECT_ID');
  }
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    missing.push('NEXT_PUBLIC_SANITY_DATASET');
  }
  if (!process.env.SANITY_API_READ_TOKEN) {
    missing.push('SANITY_API_READ_TOKEN');
  }
  if (!process.env.BACKEND_URL && !process.env.MEDUSA_ADMIN_URL) {
    missing.push('BACKEND_URL or MEDUSA_ADMIN_URL');
  }
  
  if (missing.length === 0) {
    console.log('✅ Running Sanity → Medusa sync (build-time)...');
    execSync('tsx ../../src/scripts/sanitySync.ts', { cwd: MEDUSA_SERVER_PATH, stdio: 'inherit' });
  } else {
    console.log('⚠️  Skipping Sanity sync - Missing environment variables:');
    missing.forEach(env => console.log(`   - ${env}`));
    console.log('\n📖 See medusa-backend/SANITY_SYNC_ENV_VARS.md for setup instructions');
  }
} catch (e) {
  console.warn('❌ Sanity sync failed:', e?.message || e);
}