import * as pdfjsLib from 'pdfjs-dist';

import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

let workerInitialized = false;

function initWorker() {
  if (workerInitialized) return;
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    workerInitialized = true;
    console.log('[pdf] worker configured:', pdfjsWorker);
  } catch (err) {
    console.error('[pdf] worker init failed, using main thread:', err);
    // Fall back to running on main thread (no worker)
    pdfjsLib.GlobalWorkerOptions.workerSrc = '';
    workerInitialized = true;
  }
}

export async function extractTextFromPdf(file: File): Promise<string> {
  console.log('[pdf] extractTextFromPdf called, file:', file.name, file.size, file.type);

  initWorker();

  console.log('[pdf] reading file as ArrayBuffer...');
  const buffer = await file.arrayBuffer();
  console.log('[pdf] buffer ready, bytes:', buffer.byteLength);

  console.log('[pdf] calling getDocument...');
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  console.log('[pdf] document loaded, pages:', pdf.numPages);

  const pageTexts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .filter((item) => 'str' in item)
      .map((item) => (item as { str: string }).str)
      .join(' ');
    pageTexts.push(text);
    console.log(`[pdf] page ${i}/${pdf.numPages}: ${text.length} chars`);
  }

  const result = pageTexts.join('\n\n');
  console.log('[pdf] extraction complete, total chars:', result.length);
  return result;
}
