# MyCrochetKit Blog Automation: Complete Operations Guide

This guide details exactly how to manage your automated SEO engine. Your system is built on the **Google Ecosystem** + **Firebase Hosting**.

---

## 🎯 System Architecture

1.  **Google Sheets**: Your "Command Center" where you list topics.
2.  **Google Apps Script**: The "Writer" that uses Gemini AI to generate HTML files daily.
3.  **Google Drive**: The "Storage" where your generated blog posts live.
4.  **import_drive.js**: Your "bridge" script that pulls Drive files into your project and injects Viral SEO features.
5.  **Firebase Hosting**: Your "Publisher" that serves the final blog to the world.

---

## 📋 Phase 1: One-Time Setup (Apps Script)

### Step 1: Initialize the Script
1.  Open your **Google Sheet**.
2.  Go to **Extensions > Apps Script**.
3.  Ensure the code from `scripts/google_apps_script.js` is pasted there.
4.  Update your `GEMINI_API_KEY` and `DRIVE_FOLDER_ID` at the top of the script.

### Step 2: Set Up Tracking & Automation
Run these functions from the dropdown menu in the Apps Script editor:

1.  **`setupAnalyticsSheet()`**: Creates the "LLM Analytics" sheet for tracking AI citations.
2.  **`setupWeeklyCitationCheck()`**: Schedules the Monday morning indexing audit.
3.  **`setupDailyTrigger()`**: **ENABLERS AUTOMATION.** Schedules one post to be generated every morning at 9:00 AM.

---

## 🚀 Phase 2: The "Go-Live" Workflow

Because your site is a PWA on Firebase, updates aren't "live" until you deploy. Follow this sequence once a week (or whenever you want new posts live):

### 1. Sync from Google Drive
Run this in your terminal to download new posts and update the "Crochet Hub" index:
```powershell
npm run blog:import
```

### 2. Build & Deploy
Once the files are imported locally, push them to the live site:
```powershell
npm run build && firebase deploy --only hosting:production
```

---

## 📊 Phase 3: Monitoring AI Citations (GEO)

As your blog grows, AI models (ChatGPT, Perplexity, Claude) will start "reading" your content to answer user questions.

### How to Log a Citation:
If you find your blog cited in an AI chat, run the `logManualCitation` function in your Apps Script:
```javascript
logManualCitation(
  'Title of your post',
  'ChatGPT', // or 'Perplexity', 'Claude'
  'https://chat.openai.com/share/...', // optional link
  'Context: Cited in a discussion about yarn weights'
);
```

### View Performance:
Run `generateCitationReport()` in Apps Script to see a summary of your AI footprint in the execution logs.

---

## 🛠️ Troubleshooting

-   **"Fetched 0 bytes" during import**: This means the file exists in Drive but has no content. Ensure `runDailyAutoPost()` finished successfully in the Apps Script editor.
-   **Post doesn't show in the list**: Ensure the `Status` column in your spreadsheet is set to **"Published"** (the script does this automatically).
-   **Styling Issues**: Blog posts use the `public/assets/main.css` file for styling. You can edit that file to change how your blog looks.

---

**Your system is now fully operational. Happy Crocheting & Growing! 🧶🚀**
