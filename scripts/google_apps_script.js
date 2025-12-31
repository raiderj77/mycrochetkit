/**
 * MyCrochetKit Daily Auto-Post Script
 * ----------------------------------
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Replace YOUR_GEMINI_API_KEY and YOUR_DRIVE_FOLDER_ID
 * 4. Paste this code and set a Daily Trigger
 */

const GEMINI_API_KEY = 'YOUR_KEY_HERE';
const DRIVE_FOLDER_ID = 'YOUR_FOLDER_ID_HERE';

function runDailyAutoPost() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = sheet.getDataRange().getValues();
  
  // Find the first "Ready" topic in Column C (Index 2)
  const targetIndex = rows.findIndex(row => row[2] === 'Ready');
  if (targetIndex === -1) {
    Logger.log('No topics marked as "Ready" found.');
    return;
  }

  const topic = rows[targetIndex][0]; // Column A
  const keywords = rows[targetIndex][1]; // Column B

  const content = generateSEOContent(topic, keywords);
  const fileName = topic.toLowerCase().replace(/ /g, '-') + '.html';
  
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  folder.createFile(fileName, content, MimeType.HTML);
  
  // Update status and timestamp in Sheet
  sheet.getRange(targetIndex + 1, 3).setValue('Published');
  sheet.getRange(targetIndex + 1, 4).setValue(new Date());
  
  Logger.log(`Successfully published: ${fileName}`);
}

/**
 * Automatically sets a trigger to run one post every day at 9 AM.
 */
function setupDailyTrigger() {
  // Check if trigger already exists
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'runDailyAutoPost') {
      Logger.log('ℹ️ Daily auto-post trigger already exists.');
      return;
    }
  }
  
  ScriptApp.newTrigger('runDailyAutoPost')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .create();
    
  Logger.log('✅ Success: Daily auto-post scheduled for 9 AM.');
}

function generateSEOContent(topic, keywords) {
  // MASTER PROMPT: Optimized for 2026 AI Search (GEO/SGE)
  const prompt = `Write a high-authority blog post about ${topic}. 
  1. ANSWER FIRST: Answer the main objective/question in the first 50 words.
  2. MODULAR: Use H2/H3 for every new idea.
  3. DATA: Include a <table> comparing relevant crochet data (yarn weights, hook sizes, or project types).
  4. EXPERTISE: Use a professional yet warm "Cozy Tech" tone.
  5. FORMATTING: Use clear bullet points and bold key terms.
  Keywords to include naturally: ${keywords}. 
  Output ONLY the HTML tag content for the body (do not include <html>, <head>, or <body> tags).`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify({ 
      contents: [{ 
        parts: [{ 
          text: prompt 
        }] 
      }] 
    }),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());
  
  if (result.candidates && result.candidates[0].content.parts[0].text) {
    const aiGeneratedContent = result.candidates[0].content.parts[0].text;
    
    // Dynamic Header Image
    const imageHtml = `<div class="blog-header-image" style="margin: 20px 0;">
  <img src="https://placehold.co/1200x600/e8d5c4/8b4513?text=${encodeURIComponent(topic)}" 
       alt="${escapeHtml(topic)}" 
       style="max-width: 100%; height: auto; border-radius: 8px;">
</div>`;

    return imageHtml + aiGeneratedContent;
  } else {
    throw new Error('Failed to generate content from Gemini API: ' + response.getContentText());
  }
}

/**
 * Escapes HTML special characters for safety.
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * --- LLM CITATION MONITORING SYSTEM ---
 */

const ANALYTICS_SHEET_NAME = 'LLM Analytics';

/**
 * 1. Create the Analytics Sheet (run once)
 */
function setupAnalyticsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(ANALYTICS_SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(ANALYTICS_SHEET_NAME);
    const headers = [
      'Date Checked', 
      'Blog Post Title', 
      'URL', 
      'ChatGPT Citations', 
      'Perplexity Citations', 
      'Google AI Overview', 
      'Claude Citations', 
      'Total Mentions', 
      'Keywords Tested', 
      'Notes'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#f3f3f3');
    sheet.setFrozenRows(1);
    Logger.log(`✅ Success: created "${ANALYTICS_SHEET_NAME}" sheet.`);
  } else {
    Logger.log(`ℹ️ Info: "${ANALYTICS_SHEET_NAME}" sheet already exists.`);
  }
}

/**
 * 2. Start Automated Checking (weekly)
 * Sets a trigger to run every Monday at 10 AM
 */
function setupWeeklyCitationCheck() {
  // Check if trigger already exists
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'weeklyCitationCheck') {
      Logger.log('ℹ️ Weekly citation check trigger already exists.');
      return;
    }
  }
  
  ScriptApp.newTrigger('weeklyCitationCheck')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(10)
    .create();
    
  Logger.log('✅ Success: Weekly citation checking scheduled for Mondays at 10 AM.');
}

/**
 * Weekly Citation Check Handler
 * (Checks if Google has indexed your posts - simple check for now)
 */
function weeklyCitationCheck() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1'); // Assuming original sheet is Sheet1
  if (!sheet) return;
  
  const data = sheet.getDataRange().getValues();
  const publishedPosts = data.filter(row => row[2] === 'Published');
  
  publishedPosts.forEach(post => {
    Logger.log(`Checking indexing status for: ${post[0]}`);
    // In a real scenario, you might use a Search Console API or check for indexing
    // For now, we log it.
  });
}

/**
 * 3. Manual Logging (when you find citations)
 */
function logManualCitation(title, platform, citationUrl, notes) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ANALYTICS_SHEET_NAME);
  
  if (!sheet) {
    setupAnalyticsSheet();
  }
  
  const date = new Date();
  const blogUrl = `https://mycrochetkit.com/blog/${title.toLowerCase().replace(/ /g, '-')}.html`;
  
  // Platform columns: ChatGPT=4, Perplexity=5, GoogleAI=6, Claude=7
  let chatgpt = 0, perplexity = 0, googleAi = 0, claude = 0;
  
  switch(platform.toLowerCase()) {
    case 'chatgpt': chatgpt = 1; break;
    case 'perplexity': perplexity = 1; break;
    case 'google ai': 
    case 'google ai overview': googleAi = 1; break;
    case 'claude': claude = 1; break;
  }
  
  const total = chatgpt + perplexity + googleAi + claude;
  
  sheet.appendRow([
    date,
    title,
    blogUrl,
    chatgpt,
    perplexity,
    googleAi,
    claude,
    total,
    '', // Keywords tested
    notes
  ]);
  
  Logger.log(`📊 Logged ${platform} citation for: ${title}`);
}

/**
 * 4. View Your Report
 */
function generateCitationReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ANALYTICS_SHEET_NAME);
  
  if (!sheet) {
    Logger.log('❌ Error: LLM Analytics sheet not found.');
    return;
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    Logger.log('📭 No citation data found yet.');
    return;
  }
  
  let stats = {
    platforms: { ChatGPT: 0, Perplexity: 0, 'Google AI': 0, Claude: 0 },
    topPosts: {}
  };
  
  // Start from row 2 (index 1) to skip headers
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    stats.platforms.ChatGPT += (row[3] || 0);
    stats.platforms.Perplexity += (row[4] || 0);
    stats.platforms['Google AI'] += (row[5] || 0);
    stats.platforms.Claude += (row[6] || 0);
    
    const title = row[1];
    stats.topPosts[title] = (stats.topPosts[title] || 0) + (row[7] || 0);
  }
  
  Logger.log('--- 📊 LLM CITATION REPORT ---');
  Logger.log('PLATFORM PERFORMANCE:');
  for (let p in stats.platforms) {
    Logger.log(`${p}: ${stats.platforms[p]} mentions`);
  }
  
  Logger.log('\nTOP PERFORMING POSTS:');
  const sortedPosts = Object.entries(stats.topPosts).sort((a,b) => b[1] - a[1]);
  sortedPosts.slice(0, 5).forEach(([title, count]) => {
    Logger.log(`${title}: ${count} total AI mentions`);
  });
}
