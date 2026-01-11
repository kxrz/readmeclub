#!/usr/bin/env node

/**
 * Preinstall script that removes canvas and opentype.js from package.json on Vercel
 * These packages require native dependencies that aren't available on Vercel
 */

const fs = require('fs');
const path = require('path');

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;

if (isVercel) {
  console.log('🔧 Vercel detected: Removing canvas and opentype.js from package.json');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Remove from optionalDependencies
  if (packageJson.optionalDependencies) {
    delete packageJson.optionalDependencies.canvas;
    delete packageJson.optionalDependencies['opentype.js'];
    
    // Remove optionalDependencies section if empty
    if (Object.keys(packageJson.optionalDependencies).length === 0) {
      delete packageJson.optionalDependencies;
    }
  }
  
  // Write modified package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  
  console.log('✅ Removed canvas and opentype.js from package.json');
}

