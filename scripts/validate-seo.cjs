#!/usr/bin/env node

/**
 * MyCrochetKit SEO Validation Script
 * 
 * Validates that all required SEO files are in place before deployment.
 * Run with: npm run seo:validate
 * 
 * Checks:
 * - Schema files exist
 * - Public files (llms.txt, robots.txt) exist
 * - llms.txt has required content
 * - Sitemap will be generated on build
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating MyCrochetKit SEO Implementation...\n');

let errors = 0;
let warnings = 0;
let checks = 0;

/**
 * Helper: Check if file exists
 */
function checkFileExists(filePath, description) {
  checks++;
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing: ${description}`);
    console.error(`   Expected: ${filePath}\n`);
    errors++;
    return false;
  } else {
    console.log(`✅ Found: ${description}`);
    return true;
  }
}

/**
 * Helper: Check file content
 */
function checkFileContent(filePath, searchStrings, description) {
  checks++;
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Cannot validate ${description} - file not found`);
    warnings++;
    return;
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  const missing = searchStrings.filter(str => !content.includes(str));
  
  if (missing.length > 0) {
    console.warn(`⚠️  ${description} is missing content:`);
    missing.forEach(str => console.warn(`   - "${str}"`));
    console.log('');
    warnings++;
  } else {
    console.log(`✅ ${description} content validated`);
  }
}

console.log('📁 Checking Schema Files...\n');

// Check schema files
const schemaFiles = [
  ['src/seo/schemas/organization.ts', 'Organization Schema'],
  ['src/seo/schemas/software-application.ts', 'Software Application Schema'],
  ['src/seo/schemas/faq.ts', 'FAQ Schema']
];

schemaFiles.forEach(([file, desc]) => checkFileExists(file, desc));

console.log('\n📁 Checking Components...\n');

// Check component files
const componentFiles = [
  ['src/seo/components/SEOHead.tsx', 'SEOHead Component']
];

componentFiles.forEach(([file, desc]) => checkFileExists(file, desc));

console.log('\n📁 Checking Public Files...\n');

// Check public files
const publicFiles = [
  ['public/llms.txt', 'LLMs.txt (LLM Discovery)'],
  ['public/robots.txt', 'Robots.txt']
];

publicFiles.forEach(([file, desc]) => checkFileExists(file, desc));

console.log('\n🔍 Validating Content...\n');

// Validate llms.txt content
checkFileContent(
  'public/llms.txt',
  [
    '# MyCrochetKit',
    '## Overview',
    '## Key Information',
    '## Comparison to Ravelry',
    '## Technical Details',
    'voice-activated',
    'Progressive Web App'
  ],
  'llms.txt structure'
);

// Validate robots.txt content
checkFileContent(
  'public/robots.txt',
  [
    'User-agent:',
    'Allow:',
    'Sitemap:',
    'mycrochetkit.com/sitemap.xml'
  ],
  'robots.txt structure'
);

console.log('\n📊 Validation Summary\n');
console.log(`   Total Checks: ${checks}`);
console.log(`   Errors: ${errors}`);
console.log(`   Warnings: ${warnings}\n`);

if (errors > 0) {
  console.log('❌ Validation FAILED\n');
  console.log('Please fix the errors above before deploying.\n');
  console.log('Common fixes:');
  console.log('  - Create missing schema files in src/seo/schemas/');
  console.log('  - Create SEOHead.tsx in src/seo/components/');
  console.log('  - Add llms.txt and robots.txt to public/\n');
  process.exit(1);
} else if (warnings > 0) {
  console.log('⚠️  Validation passed with warnings\n');
  console.log('Review warnings above. These are not critical but should be addressed.\n');
  process.exit(0);
} else {
  console.log('✅ All SEO validations passed!\n');
  console.log('Your SEO implementation is ready for deployment.\n');
  console.log('Next steps:');
  console.log('  1. npm run build');
  console.log('  2. npm run preview  (test locally)');
  console.log('  3. npm run deploy   (deploy to Firebase)\n');
  process.exit(0);
}
