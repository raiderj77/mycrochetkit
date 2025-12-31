/**
 * MyCrochetKit "Viral SEO" Import Engine
 * --------------------------------------
 * 1. DRIVE IMPORT: Fetches 'text/html' from Google Drive.
 * 2. VIRAL BOOST: Injects Social Share Bar (Pinterest, FB, X).
 * 3. PSYCHOLOGICAL BOOST: Auto-calculates reading time.
 * 4. RICH SNIPPETS: Injects JSON-LD BlogPosting Schema.
 * 5. SILO BUILDER: Automatically interlinks keywords.
 * 6. LEAD GEN: Injects branded contextual opt-in box.
 * 7. SOCIAL SEO: Injects OpenGraph & Twitter Cards.
 * 8. SITEMAP: Auto-generates public/sitemap.xml.
 */

import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- CONFIGURATION ---
const FOLDER_NAME = 'MyCrochetKit_AutoBlog_HTML';
const BLOG_DIR = path.join(__dirname, '../public/blog');
const PUBLIC_DIR = path.join(__dirname, '../public');
const KEY_FILE = path.join(__dirname, 'service-account.json');
const SITE_URL = 'https://mycrochetkit.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

const SILO_MAP = {
  'row counter': '/',
  'pricing': '/pricing',
  'how much to charge': '/crochet-pricing-guide',
  'abbreviations': '/crochet-abbreviations',
  'crochet terms': '/crochet-abbreviations',
  'hook size': '/hook-size-chart',
  'hooks': '/hook-size-chart',
  'yarn weights': '/yarn-weight-chart',
  'lifetime access': '/pricing',
};

const STATIC_PAGES = [
  '', 
  'pricing', 
  'privacy', 
  'terms', 
  'crochet-abbreviations', 
  'crochet-pricing-guide', 
  'yarn-weight-chart', 
  'hook-size-chart',
  'support'
];

// --- TEMPLATES ---

const LEAD_MAGNET_HTML = `
        <div class="lead-magnet">
            <h3>Join the MyCrochetKit VIP Club 🧶</h3>
            <p>Get free patterns, row-tracking tips, and exclusive Pro discounts delivered to your inbox.</p>
            <form action="#" method="POST">
                <input type="email" name="email" placeholder="Enter your email" required>
                <button type="submit">Join Now</button>
            </form>
        </div>`;

const SOCIAL_SHARE_HTML = `
        <div class="social-share-bar">
            <span class="share-label">Share:</span>
            <a href="https://www.pinterest.com/pin/create/button/?url={{SHARE_URL}}&media={{IMAGE_URL_ENC}}&description={{TITLE}}" class="share-btn pinterest" target="_blank" aria-label="Pin on Pinterest">P</a>
            <a href="https://www.facebook.com/sharer/sharer.php?u={{SHARE_URL}}" class="share-btn facebook" target="_blank" aria-label="Share on Facebook">f</a>
            <a href="https://twitter.com/intent/tweet?url={{SHARE_URL}}&text={{TITLE}}" class="share-btn twitter" target="_blank" aria-label="Share on X">𝕏</a>
        </div>`;

const BLOG_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} | My Crochet Kit</title>
    
    <!-- SEO & Social Meta Tags -->
    <meta name="description" content="{{DESCRIPTION}}">
    <link rel="canonical" href="${SITE_URL}/blog/{{FILENAME}}">
    <meta property="og:title" content="{{TITLE}} | My Crochet Kit">
    <meta property="og:description" content="{{DESCRIPTION}}">
    <meta property="og:image" content="{{IMAGE}}">
    <meta property="og:url" content="${SITE_URL}/blog/{{FILENAME}}">
    <meta property="og:type" content="article">
    <meta name="twitter:card" content="summary_large_image">
    
    <!-- Rich Snippet Schema -->
    {{SCHEMA}}

    <link rel="stylesheet" href="/assets/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
</head>
<body class="blog-post-template">
    <header class="site-header">
       <div class="container">
           <nav> 
               <a href="/" class="brand">🧶 My Crochet Kit</a> | 
               <a href="/blog" class="nav-link">Blog</a> |
               <a href="/pricing" class="nav-link text-accent">Pricing</a>
           </nav>
       </div>
    </header>

    <main class="content-container">
        <div class="metadata">
            <span class="date">{{DATE}}</span> | 
            <span class="reading-time">⏱️ {{READING_TIME}}</span>
        </div>
        <h1>{{TITLE}}</h1>
        
        <article class="prose content-wrapper">
            {{CONTENT}}
        </article>
        
        ${SOCIAL_SHARE_HTML}
    </main>

    <section class="lead-magnet">
        <div class="container">
            <h3>Join the MyCrochetKit VIP Club 🧶</h3>
            <p>Get exclusive row-tracking tips, pattern downloads, and Pro discounts.</p>
            <div style="display: flex; gap: 0.5rem; max-width: 400px; margin: 1.5rem auto 0;">
                <input type="email" placeholder="Your email..." style="flex: 1; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px;"> 
                <button style="background: #8b5cf6; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; font-weight: 700; cursor: pointer;">Join Now</button>
            </div>
        </div>
    </section>

    <footer class="site-footer">
        <div class="container">
            <p>© 2026 My Crochet Kit. All rights reserved. Built for crocheters, by crocheters.</p>
            <div style="margin-top: 1rem; font-size: 0.8rem; opacity: 0.7;">
                <a href="/" style="color: inherit; margin: 0 0.5rem;">Home</a>
                <a href="/blog" style="color: inherit; margin: 0 0.5rem;">Blog</a>
                <a href="/privacy" style="color: inherit; margin: 0 0.5rem;">Privacy</a>
            </div>
        </div>
    </footer>
</body>
</html>`;

const INDEX_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Crochet Kit Blog - Expert Guides & Tips</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <header class="site-header">
        <div class="container header-inner">
            <a href="/" class="brand">
                <span aria-hidden="true">🧶</span> My Crochet Kit
            </a>
            <nav class="nav">
                <a href="/pricing" class="navlink">Pricing</a>
                <a href="/signup" class="navlink">Start Free</a>
                <a href="/blog/" class="navlink active">Blog</a>
            </nav>
        </div>
    </header>

    <main id="content-area" class="container page">
        <h1>Latest from the Hook</h1>
        <p>Expert guides, crochet tips, and inspiration for your next project.</p>
        
        <!-- The Container Approach -->
        <div id="blog-container" style="margin: 3rem 0; display: grid; gap: 2rem;">
            {{POSTS_LIST}}
        </div>

        <div class="cta-box">
            <h3>Ready to level up your crochet?</h3>
            <p>Track rows with your voice, organize your yarn stash, and more.</p>
            <a href="https://mycrochetkit.com">Get Started Free</a>
        </div>
    </main>

    <footer>
        &copy; 2026 My Crochet Kit. All rights reserved. Built for crocheters, by crocheters.
    </footer>
</body>
</html>`;

// --- CORE LOGIC ---

const UNSPLASH_COLLECTION = [
  "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=1200", // Soft yarn
  "https://images.unsplash.com/photo-1599407335606-f18751f845a6?auto=format&fit=crop&q=80&w=1200", // Crochet work
  "https://images.unsplash.com/photo-1629196911514-cfd8d628ba26?auto=format&fit=crop&q=80&w=1200", // Colorful yarn
  "https://images.unsplash.com/photo-1610444583731-9e151d040716?auto=format&fit=crop&q=80&w=1200", // Knitting needles/crochet hooks
  "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=1200"  // Detailed crochet
];

function extractThumbnail(html, filename = '') {
  // Try to find image in content
  const match = html.match(/<img[^>]+src="([^">]+)"/i);
  if (match) return match[1];

  // Logic: Use a specific image based on hash of filename for consistency
  if (filename) {
    let hash = 0;
    for (let i = 0; i < filename.length; i++) {
      hash = filename.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % UNSPLASH_COLLECTION.length;
    return UNSPLASH_COLLECTION[index];
  }

  return UNSPLASH_COLLECTION[0];
}

function generateSchema(title, description, filename, date, thumbnail) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": thumbnail,
    "author": { "@type": "Organization", "name": "MyCrochetKit" },
    "publisher": {
      "@type": "Organization",
      "name": "MyCrochetKit",
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/icon.png` }
    },
    "datePublished": date,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${SITE_URL}/blog/${filename}` }
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

async function runEliteImport() {
  console.log('--- 🚀 STARTING VIRAL SEO IMPORT ---');

  if (!fs.existsSync(KEY_FILE)) return console.error('❌ FAIL: scripts/service-account.json missing.');

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  const drive = google.drive({ version: 'v3', auth });

  try {
    const folderRes = await drive.files.list({
      q: `name = '${FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    });
    if (folderRes.data.files.length === 0) return console.error('❌ Folder not found.');
    const folderId = folderRes.data.files[0].id;

    const filesRes = await drive.files.list({
      q: `'${folderId}' in parents and mimeType = 'text/html' and trashed = false`,
      fields: 'files(id, name, createdTime)',
    });

    const files = filesRes.data.files || [];
    
    // Always start with empty mapping
    let postsMapping = [];

    // If we have no files, we still want to update the sitemap for static pages
    if (files.length === 0) {
      console.log('📭 No new posts found, updating registry for static pages...');
    } else {
      console.log(`📥 Processing ${files.length} posts with VIRAL & ENGAGEMENT BOOST...`);
    }

    for (const file of files) {
      const contentRes = await drive.files.get({ fileId: file.id, alt: 'media' }, { responseType: 'text' });
      let rawContent = contentRes.data || '';
      console.log(`📄 Fetched ${file.name} (${rawContent.length} bytes)`);

      rawContent = injectSiloLinks(rawContent);

      const title = file.name
        .replace('.html', '')
        .replace(/-/g, ' ')
        // Prettify: Add spaces before capital letters (camelCase/PascalCase)
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        // Special Case: Split common words stuck together if not already split
        .replace(/([A-Za-z])(for|with|the|and|your|from|to|is|using)\b/gi, '$1 $2')
        .replace(/\b\w/g, c => c.toUpperCase());
      
      const description = extractDescription(rawContent, title);
      const thumbnail = extractThumbnail(rawContent, file.name);
      const readingTime = calculateReadingTime(rawContent);
      const publishDateStr = new Date(file.createdTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const publishDateIso = new Date(file.createdTime).toISOString().split('T')[0];
      const schema = generateSchema(title, description, file.name, publishDateIso, thumbnail);
      const shareUrl = encodeURIComponent(`${SITE_URL}/blog/${file.name}`);
      
      // Strip HTML/Body tags if they exist in the raw content
      let cleanInjectedContent = rawContent;
      if (rawContent.includes('<body')) {
        const bodyMatch = rawContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        if (bodyMatch) cleanInjectedContent = bodyMatch[1];
      }

      const finalHtml = BLOG_TEMPLATE
        .replaceAll('{{TITLE}}', title)
        .replaceAll('{{DESCRIPTION}}', description)
        .replaceAll('{{FILENAME}}', file.name)
        .replaceAll('{{IMAGE}}', thumbnail)
        .replaceAll('{{IMAGE_URL_ENC}}', encodeURIComponent(thumbnail))
        .replaceAll('{{SCHEMA}}', schema)
        .replaceAll('{{DATE}}', publishDateStr)
        .replaceAll('{{READING_TIME}}', readingTime)
        .replaceAll('{{SHARE_URL}}', shareUrl)
        .replace('{{CONTENT}}', cleanInjectedContent);

      fs.writeFileSync(path.join(BLOG_DIR, file.name), finalHtml);
      
      postsMapping.push({
        id: file.id,
        path: `/blog/${file.name}`,
        title: title,
        excerpt: description,
        author: 'My Crochet Kit Team',
        publishedDate: publishDateIso,
        readTime: parseInt(readingTime),
        category: 'Guides',
        tags: ['crochet', 'imported'],
        coverImage: thumbnail,
        isExternal: true
      });
    }

    // --- Save Manifest for Frontend ---
    console.log('📦 Saving Blog Manifest (posts.json)...');
    fs.writeFileSync(path.join(BLOG_DIR, 'posts.json'), JSON.stringify(postsMapping, null, 2));

    // --- Generate Index Page ---
    console.log('📝 Generating SEO-Optimized Index...');
    const postsHtml = postsMapping
      .sort((a,b) => new Date(b.publishedDate) - new Date(a.publishedDate))
      .map(post => `
        <article class="post-card" style="background: white; padding: 2.5rem; border-radius: 20px; box-shadow: 0 4px 25px rgba(0,0,0,0.03); border: 1px solid #f0f0f0; transition: transform 0.2s ease;">
            <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                <span style="background: #f3f0ff; color: #7c3aed; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">${post.category}</span>
                <small style="color: #94a3b8; font-weight: 500;">${new Date(post.publishedDate).toLocaleDateString()}</small>
                <small style="color: #94a3b8;">⏱️ ${post.readTime} min read</small>
            </div>
            <h2 style="margin: 0 0 1rem 0; font-size: 1.75rem; line-height: 1.2;">
                <a href="${post.path.split('/').pop()}" style="text-decoration: none; color: #1e293b; font-weight: 800;">${post.title}</a>
            </h2>
            <p style="color: #64748b; font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">${post.excerpt}</p>
            <a href="${post.path.split('/').pop()}" style="color: #7c3aed; text-decoration: none; font-size: 0.95rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.5rem;">
                Read Full Article <span>&rarr;</span>
            </a>
        </article>`).join('');

    const finalIndexHtml = INDEX_TEMPLATE.replace('{{POSTS_LIST}}', postsHtml);
    fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), finalIndexHtml);

    // --- Generate Sitemap ---
    console.log('🕸️ Updating Sitemap.xml...');
    const sitemapItems = [...STATIC_PAGES.map(p => ({ url: `${SITE_URL}/${p}`, prio: p === '' ? '1.0' : '0.8' })), 
                         { url: `${SITE_URL}/blog/`, prio: '0.9' },
                         ...postsMapping.map(p => ({ url: `${SITE_URL}${p.path}`, prio: '0.7', mod: p.publishedDate }))]
                         .map(item => `
  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.mod || new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${item.prio}</priority>
  </url>`).join('');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapItems}</urlset>`;
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml);

    console.log('--- 🎉 VIRAL SEO SYNC COMPLETE! ---');
  } catch (err) {
    console.error('❌ FAIL:', err.message);
  }
}

runEliteImport();
/**
 * Simple Silo Linker
 * This ensures your posts link to your main Hub for better SEO.
 */
function injectSiloLinks(html) {
  const siloHtml = `
    <div class="silo-links" style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
      <p><strong>Want more crochet tips?</strong></p>
      <ul>
        <li><a href="/blog">Visit the Crochet Hub</a></li>
        <li><a href="/patterns">Browse Free Patterns</a></li>
      </ul>
    </div>
  `;
  return html + siloHtml;
}
/**
 * Extract Description
 * Grabs the first few sentences to use as the "hook" on your blog cards.
 */
function extractDescription(html, title = '') {
  // 1. Remove style and script blocks INCLUDING their content
  let cleanHtml = html.replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi, '');
  // 2. Remove all other HTML tags
  let text = cleanHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // 3. Prevent title duplication in excerpt
  if (title && text.toLowerCase().startsWith(title.toLowerCase())) {
    text = text.substring(title.length).trim();
    // Remove leading punctuation if any
    text = text.replace(/^[.:-]\s+/, '');
  }

  return text.length > 160 ? text.substring(0, 157) + "..." : text;
}
/**
 * Calculate Reading Time
 * Estimates reading time based on word count.
 */
function calculateReadingTime(html) {
  const wordsPerMinute = 200;
  // 1. Remove style/script content
  let cleanHtml = html.replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi, '');
  // 2. Strip HTML tags
  const text = cleanHtml.replace(/<[^>]*>/g, ' ');
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}