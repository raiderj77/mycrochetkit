/**
 * Daily Content Strategy
 * 
 * Generates 5 different types of articles daily
 * Targets: low-hanging fruit keywords + long-tail + seasonal
 * 
 * Rotation (365 days/year):
 * - Monday: Beginner tips (easy keywords, high intent)
 * - Tuesday: Stitch tutorials (long-tail, technical)
 * - Wednesday: Project ideas (seasonal, trending)
 * - Thursday: Business/pricing (money-making, commercial intent)
 * - Friday: FAQ answer (question-based, voice search)
 * 
 * Each article: 800-1200 words, SEO optimized, product mention
 */

export interface DailyContentType {
  type: 'beginner' | 'stitch' | 'project' | 'business' | 'faq';
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  category: string;
  keywordFocus: string;
  difficulty: 'easy' | 'medium' | 'hard';
  competitionLevel: 'low' | 'medium' | 'high';
  trafficPotential: 'high' | 'medium' | 'low';
}

export interface DailyArticleTemplate {
  type: DailyContentType['type'];
  keyword: string;
  title: string;
  outline: string[];
  wordCountTarget: number;
  internalLinks: string[];
  productMention: string;
}

class DailyContentStrategy {
  /**
   * Monday: Beginner Tips
   * Keywords: "how to", "beginner", "learn", "easy"
   * Low competition, high intent (people WANT to learn)
   * Examples: "How to Hold a Crochet Hook", "Easy Crochet Stitches for Beginners"
   */
  generateMondayBeginner(): DailyArticleTemplate {
    const beginnerTopics = [
      { keyword: 'how to hold crochet hook', difficulty: 'easy' },
      { keyword: 'best crochet yarn for beginners', difficulty: 'easy' },
      { keyword: 'crochet tension how to fix', difficulty: 'medium' },
      { keyword: 'how to count crochet rows', difficulty: 'easy' },
      { keyword: 'crochet for left handed people', difficulty: 'easy' },
      { keyword: 'first crochet project for beginners', difficulty: 'easy' },
      { keyword: 'how to read crochet patterns', difficulty: 'medium' },
      { keyword: 'crochet cast on methods', difficulty: 'easy' },
      { keyword: 'how to fix crochet mistakes', difficulty: 'medium' },
      { keyword: 'best crochet hooks for beginners', difficulty: 'easy' },
    ];

    const topic = beginnerTopics[Math.floor(Math.random() * beginnerTopics.length)];
    const keyword = topic.keyword;

    return {
      type: 'beginner',
      keyword,
      title: `${this.titleCase(keyword)}: Complete Beginner Guide`,
      outline: [
        `What is ${keyword}?`,
        `Why this matters for crocheters`,
        `Step-by-step guide`,
        `Common beginner mistakes`,
        `Practice tips`,
        `When to move to the next skill`,
        `FAQ`,
      ],
      wordCountTarget: 1000,
      internalLinks: ['/crochet-abbreviations', '/hook-size-chart', '/yarn-weight-chart'],
      productMention: 'Beginner Crochet Kit',
    };
  }

  /**
   * Tuesday: Stitch Tutorials
   * Keywords: "how to", specific stitch names, "step by step"
   * Long-tail, technical, high engagement
   * Examples: "How to Double Crochet", "Moss Stitch Tutorial"
   */
  generateTuesdayStitch(): DailyArticleTemplate {
    const stitches = [
      { keyword: 'single crochet stitch', difficulty: 'easy' },
      { keyword: 'double crochet stitch', difficulty: 'easy' },
      { keyword: 'triple crochet stitch', difficulty: 'medium' },
      { keyword: 'half double crochet', difficulty: 'easy' },
      { keyword: 'slip stitch crochet', difficulty: 'easy' },
      { keyword: 'moss stitch crochet', difficulty: 'medium' },
      { keyword: 'v stitch crochet', difficulty: 'medium' },
      { keyword: 'shell stitch crochet', difficulty: 'medium' },
      { keyword: 'popcorn stitch crochet', difficulty: 'hard' },
      { keyword: 'puff stitch tutorial', difficulty: 'medium' },
      { keyword: 'bobble stitch crochet', difficulty: 'medium' },
      { keyword: 'cable stitch crochet', difficulty: 'hard' },
    ];

    const topic = stitches[Math.floor(Math.random() * stitches.length)];
    const keyword = topic.keyword;

    return {
      type: 'stitch',
      keyword,
      title: `${this.titleCase(keyword)}: Step-by-Step Tutorial`,
      outline: [
        `What is the ${keyword}?`,
        `Tools you'll need`,
        `Step-by-step instructions`,
        `Common mistakes`,
        `Video tutorial recommendation`,
        `Projects using this stitch`,
        `FAQ`,
      ],
      wordCountTarget: 900,
      internalLinks: ['/crochet-abbreviations', '/hook-size-chart'],
      productMention: 'Complete Stitch Kit',
    };
  }

  /**
   * Wednesday: Project Ideas
   * Keywords: "crochet gift ideas", "easy projects", seasonal trends
   * Medium competition, seasonal spikes
   * Examples: "Crochet Gift Ideas for Christmas", "Quick Beginner Projects"
   */
  generateWednesdayProject(): DailyArticleTemplate {
    const projects = [
      { keyword: 'easy crochet blanket pattern', season: 'winter' },
      { keyword: 'crochet amigurumi ideas', season: 'any' },
      { keyword: 'quick crochet gift ideas', season: 'holiday' },
      { keyword: 'crochet scarf patterns easy', season: 'winter' },
      { keyword: 'crochet summer shawl', season: 'summer' },
      { keyword: 'baby crochet projects', season: 'spring' },
      { keyword: 'crochet coaster patterns', season: 'any' },
      { keyword: 'crochet stuffed animals', season: 'any' },
      { keyword: 'crochet bag pattern easy', season: 'spring' },
      { keyword: 'crochet dishcloth ideas', season: 'any' },
      { keyword: 'crochet baby blanket easy', season: 'spring' },
      { keyword: 'christmas crochet ornaments', season: 'winter' },
    ];

    const topic = projects[Math.floor(Math.random() * projects.length)];
    const keyword = topic.keyword;

    return {
      type: 'project',
      keyword,
      title: `${this.titleCase(keyword)} - 5 Ideas You Can Start Today`,
      outline: [
        `Quick project ideas`,
        `Project #1 - Materials needed`,
        `Project #2 - Difficulty level`,
        `Project #3 - Time to complete`,
        `Project #4 - Best for gifts`,
        `Project #5 - Perfect for practice`,
        `How to choose your first project`,
        `FAQ`,
      ],
      wordCountTarget: 1100,
      internalLinks: ['/yarn-weight-chart', '/hook-size-chart', '/crochet-pricing-guide'],
      productMention: 'Themed Project Kit',
    };
  }

  /**
   * Thursday: Business/Pricing Content
   * Keywords: "how to sell", "pricing", "starting a business"
   * Low competition, high commercial intent
   * Examples: "How to Price Crochet Items", "Selling Crochet Online"
   */
  generateThursdayBusiness(): DailyArticleTemplate {
    const businessTopics = [
      { keyword: 'how to price crochet work', difficulty: 'medium' },
      { keyword: 'how to sell crochet items online', difficulty: 'medium' },
      { keyword: 'crochet business startup costs', difficulty: 'medium' },
      { keyword: 'how to start selling on etsy', difficulty: 'medium' },
      { keyword: 'crochet commission pricing', difficulty: 'hard' },
      { keyword: 'how much to charge for crochet', difficulty: 'medium' },
      { keyword: 'crochet business tax deductions', difficulty: 'hard' },
      { keyword: 'selling crochet at craft fairs', difficulty: 'easy' },
      { keyword: 'bulk crochet orders pricing', difficulty: 'hard' },
      { keyword: 'crochet wholesale pricing', difficulty: 'hard' },
    ];

    const topic = businessTopics[Math.floor(Math.random() * businessTopics.length)];
    const keyword = topic.keyword;

    return {
      type: 'business',
      keyword,
      title: `${this.titleCase(keyword)}: Complete Guide`,
      outline: [
        `Why this matters`,
        `The basic formula`,
        `Step 1: Calculate materials`,
        `Step 2: Determine hourly rate`,
        `Step 3: Factor in overhead`,
        `Pricing examples`,
        `Common mistakes`,
        `Tools and resources`,
        `FAQ`,
      ],
      wordCountTarget: 1200,
      internalLinks: ['/crochet-pricing-guide'],
      productMention: 'Business Starter Kit',
    };
  }

  /**
   * Friday: FAQ Answers
   * Keywords: question-based "what is", "why", "can you"
   * Voice search optimized, conversational
   * Examples: "Can You Crochet With Thicker Yarn?", "What is Amigurumi?"
   */
  generateFridayFAQ(): DailyArticleTemplate {
    const faqs = [
      { keyword: 'what is amigurumi', answer: 'Japanese stuffed animal technique' },
      { keyword: 'can you crochet with cotton yarn', answer: 'Yes, popular choice' },
      { keyword: 'is crochet easier than knitting', answer: 'Subjective but often yes' },
      { keyword: 'what yarn weight for beginners', answer: 'Worsted weight (4)' },
      { keyword: 'can you crochet left handed', answer: 'Absolutely, multiple methods' },
      { keyword: 'what is a yarn weight chart', answer: 'Standardized sizing system' },
      { keyword: 'how long does crochet take', answer: 'Depends on project' },
      { keyword: 'why do crochet edges curl', answer: 'Tension and stitch issues' },
      { keyword: 'can you fix crochet mistakes', answer: 'Most are fixable' },
      { keyword: 'what is the easiest stitch', answer: 'Single crochet' },
      { keyword: 'why is my crochet tight', answer: 'Tension control tips' },
      { keyword: 'can you dye crochet yarn', answer: 'Yes, multiple methods' },
    ];

    const topic = faqs[Math.floor(Math.random() * faqs.length)];
    const keyword = topic.keyword;

    return {
      type: 'faq',
      keyword,
      title: `${this.titleCase(keyword)}? - Clear Answer Inside`,
      outline: [
        `Quick answer (first 2 sentences)`,
        `Why people ask this`,
        `Detailed explanation`,
        `Examples and scenarios`,
        `Common follow-up questions`,
        `Pro tips`,
        `Next steps`,
      ],
      wordCountTarget: 800,
      internalLinks: ['/crochet-abbreviations', '/yarn-weight-chart', '/hook-size-chart'],
      productMention: 'Beginner Crochet Kit',
    };
  }

  /**
   * Get today's article template based on day of week
   */
  getTodayArticleTemplate(): DailyArticleTemplate {
    const today = new Date();
    const dayOfWeek = today.getDay();

    switch (dayOfWeek) {
      case 1: // Monday
        return this.generateMondayBeginner();
      case 2: // Tuesday
        return this.generateTuesdayStitch();
      case 3: // Wednesday
        return this.generateWednesdayProject();
      case 4: // Thursday
        return this.generateThursdayBusiness();
      case 5: // Friday
        return this.generateFridayFAQ();
      default: // Saturday/Sunday - weekend special (bonus content)
        return this.generateWeekendBonus();
    }
  }

  /**
   * Weekend bonus content (Saturday/Sunday)
   * Customer spotlights, success stories, trending topics
   */
  private generateWeekendBonus(): DailyArticleTemplate {
    const weekendTopics = [
      { keyword: 'trending crochet patterns 2026', type: 'trend' },
      { keyword: 'most popular crochet projects', type: 'popular' },
      { keyword: 'crochet yarn color trends', type: 'trend' },
      { keyword: 'famous crochet designers', type: 'inspiration' },
      { keyword: 'crochet community highlights', type: 'community' },
    ];

    const topic = weekendTopics[Math.floor(Math.random() * weekendTopics.length)];
    const keyword = topic.keyword;

    return {
      type: 'faq',
      keyword,
      title: `${this.titleCase(keyword)} - What's Hot Right Now`,
      outline: [
        `What's trending`,
        `Top 5 things`,
        `Why people love this`,
        `How to try it yourself`,
        `Community spotlight`,
        `Resources`,
      ],
      wordCountTarget: 900,
      internalLinks: ['/blog'],
      productMention: 'Complete Kit Selection',
    };
  }

  /**
   * Low-hanging fruit keyword analysis
   * Low volume, low competition, but targeted
   */
  getLowHangingFruitKeywords(): Array<{ keyword: string; difficulty: string; potentialRevenue: string }> {
    return [
      // Beginner keywords (very easy to rank for)
      { keyword: 'crochet chain stitch', difficulty: 'easy', potentialRevenue: 'low-medium' },
      { keyword: 'how to knot crochet', difficulty: 'easy', potentialRevenue: 'low' },
      { keyword: 'crochet for beginners 2026', difficulty: 'easy', potentialRevenue: 'medium' },

      // Long-tail specific stitches
      { keyword: 'waffle stitch crochet', difficulty: 'medium', potentialRevenue: 'low' },
      { keyword: 'thermal stitch crochet', difficulty: 'medium', potentialRevenue: 'low' },
      { keyword: 'virus stitch pattern free', difficulty: 'easy', potentialRevenue: 'medium' },

      // Commercial intent (money-making keywords)
      { keyword: 'crochet business name ideas', difficulty: 'easy', potentialRevenue: 'high' },
      { keyword: 'how much crocheters charge', difficulty: 'medium', potentialRevenue: 'high' },

      // Question-based (voice search)
      { keyword: 'why is crochet good for you', difficulty: 'easy', potentialRevenue: 'medium' },
      { keyword: 'how to make crochet softer', difficulty: 'easy', potentialRevenue: 'low' },

      // Seasonal (high spikes)
      { keyword: 'crochet gift ideas under 50', difficulty: 'easy', potentialRevenue: 'high' },
      { keyword: 'quick crochet projects one day', difficulty: 'medium', potentialRevenue: 'medium' },
    ];
  }

  /**
   * Long-tail keyword strategy
   * Very specific, low volume but high intent
   */
  getLongTailKeywords(): Array<{ keyword: string; intent: string; productTieIn: string }> {
    return [
      // Extremely specific searches (people know exactly what they want)
      { keyword: 'how to crochet amigurumi strawberry step by step', intent: 'tutorial', productTieIn: 'Amigurumi Kit' },
      { keyword: 'crochet blanket pattern for someone learning', intent: 'learning', productTieIn: 'Beginner Kit' },
      { keyword: 'how to tell if crochet is acrylic or cotton', intent: 'identification', productTieIn: 'Yarn Guide' },
      { keyword: 'crochet patterns that look like knitting', intent: 'technique', productTieIn: 'Stitch Kit' },
      { keyword: 'how to crochet in the round for beginners', intent: 'technique', productTieIn: 'Beginner Kit' },
      { keyword: 'crochet pattern for plus size blanket', intent: 'specific', productTieIn: 'Large Project Kit' },
      { keyword: 'fastest crochet stitch for blankets', intent: 'efficiency', productTieIn: 'Speed Kit' },
      { keyword: 'crochet stitches that look like flowers', intent: 'aesthetic', productTieIn: 'Decorative Kit' },
      { keyword: 'how to crochet without getting hand cramps', intent: 'health', productTieIn: 'Ergonomic Kit' },
      { keyword: 'cheapest yarn for practice crochet', intent: 'budget', productTieIn: 'Budget Kit' },
    ];
  }

  /**
   * Helper: convert to title case
   */
  private titleCase(text: string): string {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get keyword difficulty (low-hanging fruit identifier)
   */
  getKeywordDifficulty(keyword: string): 'low' | 'medium' | 'high' {
    const easyPatterns = ['how to', 'easy', 'beginner', 'for dummies', 'tutorial', 'guide'];
    const hasEasyPattern = easyPatterns.some(pattern => keyword.toLowerCase().includes(pattern));

    if (hasEasyPattern || keyword.split(' ').length > 4) return 'low';
    if (keyword.split(' ').length === 2) return 'high';
    return 'medium';
  }
}

export const dailyStrategy = new DailyContentStrategy();
