#!/usr/bin/env node

/**
 * Post-build script to copy Sanity cache from src/data/sanity-cache to dist
 * This ensures cached data is available in production build
 */

import { cp } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceCache = join(__dirname, '../src/data/sanity-cache');
const destCache = join(__dirname, '../dist/sanity-cache');

async function copyCache() {
  try {
    console.log('\n📋 Copying cache to dist...');
    console.log(`   Source: ${sourceCache}`);
    console.log(`   Dest:   ${destCache}`);
    
    await cp(sourceCache, destCache, { recursive: true, force: true });
    
    console.log('✅ Cache copied to dist/sanity-cache/');
    console.log('   Production will serve cached Sanity data statically!\n');
  } catch (error) {
    console.error('❌ Failed to copy cache:', error.message);
    process.exit(1);
  }
}

copyCache();
