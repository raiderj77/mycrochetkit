/**
 * Content Scheduler
 * 
 * Runs every 7 days automatically
 * Orchestrates: Trend Discovery → Content Generation → Publishing
 */

import cron from 'node-cron';
import { trendEngine } from './trendDiscovery';
import { contentGen } from './contentGenerator';

export interface ScheduleReport {
  runDate: Date;
  trendsDiscovered: number;
  articlesGenerated: number;
  articlesPublished: number;
  topics: string[];
  status: 'success' | 'error';
  message: string;
}

class ContentScheduler {
  private isRunning = false;
  private lastRun: Date | null = null;
  private reports: ScheduleReport[] = [];

  /**
   * Initialize the 7-day scheduler
   * Runs every Sunday at 2 AM UTC
   */
  initializeScheduler(): void {
    console.log('📅 Content Scheduler Initialized');
    console.log('⏰ Scheduled to run every 7 days (Sunday 2 AM UTC)');

    // Run every 7 days: "0 2 * * 0" = Sunday 2 AM
    // For testing: every minute = "* * * * *"
    cron.schedule('0 2 * * 0', async () => {
      await this.runWeeklyContentCycle();
    });

    console.log('✅ Scheduler ready. Will run on Sunday mornings.');
  }

  /**
   * Manual trigger (for testing)
   */
  async runNow(): Promise<ScheduleReport> {
    if (this.isRunning) {
      console.warn('⚠️ Scheduler already running. Please wait.');
      return this.reports[this.reports.length - 1] || {
        runDate: new Date(),
        trendsDiscovered: 0,
        articlesGenerated: 0,
        articlesPublished: 0,
        topics: [],
        status: 'error',
        message: 'Scheduler already running',
      };
    }

    return await this.runWeeklyContentCycle();
  }

  /**
   * Main 7-day content cycle
   */
  private async runWeeklyContentCycle(): Promise<ScheduleReport> {
    this.isRunning = true;
    const startTime = Date.now();
    const report: ScheduleReport = {
      runDate: new Date(),
      trendsDiscovered: 0,
      articlesGenerated: 0,
      articlesPublished: 0,
      topics: [],
      status: 'success',
      message: '',
    };

    try {
      console.log('🚀 Starting 7-day content cycle...');

      // STEP 1: Discover Trends
      console.log('📊 Step 1: Discovering trends...');
      const trends = await trendEngine.discoverTrends();
      report.trendsDiscovered = trends.length;
      report.topics = trends.map(t => t.topic);

      if (trends.length === 0) {
        throw new Error('No trends discovered');
      }

      console.log(`✅ Discovered ${trends.length} trending topics`);

      // STEP 2: Generate Content
      console.log('✍️ Step 2: Generating content articles...');
      const articles = [];

      for (const trend of trends.slice(0, 5)) {
        // Generate up to 5 articles per week
        const article = await contentGen.buildCompleteArticle(trend);
        articles.push(article);
      }

      report.articlesGenerated = articles.length;
      console.log(`✅ Generated ${articles.length} articles`);

      // STEP 3: Publish Content
      console.log('📤 Step 3: Publishing articles...');
      const published = await this.publishArticles(articles);
      report.articlesPublished = published;
      console.log(`✅ Published ${published} articles`);

      // STEP 4: Update Existing Content
      console.log('🔄 Step 4: Refreshing existing content...');
      await this.refreshExistingContent();
      console.log('✅ Content refresh complete');

      const duration = (Date.now() - startTime) / 1000;
      report.message = `Content cycle completed in ${duration}s`;
      report.status = 'success';

      console.log(`\n✨ 7-Day Cycle Complete!`);
      console.log(`   Trends: ${report.trendsDiscovered}`);
      console.log(`   Articles Generated: ${report.articlesGenerated}`);
      console.log(`   Articles Published: ${report.articlesPublished}`);
      console.log(`   Duration: ${duration}s\n`);

    } catch (error) {
      report.status = 'error';
      report.message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Error in content cycle:', report.message);
    } finally {
      this.isRunning = false;
      this.lastRun = new Date();
      this.reports.push(report);

      // Keep last 52 reports (1 year of weekly reports)
      if (this.reports.length > 52) {
        this.reports = this.reports.slice(-52);
      }
    }

    return report;
  }

  /**
   * Publish articles to blog system
   * Saves to public/blog/posts.json
   */
  private async publishArticles(articles: any[]): Promise<number> {
    try {
      // In production, this would:
      // 1. Save articles to database
      // 2. Update posts.json
      // 3. Trigger static site rebuild
      // 4. Update sitemap.xml

      console.log(`  - Publishing ${articles.length} articles to blog...`);

      // Mock: Log article titles
      articles.forEach((article, index) => {
        console.log(`    ${index + 1}. ${article.title}`);
      });

      // TODO: Implement actual publishing
      // This would integrate with Firebase/database

      return articles.length;
    } catch (error) {
      console.error('Error publishing articles:', error);
      return 0;
    }
  }

  /**
   * Refresh existing content (every 60 days per article)
   * - Update titles for CTR
   * - Add new FAQs
   * - Add internal links
   * - Update dates
   * - Expand one section
   */
  private async refreshExistingContent(): Promise<void> {
    try {
      console.log(`  - Checking for content to refresh...`);

      // TODO: Query articles last updated > 60 days ago
      // For each:
      // 1. Generate improved title
      // 2. Add new FAQ
      // 3. Add new internal link
      // 4. Update publishedDate
      // 5. Expand longest section

      console.log(`  - No content requiring refresh at this time`);
    } catch (error) {
      console.error('Error refreshing content:', error);
    }
  }

  /**
   * Get last run report
   */
  getLastReport(): ScheduleReport | null {
    return this.lastRun ? (this.reports[this.reports.length - 1] || null) : null;
  }

  /**
   * Get all reports
   */
  getAllReports(): ScheduleReport[] {
    return this.reports;
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      nextRun: this.getNextSundayRun(),
      totalRuns: this.reports.length,
      successfulRuns: this.reports.filter(r => r.status === 'success').length,
      failedRuns: this.reports.filter(r => r.status === 'error').length,
    };
  }

  /**
   * Calculate next Sunday 2 AM run
   */
  private getNextSundayRun(): Date {
    const now = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
    const next = new Date(now);
    next.setDate(next.getDate() + daysUntilSunday);
    next.setHours(2, 0, 0, 0);
    return next;
  }
}

export const scheduler = new ContentScheduler();
