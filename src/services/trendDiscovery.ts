/**
 * Trend Discovery Engine
 * 
 * Fetches trending topics from multiple sources:
 * - Google Trends
 * - Reddit (crochet communities)
 * - Pinterest
 * - Etsy
 * - People Also Ask
 */

import axios from 'axios';

export interface TrendTopic {
  id: string;
  topic: string;
  searchIntent: 'beginner' | 'intermediate' | 'advanced' | 'product' | 'question';
  buyerStage: 'awareness' | 'consideration' | 'decision';
  searchVolume: number;
  competitionLevel: 'low' | 'medium' | 'high';
  source: string;
  trendingUp: boolean;
  relatedKeywords: string[];
  productTieIn: string; // Which kit to promote
  internalLinkTargets: string[]; // Which existing pages to link to
  confidence: number; // 0-100
  discoveredAt: Date;
}

class TrendDiscoveryEngine {
  private redditSubreddits = [
    'r/Crochet',
    'r/Amigurumi',
    'r/crafts',
    'r/DIY',
  ];

  /**
   * Fetch trending topics from Reddit (easiest source)
   */
  async fetchRedditTrends(): Promise<TrendTopic[]> {
    try {
      const trends: TrendTopic[] = [];

      for (const subreddit of this.redditSubreddits) {
        const response = await axios.get(
          `https://www.reddit.com/${subreddit}/hot.json`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
          }
        );

        const posts = response.data.data.children.slice(0, 10);

        posts.forEach((post: any, index: number) => {
          const title = post.data.title.toLowerCase();
          const upvotes = post.data.ups;

          // Analyze post title for intent and keywords
          const trend: TrendTopic = {
            id: `reddit-${post.data.id}`,
            topic: post.data.title,
            searchIntent: this.detectIntent(title),
            buyerStage: this.detectBuyerStage(title),
            searchVolume: upvotes,
            competitionLevel: upvotes > 5000 ? 'high' : upvotes > 1000 ? 'medium' : 'low',
            source: subreddit,
            trendingUp: index < 3, // Top 3 posts are trending
            relatedKeywords: this.extractKeywords(title),
            productTieIn: this.suggestKit(title),
            internalLinkTargets: this.suggestInternalLinks(title),
            confidence: 85,
            discoveredAt: new Date()
          };

          trends.push(trend);
        });
      }

      return trends;
    } catch (error) {
      console.error('Error fetching Reddit trends:', error);
      return [];
    }
  }

  /**
   * Detect search intent from keywords
   */
  private detectIntent(text: string): TrendTopic['searchIntent'] {
    if (text.includes('beginner') || text.includes('learn') || text.includes('start')) {
      return 'beginner';
    }
    if (text.includes('buy') || text.includes('shop') || text.includes('price')) {
      return 'product';
    }
    if (text.includes('how') || text.includes('why') || text.includes('what')) {
      return 'question';
    }
    if (text.includes('advanced') || text.includes('pattern')) {
      return 'advanced';
    }
    return 'intermediate';
  }

  /**
   * Detect buyer stage in customer journey
   */
  private detectBuyerStage(text: string): TrendTopic['buyerStage'] {
    if (text.includes('how') || text.includes('learn') || text.includes('guide')) {
      return 'awareness';
    }
    if (text.includes('compare') || text.includes('vs') || text.includes('best')) {
      return 'consideration';
    }
    if (text.includes('buy') || text.includes('order') || text.includes('deal')) {
      return 'decision';
    }
    return 'awareness';
  }

  /**
   * Extract keywords from text
   */
  private extractKeywords(text: string): string[] {
    const keywords = text
      .toLowerCase()
      .split(/[\s,.:;!?()]+/)
      .filter(word => word.length > 4 && !this.isStopWord(word))
      .slice(0, 5);

    return [...new Set(keywords)]; // Remove duplicates
  }

  /**
   * Common stop words to exclude
   */
  private isStopWord(word: string): boolean {
    const stopwords = ['the', 'and', 'with', 'this', 'that', 'from', 'have', 'been', 'would', 'about'];
    return stopwords.includes(word);
  }

  /**
   * Suggest which kit to promote based on topic
   */
  private suggestKit(text: string): string {
    const text_lower = text.toLowerCase();

    if (text_lower.includes('beginner')) return 'Beginner Crochet Kit';
    if (text_lower.includes('amigurumi')) return 'Amigurumi Starter Kit';
    if (text_lower.includes('baby') || text_lower.includes('gift')) return 'Gift Crochet Kit';
    if (text_lower.includes('seasonal') || text_lower.includes('holiday')) return 'Seasonal Project Kit';
    if (text_lower.includes('advanced') || text_lower.includes('pattern')) return 'Advanced Pattern Kit';

    return 'Beginner Crochet Kit'; // Default
  }

  /**
   * Suggest internal pages to link to
   */
  private suggestInternalLinks(text: string): string[] {
    const text_lower = text.toLowerCase();
    const links: string[] = [];

    if (text_lower.includes('beginner') || text_lower.includes('start')) {
      links.push('/crochet-abbreviations');
    }
    if (text_lower.includes('hook') || text_lower.includes('size')) {
      links.push('/hook-size-chart');
    }
    if (text_lower.includes('yarn') || text_lower.includes('weight')) {
      links.push('/yarn-weight-chart');
    }
    if (text_lower.includes('price') || text_lower.includes('sell')) {
      links.push('/crochet-pricing-guide');
    }

    return links.length > 0 ? links : ['/crochet-abbreviations'];
  }

  /**
   * Main method: Get all trends every 7 days
   */
  async discoverTrends(): Promise<TrendTopic[]> {
    console.log('🔍 Starting trend discovery...');

    const redditTrends = await this.fetchRedditTrends();

    // Sort by confidence and trending status
    const allTrends = redditTrends.sort((a, b) => {
      if (a.trendingUp && !b.trendingUp) return -1;
      if (!a.trendingUp && b.trendingUp) return 1;
      return b.confidence - a.confidence;
    });

    // Get top 10 unique topics
    const uniqueTrends = allTrends
      .filter((trend, index, self) =>
        index === self.findIndex(t => t.topic.toLowerCase() === trend.topic.toLowerCase())
      )
      .slice(0, 10);

    console.log(`✅ Discovered ${uniqueTrends.length} trending topics`);
    return uniqueTrends;
  }
}

export const trendEngine = new TrendDiscoveryEngine();
