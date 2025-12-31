/**
 * MyCrochetKit "Growth Report" Engine
 * ----------------------------------
 * Pulls Clicks, Impressions, and CTR data from Google Search Console.
 * This script provides the data-driven feedback loop for your SEO strategy.
 */

import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- CONFIGURATION ---
const KEY_FILE = path.join(__dirname, 'service-account.json');
const SITE_URL = 'https://mycrochetkit.com'; // Must match GSC property exactly

async function runPerformanceReport() {
  console.log('--- 📊 GENERATING SEO PERFORMANCE REPORT ---');

  if (!fs.existsSync(KEY_FILE)) {
    return console.error('❌ FAIL: scripts/service-account.json is missing.');
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });

  try {
    // 1. Calculate Date Range (Last 30 Days)
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    console.log(`📅 Period: ${startDate} to ${endDate}`);
    console.log(`🔍 Querying Search Console for: ${SITE_URL}...`);

    // 2. Query Search Console
    const res = await searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: 10,
        // Filter for blog pages specifically
        dimensionFilterGroups: [{
          filters: [{
            dimension: 'page',
            operator: 'contains',
            expression: '/blog/'
          }]
        }]
      }
    });

    const rows = res.data.rows || [];

    if (rows.length === 0) {
      console.log('📭 No data found. (Google usually has a 2-3 day lag for new data).');
      console.log('💡 TIP: If you just deployed, check back in a few days!');
      return;
    }

    // 3. Display Top 10 Blog Posts
    console.log('\n🏆 TOP 10 PERFORMING BLOG POSTS (Last 30 Days):');
    console.table(rows.map(row => ({
      Page: row.keys[0].replace(SITE_URL, ''),
      Clicks: row.clicks,
      Impressions: row.impressions,
      CTR: `${(row.ctr * 100).toFixed(2)}%`,
      Avg_Pos: row.position.toFixed(1)
    })));

    console.log('\n--- 🎉 GROWTH INSIGHTS ---');
    const totalClicks = rows.reduce((acc, row) => acc + row.clicks, 0);
    console.log(`🚀 Total Blog Clicks: ${totalClicks}`);
    console.log('👉 ACTION: Double down on the topics with high impressions but low Clicks (improve their titles!).');
    
  } catch (err) {
    console.error('❌ FAIL: Access Denied or Site Property Not Found.');
    console.error('💡 PRO-TIP: Ensure your Service Account email has "Viewer" access in Google Search Console Settings -> Users.');
    console.error(err.message);
  }
}

runPerformanceReport();
