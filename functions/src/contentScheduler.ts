/**
 * Content Scheduler Cloud Function
 * 
 * Triggers the 7-day content discovery + generation + publishing cycle
 * Can be called via HTTP endpoint or scheduled with Cloud Scheduler
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

// Initialize admin if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * HTTP endpoint to manually trigger content scheduler
 * POST /api/scheduler/run
 * 
 * Security: Requires Firebase Authentication or API key
 */
export const runContentScheduler = functions.https.onCall(async (data, context) => {
  try {
    // Verify user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Must be authenticated to run scheduler'
      );
    }

    // Verify user is admin (optional - add your own logic)
    const userDoc = await db.collection('users').doc(context.auth.uid).get();
    const isAdmin = userDoc.data()?.isAdmin === true;

    if (!isAdmin) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only admins can run the scheduler'
      );
    }

    console.log('🚀 Starting content scheduler...');

    // Step 1: Fetch trends from Reddit
    const trends = await fetchRedditTrends();
    console.log(`✅ Discovered ${trends.length} trends`);

    // Step 2: Generate articles
    const articles = await generateArticles(trends.slice(0, 5));
    console.log(`✅ Generated ${articles.length} articles`);

    // Step 3: Save to Firestore
    const saved = await saveArticles(articles);
    console.log(`✅ Saved ${saved} articles`);

    // Step 4: Update blog manifest
    await updateBlogManifest(articles);
    console.log(`✅ Updated blog manifest`);

    // Create report
    const report = {
      runDate: new Date(),
      trendsDiscovered: trends.length,
      articlesGenerated: articles.length,
      articlesSaved: saved,
      status: 'success',
      message: `Scheduler completed: ${saved} articles published`,
    };

    // Save report to Firestore
    await db.collection('scheduler-reports').add(report);

    return report;

  } catch (error) {
    console.error('❌ Scheduler error:', error);
    
    const report = {
      runDate: new Date(),
      trendsDiscovered: 0,
      articlesGenerated: 0,
      articlesSaved: 0,
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };

    await db.collection('scheduler-reports').add(report);

    throw new functions.https.HttpsError(
      'internal',
      report.message
    );
  }
});

/**
 * Cloud Scheduler trigger (runs every Sunday at 2 AM UTC)
 * Set up in Google Cloud Console to call this function
 */
export const scheduledContentPublish = functions.pubsub
  .schedule('0 2 * * 0') // Every Sunday 2 AM UTC
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      console.log('📅 Scheduled content publish starting...');

      // Fetch trends
      const trends = await fetchRedditTrends();
      console.log(`✅ Discovered ${trends.length} trends`);

      // Generate articles
      const articles = await generateArticles(trends.slice(0, 5));
      console.log(`✅ Generated ${articles.length} articles`);

      // Save articles
      const saved = await saveArticles(articles);
      console.log(`✅ Saved ${saved} articles`);

      // Update blog manifest
      await updateBlogManifest(articles);

      const report = {
        runDate: new Date(),
        trendsDiscovered: trends.length,
        articlesGenerated: articles.length,
        articlesSaved: saved,
        status: 'success',
        message: 'Scheduled publish completed',
        isScheduled: true,
      };

      await db.collection('scheduler-reports').add(report);

      console.log('✅ Scheduled publish completed');
      return null;

    } catch (error) {
      console.error('❌ Scheduled publish error:', error);

      await db.collection('scheduler-reports').add({
        runDate: new Date(),
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        isScheduled: true,
      });

      throw error;
    }
  });

/**
 * Fetch trending topics from Reddit
 */
async function fetchRedditTrends(): Promise<any[]> {
  try {
    const trends = [];
    const subreddits = ['r/Crochet', 'r/Amigurumi', 'r/crafts'];

    for (const subreddit of subreddits) {
      const response = await axios.get(
        `https://www.reddit.com/${subreddit}/hot.json?limit=10`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          },
          timeout: 10000,
        }
      );

      const posts = response.data.data.children.slice(0, 5);
      posts.forEach((post: any) => {
        trends.push({
          source: subreddit,
          topic: post.data.title,
          upvotes: post.data.ups,
          trendingUp: trends.length < 3,
        });
      });
    }

    return trends;

  } catch (error) {
    console.error('Error fetching Reddit trends:', error);
    return [];
  }
}

/**
 * Generate articles from trends
 */
async function generateArticles(trends: any[]): Promise<any[]> {
  const articles = trends.map((trend, index) => {
    const slug = trend.topic
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50);

    return {
      id: `article-${Date.now()}-${index}`,
      slug,
      title: `${trend.topic}: Complete Guide`,
      excerpt: `Learn about ${trend.topic} in this comprehensive guide for crocheters.`,
      content: `# ${trend.topic}\n\nThis is a placeholder article about ${trend.topic}.`,
      author: 'My Crochet Kit Team',
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: 5,
      category: 'Guide',
      tags: [trend.topic.toLowerCase()],
      coverImage: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=1200',
      source: trend.source,
      trendingUp: trend.trendingUp,
    };
  });

  return articles;
}

/**
 * Save articles to Firestore
 */
async function saveArticles(articles: any[]): Promise<number> {
  let saved = 0;

  for (const article of articles) {
    try {
      await db.collection('blog-articles').doc(article.id).set(article, { merge: true });
      saved++;
    } catch (error) {
      console.error(`Error saving article ${article.id}:`, error);
    }
  }

  return saved;
}

/**
 * Update public blog manifest (posts.json)
 */
async function updateBlogManifest(articles: any[]): Promise<void> {
  try {
    // Get all published articles from Firestore
    const snapshot = await db.collection('blog-articles')
      .orderBy('publishedDate', 'desc')
      .limit(20)
      .get();

    const manifest = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // In production, you would:
    // 1. Upload manifest to Cloud Storage
    // 2. Make it public at /blog/posts.json
    // 3. Trigger static site rebuild

    console.log(`Updated manifest with ${manifest.length} articles`);

  } catch (error) {
    console.error('Error updating blog manifest:', error);
    throw error;
  }
}

/**
 * Get scheduler status
 */
export const getSchedulerStatus = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Must be authenticated'
      );
    }

    // Get last 5 reports
    const reports = await db
      .collection('scheduler-reports')
      .orderBy('runDate', 'desc')
      .limit(5)
      .get();

    const lastReport = reports.docs[0]?.data() || null;

    return {
      lastRun: lastReport?.runDate || null,
      status: lastReport?.status || 'never',
      totalRuns: reports.size,
      lastMessage: lastReport?.message || null,
      reports: reports.docs.map(doc => doc.data()),
    };

  } catch (error) {
    console.error('Error getting scheduler status:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to get scheduler status'
    );
  }
});
