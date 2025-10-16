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

// Optionally run Sanity sync after build when token and project envs exist
try {
  const hasProject = !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && !!process.env.NEXT_PUBLIC_SANITY_DATASET;
  const hasToken = !!process.env.SANITY_API_READ_TOKEN;
  const hasAdmin = !!process.env.MEDUSA_ADMIN_TOKEN && (!!process.env.BACKEND_URL || !!process.env.MEDUSA_ADMIN_URL);
  if (hasProject && hasToken && hasAdmin) {
    console.log('Running Sanity → Medusa sync (build-time)...');
    execSync('tsx ../../src/scripts/sanitySync.ts', { cwd: MEDUSA_SERVER_PATH, stdio: 'inherit' });
  } else {
    console.log('Skipping Sanity sync: missing envs');
  }
} catch (e) {
  console.warn('Sanity sync failed:', e?.message || e);
}