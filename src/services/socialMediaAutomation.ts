/**
 * Social Media Automation Service
 * 
 * Handles:
 * 1. Automated posting of blog articles to Reddit, Twitter, TikTok
 * 2. Intelligent engagement - answers crochet questions with subtle tool mentions
 * 3. Tracks engagement metrics and performance
 * 
 * Strategy: Be helpful first, mention tool naturally (not spammy)
 */

export interface SocialPost {
  platform: 'reddit' | 'twitter' | 'tiktok' | 'instagram' | 'pinterest';
  title: string;
  content: string;
  imageUrl?: string;
  link: string;
  hashtags: string[];
  scheduledFor: Date;
  subreddit?: string; // for Reddit
  postId?: string;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
  };
}

export interface EngagementResponse {
  platform: 'reddit' | 'twitter';
  questionText: string;
  answerText: string;
  suggestedToolMention?: string; // Discreet mention of your tool
  confidence: number; // 0-100 (only respond if high confidence)
  isRelevantToCrochet: boolean;
  engagementId: string;
}

class SocialMediaAutomation {
  /**
   * Generate Reddit post from blog article
   * Strategy: Share link + compelling excerpt, ask for feedback
   */
  generateRedditPost(article: any): SocialPost {
    const subreddit = this.selectSubreddit(article.category);
    
    return {
      platform: 'reddit',
      title: this.optimizeRedditTitle(article.title),
      content: this.generateRedditBody(article),
      link: `https://mycrochetkit.com/blog/${article.slug}`,
      hashtags: article.tags,
      scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // Post in 2 hours
      subreddit,
    };
  }

  /**
   * Generate Twitter/X post
   * Strategy: Thread format for engagement, link in first tweet
   */
  generateTwitterPost(article: any): SocialPost[] {
    const tweets: SocialPost[] = [];

    // Tweet 1: Hook
    tweets.push({
      platform: 'twitter',
      title: `Thread: ${article.title}`,
      content: this.generateTwitterHook(article),
      link: `https://mycrochetkit.com/blog/${article.slug}`,
      hashtags: ['#crochet', '#crafttwitter', ...article.tags.slice(0, 2)],
      scheduledFor: new Date(),
    });

    // Tweet 2: Main insight
    tweets.push({
      platform: 'twitter',
      title: `${article.title} - Part 2`,
      content: `🧵 Here's what most crocheters get wrong about ${article.seoKeyword}:\n\n${this.extractKeyInsight(article)}`,
      hashtags: ['#crochet', '#crafting'],
      scheduledFor: new Date(Date.now() + 30 * 60 * 1000), // 30 mins later
    });

    // Tweet 3: CTA
    tweets.push({
      platform: 'twitter',
      title: `${article.title} - Final`,
      content: `Need a place to track all your projects while learning new techniques? Check out the full guide 👇`,
      link: `https://mycrochetkit.com/blog/${article.slug}`,
      hashtags: ['#crochet', '#maker'],
      scheduledFor: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
    });

    return tweets;
  }

  /**
   * Generate TikTok/Instagram Reel caption
   * Strategy: Hook in first line, quick tips, CTA in bio
   */
  generateTikTokCaption(article: any): SocialPost {
    return {
      platform: 'tiktok',
      title: `POV: You're learning ${article.seoKeyword}`,
      content: `Quick tip: ${this.extractShortTip(article)}\n\nFull guide in our latest blog post (link in bio)\n\n#crochet #crochettutorial #craftinghacks #handmade`,
      imageUrl: article.coverImage,
      link: `https://mycrochetkit.com/blog/${article.slug}`,
      hashtags: ['#crochet', '#craftinghacks', '#foryoupage', article.tags[0]],
      scheduledFor: new Date(),
    };
  }

  /**
   * Monitor Reddit for crochet questions and answer intelligently
   * Strategy: Answer helpfully, ONLY mention tool if directly relevant
   */
  generateRedditAnswer(questionText: string, subreddit: string): EngagementResponse | null {
    // Analyze question for relevance and type
    const analysis = this.analyzeQuestion(questionText);

    if (!analysis.isRelevantToCrochet || analysis.confidence < 75) {
      return null; // Don't respond to off-topic or uncertain questions
    }

    // Generate helpful answer
    const answer = this.generateHelpfulAnswer(questionText, analysis);

    // Determine if tool mention is appropriate
    let toolMention = null;
    if (this.shouldMentionTool(analysis)) {
      toolMention = this.generateDiscreetToolMention(analysis.type);
    }

    return {
      platform: 'reddit',
      questionText,
      answerText: answer,
      suggestedToolMention: toolMention,
      confidence: analysis.confidence,
      isRelevantToCrochet: analysis.isRelevantToCrochet,
      engagementId: `reddit-${subreddit}-${Date.now()}`,
    };
  }

  /**
   * Monitor Twitter for crochet questions and reply
   * Strategy: Be conversational, helpful, never pushy
   */
  generateTwitterReply(tweetText: string, authorHandle: string): EngagementResponse | null {
    const analysis = this.analyzeQuestion(tweetText);

    if (!analysis.isRelevantToCrochet || analysis.confidence < 80) {
      return null;
    }

    const reply = this.generateTwitterReply(tweetText, analysis);

    return {
      platform: 'twitter',
      questionText: tweetText,
      answerText: reply,
      suggestedToolMention: null, // Twitter mentions should avoid tool talk
      confidence: analysis.confidence,
      isRelevantToCrochet: analysis.isRelevantToCrochet,
      engagementId: `twitter-${authorHandle}-${Date.now()}`,
    };
  }

  /**
   * Private: Analyze question for relevance and type
   */
  private analyzeQuestion(text: string): {
    type: 'beginner' | 'technique' | 'project' | 'business' | 'material';
    isRelevantToCrochet: boolean;
    confidence: number;
    keywords: string[];
  } {
    const text_lower = text.toLowerCase();

    // Check relevance
    const crochetKeywords = [
      'crochet', 'yarn', 'hook', 'stitch', 'amigurumi', 'blanket',
      'pattern', 'row', 'cast on', 'single crochet', 'double crochet'
    ];
    const isRelevant = crochetKeywords.some(kw => text_lower.includes(kw));

    if (!isRelevant) {
      return {
        type: 'beginner',
        isRelevantToCrochet: false,
        confidence: 0,
        keywords: [],
      };
    }

    // Detect type
    let type: 'beginner' | 'technique' | 'project' | 'business' | 'material' = 'beginner';
    if (text_lower.includes('how much') || text_lower.includes('price') || text_lower.includes('sell')) {
      type = 'business';
    } else if (text_lower.includes('stitch') || text_lower.includes('technique')) {
      type = 'technique';
    } else if (text_lower.includes('project') || text_lower.includes('pattern')) {
      type = 'project';
    } else if (text_lower.includes('yarn') || text_lower.includes('hook') || text_lower.includes('material')) {
      type = 'material';
    }

    // Calculate confidence (higher for specific questions)
    const confidence = text.length > 100 ? 85 : 70;

    return {
      type,
      isRelevantToCrochet: true,
      confidence,
      keywords: crochetKeywords.filter(kw => text_lower.includes(kw)),
    };
  }

  /**
   * Generate helpful answer (don't mention tool yet)
   */
  private generateHelpfulAnswer(question: string, analysis: any): string {
    // This would typically call an LLM or use templates
    // For now, return helpful generic guidance

    if (analysis.type === 'beginner') {
      return `Great question! Here's what I'd recommend:\n\n1. Start with basic supplies\n2. Practice one stitch at a time\n3. Don't rush - consistency beats speed\n\nYou've got this! 🧶`;
    }

    if (analysis.type === 'technique') {
      return `Awesome! Here's how to nail this:\n\n• Keep your tension consistent\n• Count your stitches carefully\n• Practice on scrap yarn first\n\nLet me know if you have questions!`;
    }

    if (analysis.type === 'business') {
      return `Smart thinking about pricing! Here's the formula most sellers use:\n\nMaterials + (Time × Hourly Rate) + 20% markup\n\nDon't undervalue your work!`;
    }

    return `Great question! I'd be happy to help. Could you share a bit more detail about what you're trying to do?`;
  }

  /**
   * Determine if tool mention is appropriate (only if HIGHLY relevant)
   */
  private shouldMentionTool(analysis: any): boolean {
    // Only mention tool if:
    // 1. Question is about tracking/pricing/projects
    // 2. User is clearly struggling with organization
    // 3. Confidence is very high (>85%)

    return (
      analysis.type === 'business' &&
      analysis.confidence > 85 &&
      (analysis.keywords.includes('price') || analysis.keywords.includes('track'))
    );
  }

  /**
   * Generate discreet tool mention (never pushy!)
   */
  private generateDiscreetToolMention(type: string): string {
    if (type === 'business') {
      return `\n\nPS - If you end up selling a lot, tools like My Crochet Kit can help you track projects and calculate pricing automatically. Worth checking out if you're serious about this!`;
    }

    if (type === 'project') {
      return `\n\nSide note: Tracking your projects (time, materials, etc.) really helps you improve. There are tools for that if you want to get serious about your craft.`;
    }

    return null;
  }

  /**
   * Select appropriate subreddit based on article category
   */
  private selectSubreddit(category: string): string {
    const subreddits: Record<string, string> = {
      'Beginner Guides': 'r/Crochet',
      'Stitch Tutorials': 'r/Crochet',
      'Project Ideas': 'r/Crochet',
      'Business Tips': 'r/CraftFairs',
      'FAQ & Tips': 'r/Crochet',
      'Trends & News': 'r/Amigurumi',
    };

    return subreddits[category] || 'r/Crochet';
  }

  /**
   * Optimize title for Reddit (more casual, engaging)
   */
  private optimizeRedditTitle(title: string): string {
    // Remove "Complete Guide" or similar corporate language
    let optimized = title
      .replace(': Complete Guide', '')
      .replace(/\[Guide\]/g, '')
      .trim();

    // Add engagement hook
    if (!optimized.includes('?')) {
      optimized = `${optimized} - Tips & Tricks`;
    }

    return optimized;
  }

  /**
   * Generate Reddit body (conversational, not salesy)
   */
  private generateRedditBody(article: any): string {
    return `Hey r/Crochet! I just wrote a guide on **${article.seoKeyword}** and wanted to share it here.

**The main takeaway:** ${this.extractKeyInsight(article)}

I've included step-by-step instructions, common mistakes to avoid, and some tips from experienced crocheters.

Would love to hear your experiences with this in the comments! What's your biggest challenge when it comes to ${article.seoKeyword}?`;
  }

  /**
   * Generate Twitter hook (short, punchy)
   */
  private generateTwitterHook(article: any): string {
    return `🧵 Just published: ${article.title}\n\nHere's what you need to know about ${article.seoKeyword}:\n\n👇`;
  }

  /**
   * Extract key insight from article (for social snippets)
   */
  private extractKeyInsight(article: any): string {
    // This would parse article content
    // For now, return a generic insight
    return `Most beginners struggle with consistency, but there's a simple trick that fixes it immediately.`;
  }

  /**
   * Extract short tip for TikTok/Instagram
   */
  private extractShortTip(article: any): string {
    return `The #1 mistake: Skipping practice. But 10 minutes a day beats 2 hours once a week.`;
  }

  /**
   * Generate Twitter reply (conversational)
   */
  private generateTwitterReply(tweet: string, analysis: any): string {
    return `Great question! The trick is to ${this.generateTip(analysis.type)}. Give it a try and let me know how it goes! 🧶`;
  }

  /**
   * Generate contextual tip
   */
  private generateTip(type: string): string {
    const tips: Record<string, string> = {
      beginner: 'start with one simple stitch and practice until it feels natural',
      technique: 'focus on tension - consistency beats speed every time',
      project: 'choose a pattern just slightly above your skill level',
      business: 'track your time and materials to price fairly',
      material: 'invest in quality yarn - it makes a huge difference',
    };

    return tips[type] || 'practice regularly and ask the community for help';
  }
}

export const socialAutomation = new SocialMediaAutomation();
