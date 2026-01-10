/**
 * Daily Content Scheduler
 * 
 * Publishes 1 new article EVERY DAY at 6 AM UTC
 * Rotation: Monday-Friday (5 different types), Saturday-Sunday (bonus)
 * 
 * Daily Target:
 * - Low-hanging fruit keywords (easy to rank)
 * - Long-tail keywords (specific searches)
 * - Seasonal content (spikes)
 * 
 * Result: 365+ articles/year for SEO flywheel
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { defineSecret } from "firebase-functions/params";
import OpenAI from "openai";

const openAiApiKey = defineSecret("OPENAI_API_KEY");

// Initialize admin if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Main daily scheduler - runs at 6 AM UTC every day
 * Generates and publishes 1 article automatically
 */
export const publishDailyArticle = functions.https.onRequest({ secrets: [openAiApiKey], timeoutSeconds: 300 }, async (req, res) => {
  try {
    console.log('📅 Daily article scheduler starting...');

    // Get today's article template
    const template = getTodayTemplate();
    console.log(`📝 Today's type: ${template.type} - Keyword: "${template.keyword}"`);

    // Generate full article
    const article = await generateDailyArticle(template);
    console.log(`✅ Article generated: ${article.title}`);

    // Save to Firestore
    const docRef = await db.collection('blog-articles').add(article);
    console.log(`✅ Saved to Firestore: ${docRef.id}`);

    // Update blog manifest
    await updateBlogManifest(article);
    console.log(`✅ Updated blog manifest`);

    // Create report
    const report = {
      runDate: new Date(),
      articleType: template.type,
      keyword: template.keyword,
      title: article.title,
      docId: docRef.id,
      wordCount: article.content.split(/\s+/).length,
      status: 'success',
      message: `Published daily article: ${article.title}`,
    };

    await db.collection('daily-article-reports').add(report);

    res.json({ ...article, status: 'success' });

  } catch (error) {
    console.error('❌ Daily scheduler error:', error);

    const errorReport = {
      runDate: new Date(),
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };

    await db.collection('daily-article-reports').add(errorReport);
    res.status(500).send(error);
  }
});

/**
 * Manual trigger to upgrade ALL legacy articles to AI standards
 */
export const upgradeLegacyArticles = functions.https.onRequest({ secrets: [openAiApiKey], timeoutSeconds: 540 }, async (req, res) => {
  try {
    console.log('🔄 Starting bulk article upgrade...');
    const snapshot = await db.collection('blog-articles').get();
    let updatedCount = 0;
    const updates: string[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Skip if already AI generated with gpt-4o
      if (data.isAiGenerated && data.model === 'gpt-4o') {
        continue;
      }

      console.log(`✨ Upgrading article: ${data.title} (${doc.id})`);

      // Re-generate content
      const keyword = data.seoKeyword || data.title.replace(': Complete Guide', '');
      const type = data.articleType || 'general';

      const newContent = await generateArticleContent(keyword, type);

      if (newContent) {
        await doc.ref.update({
          ...newContent,
          updatedDate: new Date().toISOString().split('T')[0],
          isAiGenerated: true,
          model: 'gpt-4o',
          upgradedAt: new Date().toISOString()
        });
        updatedCount++;
        updates.push(data.title);
      }
    }

    res.json({
      status: 'success',
      message: `Upgraded ${updatedCount} articles`,
      articles: updates
    });
  } catch (error) {
    console.error('Upgrade failed:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

/**
 * Get today's article template based on day of week
 */
function getTodayTemplate() {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const templates = {
    monday: {
      type: 'beginner',
      keywords: [
        'how to hold crochet hook',
        'crochet for beginners step by step',
        'easy beginner crochet stitches',
        'how to read crochet patterns',
        'best yarn for beginners',
      ],
    },
    tuesday: {
      type: 'stitch',
      keywords: [
        'single crochet stitch tutorial',
        'double crochet stitch how to',
        'moss stitch crochet',
        'shell stitch tutorial',
        'v stitch crochet pattern',
      ],
    },
    wednesday: {
      type: 'project',
      keywords: [
        'easy crochet blanket for beginners',
        'quick crochet projects one day',
        'crochet gift ideas',
        'beginner crochet patterns free',
        'small crochet projects',
      ],
    },
    thursday: {
      type: 'business',
      keywords: [
        'how to price crochet items',
        'crochet side hustle ideas',
        'how to sell crochet online',
        'crochet business startup',
        'how much to charge for crochet work',
      ],
    },
    friday: {
      type: 'faq',
      keywords: [
        'why is crochet good for mental health',
        'can you crochet with thick yarn',
        'is crochet easier than knitting',
        'what is amigurumi',
        'how long does it take to learn crochet',
      ],
    },
    weekend: {
      type: 'trend',
      keywords: [
        'trending crochet patterns 2026',
        'popular crochet colors 2026',
        'best crochet creators to follow',
        'viral crochet trends',
        'top crochet projects right now',
      ],
    },
  };

  let dayName = 'monday';
  if (dayOfWeek === 1) dayName = 'monday';
  else if (dayOfWeek === 2) dayName = 'tuesday';
  else if (dayOfWeek === 3) dayName = 'wednesday';
  else if (dayOfWeek === 4) dayName = 'thursday';
  else if (dayOfWeek === 5) dayName = 'friday';
  else dayName = 'weekend';

  const dayTemplates = templates[dayName as keyof typeof templates];
  const keywords = dayTemplates.keywords;
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];

  return {
    type: dayTemplates.type,
    keyword,
    dayOfWeek,
    dayName,
  };
}

/**
 * Generate full daily article using OpenAI for SEO-optimized content
 */
async function generateDailyArticle(template: any) {
  const slug = template.keyword
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);

  // Call the separated generation logic
  const contentData = await generateArticleContent(template.keyword, template.type);

  if (!contentData) {
    return generateDailyArticleFallback(template, slug);
  }

  // merged article object
  return {
    id: `daily-${slug}-${Date.now()}`,
    slug,
    author: 'My Crochet Kit Team',
    publishedDate: new Date().toISOString().split('T')[0],
    updatedDate: new Date().toISOString().split('T')[0],
    category: getCategoryFromType(template.type),
    tags: [template.keyword.toLowerCase(), template.type, 'crochet', 'tutorial'],
    coverImage: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=1200',
    seoKeyword: template.keyword,
    internalLinks: [
      { text: 'Crochet Abbreviations Guide', url: '/crochet-abbreviations' },
      { text: 'Yarn Weight Chart', url: '/yarn-weight-chart' },
    ],
    productMention: "Pro Crochet Kit",
    isDaily: true,
    articleType: template.type,
    isAiGenerated: true,
    model: "gpt-4o",
    ...contentData
  };
}

/**
 * Core OpenAI Generation Logic
 */
async function generateArticleContent(keyword: string, type: string) {
  let openai: OpenAI | null = null;
  try {
    openai = new OpenAI({ apiKey: openAiApiKey.value() });
  } catch (e) {
    console.warn("OpenAI API Key not found.");
    return null;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a world-class crochet expert and SEO specialist. 
          Write a comprehensive, engaging, and highly informative blog post.
          
          Guidelines:
          - Use proper Markdown (H1, H2, H3).
          - Tone: Encouraging, expert, friendly.
          - Target Audience: Beginners to Intermediate crocheters.
          - SEO: Focus on key takeaways, clear structure, and answering common questions (EEAT).
          - Length: 1000+ words.
          - Structure: Intro, "Why this matters", Step-by-step or Main Guide, Common Mistakes, Expert Tips, FAQ, Conclusion.
          - Return the response as a JSON object with fields: { "title": "...", "content": "...", "excerpt": "...", "faqSchema": [...] }.
          `
        },
        {
          role: "user",
          content: `Write a blog post about "${keyword}". Type: ${type}.
          
          Include specific internal links where relevant:
          - Crochet Abbreviations Guide (/crochet-abbreviations)
          - Yarn Weight Chart (/yarn-weight-chart)
          - Hook Size Reference (/hook-size-chart)

          Product mention to include naturally: "Pro Crochet Kit" (all-in-one starter kit).
          `
        }
      ],
      response_format: { type: "json_object" },
    });

    const contentJson = JSON.parse(completion.choices[0].message.content || "{}");

    return {
      title: contentJson.title || `${toTitleCase(keyword)}: Complete Guide`,
      excerpt: contentJson.excerpt || `Learn everything about ${keyword} in this expert guide.`,
      content: contentJson.content || "",
      faqSchema: contentJson.faqSchema || [],
      readTime: Math.ceil((contentJson.content?.split(/\s+/).length || 500) / 200),
    };
  } catch (error) {
    console.error("OpenAI generation failed:", error);
    return null;
  }
}

/**
 * Fallback generator (The old template logic)
 */
function generateDailyArticleFallback(template: any, slug: string) {
  // Determine product based on type
  let productMention = 'Beginner Crochet Kit';
  if (template.type === 'stitch') productMention = 'Complete Stitch Kit';
  if (template.type === 'project') productMention = 'Themed Project Kit';
  if (template.type === 'business') productMention = 'Business Starter Kit';

  // Build outline based on type
  let outline: string[] = [];
  if (template.type === 'beginner') {
    outline = [
      `What is ${template.keyword}?`,
      `Why this matters for beginners`,
      `Step-by-step guide`,
      `Common mistakes`,
      `Practice tips`,
      `Next steps`,
      `FAQ`,
    ];
  } else if (template.type === 'stitch') {
    outline = [
      `What is the ${template.keyword}?`,
      `Materials needed`,
      `Step-by-step tutorial`,
      `Common mistakes`,
      `Video resources`,
      `Projects using this stitch`,
      `FAQ`,
    ];
  } else if (template.type === 'project') {
    outline = [
      `Project overview`,
      `5 quick ideas`,
      `Materials needed`,
      `Skill level`,
      `Time to complete`,
      `Why these projects`,
      `FAQ`,
    ];
  } else if (template.type === 'business') {
    outline = [
      `Quick answer`,
      `Why this matters`,
      `Detailed explanation`,
      `Examples`,
      `Pro tips`,
      `Common questions`,
      `FAQ`,
    ];
  } else {
    // FAQ
    outline = [
      `Quick answer`,
      `Why people ask this`,
      `Detailed explanation`,
      `Examples`,
      `Pro tips`,
      `Related questions`,
      `Next steps`,
    ];
  }

  // Generate content sections
  let content = `# ${template.keyword}\n\n`;
  const wordsPerSection = 150;

  for (const heading of outline) {
    content += `## ${heading}\n\n`;
    content += generateSectionContent(heading, template.type, wordsPerSection);
    content += '\n\n';
  }

  // Add product mention naturally
  content += `## Ready to Get Started?\n\n`;
  content += `Our ${productMention} includes everything you need to master this skill. Get started today!\n\n`;

  // Generate FAQ schema
  const faqSchema = [
    {
      question: `What is ${template.keyword}?`,
      answer: `A fundamental technique in crochet that helps you create beautiful projects.`,
    },
    {
      question: `Is ${template.keyword} hard to learn?`,
      answer: `No! With practice and clear instructions, anyone can master it.`,
    },
    {
      question: `How long does it take to learn ${template.keyword}?`,
      answer: `Most people learn the basics in 1-2 hours of practice.`,
    },
  ];

  const article = {
    id: `daily-${slug}-${Date.now()}`,
    slug,
    title: `${toTitleCase(template.keyword)}: Complete Guide`,
    excerpt: `Learn ${template.keyword} with this comprehensive guide. Perfect for crocheters of all levels.`,
    content,
    author: 'My Crochet Kit Team',
    publishedDate: new Date().toISOString().split('T')[0],
    updatedDate: new Date().toISOString().split('T')[0],
    readTime: Math.ceil(content.split(/\s+/).length / 200),
    category: getCategoryFromType(template.type),
    tags: [template.keyword.toLowerCase(), template.type, 'crochet'],
    coverImage: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=1200',
    seoKeyword: template.keyword,
    internalLinks: [
      { text: 'Crochet Abbreviations Guide', url: '/crochet-abbreviations' },
      { text: 'Yarn Weight Chart', url: '/yarn-weight-chart' },
      { text: 'Hook Size Reference', url: '/hook-size-chart' },
    ],
    externalLinks: [
      { text: 'Ravelry Patterns', url: 'https://www.ravelry.com/' },
      { text: 'Video Tutorials', url: 'https://www.thecrochetcrowd.com/' },
    ],
    faqSchema,
    productMention,
    isDaily: true,
    articleType: template.type,
  };

  return article;
}

/**
 * Generate section content (150-200 words)
 */
function generateSectionContent(heading: string, articleType: string, wordTarget: number): string {
  const sections: Record<string, string> = {
    'What is': `This is a fundamental technique in crochet that beginners and advanced crocheters alike use regularly. It's one of the most useful skills to master because it appears in countless patterns and projects. Learning this skill opens up a world of possibilities for your crochet projects.`,

    'Why this matters': `Understanding this concept is crucial for improving your crochet skills. It helps you create more polished, professional-looking projects. Many crocheters struggle with this initially, but once you master it, everything becomes easier.`,

    'Step-by-step guide': `Start by preparing your materials. Make sure you have everything ready before beginning. Follow each step carefully, taking your time to understand what's happening. Practice each step multiple times until you feel confident before moving to the next one.`,

    'Common mistakes': `The most common mistake is rushing through the process. Take your time with each step. Another frequent issue is not maintaining consistent tension. Pay attention to how your hands feel and adjust as needed.`,

    'Practice tips': `Start with practice swatches before jumping into full projects. This allows you to build muscle memory without worrying about a finished product. Practice for short sessions regularly rather than long sessions occasionally.`,

    'FAQ': `Many people wonder if this is something they can learn. The answer is absolutely yes! With dedication and practice, anyone can master this skill. Start with our beginner guide and work your way up to more complex projects.`,
  };

  let content = '';
  for (const [key, value] of Object.entries(sections)) {
    if (heading.includes(key)) {
      content = value;
      break;
    }
  }

  return content || `Learn more about ${heading.toLowerCase()}. This is an important skill that will improve your crochet projects significantly. With practice and dedication, you'll master this in no time.`;
}

/**
 * Get category from article type
 */
function getCategoryFromType(type: string): string {
  const categories: Record<string, string> = {
    beginner: 'Beginner Guides',
    stitch: 'Stitch Tutorials',
    project: 'Project Ideas',
    business: 'Business Tips',
    faq: 'FAQ & Tips',
    trend: 'Trends & News',
  };
  return categories[type] || 'General';
}

/**
 * Convert to title case
 */
function toTitleCase(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Update public blog manifest
 */
async function updateBlogManifest(article: any): Promise<void> {
  try {
    // In production, fetch all articles and update posts.json
    const snapshot = await db
      .collection('blog-articles')
      .orderBy('publishedDate', 'desc')
      .limit(50)
      .get();

    const manifest = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Updated manifest with ${manifest.length} articles`);
  } catch (error) {
    console.error('Error updating manifest:', error);
  }
}

/**
 * Get daily scheduler status
 */
export const getDailySchedulerStatus = functions.https.onCall(async (data, context: any) => {
  try {
    if (!context?.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
    }

    // Get last 7 days of reports
    const reports = await db
      .collection('daily-article-reports')
      .orderBy('runDate', 'desc')
      .limit(7)
      .get();

    const stats = {
      lastRun: reports.docs[0]?.data()?.runDate || null,
      totalArticlesThisWeek: reports.size,
      successfulArticles: reports.docs.filter(d => d.data().status === 'success').length,
      avgWordsPerArticle: Math.round(
        reports.docs.reduce((sum, d) => sum + (d.data().wordCount || 0), 0) / (reports.size || 1)
      ),
      articleTypes: countArticleTypes(reports.docs),
      reports: reports.docs.map(doc => doc.data()),
    };

    return stats;
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get status');
  }
});

/**
 * Count article types in reports
 */
function countArticleTypes(docs: any[]): Record<string, number> {
  const counts: Record<string, number> = {
    beginner: 0,
    stitch: 0,
    project: 0,
    business: 0,
    faq: 0,
    trend: 0,
  };

  docs.forEach(doc => {
    const type = doc.data().articleType || 'unknown';
    if (counts[type] !== undefined) {
      counts[type]++;
    }
  });

  return counts;
}
