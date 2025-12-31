/**
 * TEST SCRIPT: Google Drive API Connection
 * Verifies that the service account can authenticate and "see" the blog folder.
 */

import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEY_FILE = path.join(__dirname, 'service-account.json');
const FOLDER_NAME = 'MyCrochetKit_AutoBlog_HTML';

async function testConnection() {
  console.log('--- 🧪 STARTING DRIVE CONNECTION TEST ---');

  if (!fs.existsSync(KEY_FILE)) {
    console.error('❌ FAIL: scripts/service-account.json is missing.');
    return;
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  const drive = google.drive({ version: 'v3', auth });

  try {
    console.log('1. Attempting authentication...');
    const authClient = await auth.getClient();
    console.log('   ✅ Auth Successful! (Using Service Account)');

    console.log(`2. Searching for folder: "${FOLDER_NAME}"...`);
    const res = await drive.files.list({
      q: `name = '${FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id, name)',
    });

    if (res.data.files.length === 0) {
      console.error(`❌ FAIL: Folder "${FOLDER_NAME}" was not found.`);
      console.log('   REMEDY: Share your Google Drive folder with the service account email found in your JSON file.');
    } else {
      const folder = res.data.files[0];
      console.log(`   ✅ Success! Found folder ID: ${folder.id}`);
      
      console.log('3. Checking if any files exist in the folder...');
      const filesRes = await drive.files.list({
        q: `'${folder.id}' in parents and trashed = false`,
        fields: 'files(id, name)',
      });

      console.log(`   ✅ Found ${filesRes.data.files.length} file(s) in Drive.`);
      console.log('--- 🎉 TEST PASSED: Your pipeline is correctly configured! ---');
    }
  } catch (err) {
    console.error('❌ FAIL: An error occurred during the test.');
    console.error(`   Message: ${err.message}`);
  }
}

testConnection();
