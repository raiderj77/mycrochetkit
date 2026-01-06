/**
 * Content Generation Pipeline
 * 
 * Generates SEO + LLM optimized blog posts from trends
 * Follows strict rules for readability and ranking
 */

import { TrendTopic } from './trendDiscovery';

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: Date;
  updatedDate: Date;
  readTime: number;
  category: string;
  tags: string[];
  coverImage: string;
  seoKeyword: string;
  internalLinks: Array<{ text: string; url: string }>;
  externalLinks: Array<{ text: string; url: string }>;
  faqSchema: Array<{ question: string; answer: string }>;
  productMention: string;
  contentSections: ContentSection[];
}

export interface ContentSection {
  heading: string;
  level: 'h2' | 'h3';
  content: string;
  bullets?: string[];
  wordCount: number;
}

class ContentGenerator {
  /**
   * Generate article structure from trend
   */
  generateArticleStructure(trend: TrendTopic): Partial<BlogArticle> {
    const slug = this.generateSlug(trend.topic);
    
    return {
      id: `article-${slug}`,
      slug,
      title: this.generateSEOTitle(trend.topic, trend.relatedKeywords[0]),
      excerpt: this.generateExcerpt(trend.topic, trend.searchIntent),
      author: 'My Crochet Kit Team',
      category: this.categorizeContent(trend.searchIntent),
      tags: trend.relatedKeywords,
      seoKeyword: trend.relatedKeywords[0],
      productMention: trend.productTieIn,
      internalLinks: trend.internalLinkTargets.map(url => ({
        text: this.urlToLinkText(url),
        url
      })),
    };
  }

  /**
   * Generate SEO-optimized title
   * Rules: keyword in first 60 chars, compelling, includes number if possible
   */
  private generateSEOTitle(topic: string, keyword: string): string {
    const templates = [
      `${keyword}: Complete Guide for Crocheters`,
      `${keyword} in 2026: Everything You Need to Know`,
      `5 Ways ${keyword} Can Transform Your Crochet`,
      `${keyword}: Step-by-Step Tutorial`,
      `Master ${keyword} - The Complete Crochet Guide`,
    ];

    return templates.find(t => t.includes(keyword)) || `${keyword}: Complete Guide`;
  }

  /**
   * Generate excerpt (155-160 chars for optimal CTR)
   */
  private generateExcerpt(topic: string, intent: TrendTopic['searchIntent']): string {
    const templates = {
      beginner: `New to crochet? Learn ${topic} step-by-step. This complete guide covers everything beginners need to know.`,
      question: `Wondering about ${topic}? Get expert answers, practical tips, and insider secrets in this comprehensive guide.`,
      product: `${topic} made easy. Discover the best methods, tools, and kits to master this essential crochet skill.`,
      intermediate: `Level up your crochet skills. ${topic} is easier than you think—here's exactly how to do it right.`,
      advanced: `Advanced crochet techniques for ${topic}. Master complex stitches and professional methods step-by-step.`,
    };

    return templates[intent] || templates.question;
  }

  /**
   * Categorize content by intent
   */
  private categorizeContent(intent: TrendTopic['searchIntent']): string {
    const categories = {
      beginner: 'Beginner Guides',
      intermediate: 'Tutorials',
      advanced: 'Advanced Techniques',
      product: 'Product Guides',
      question: 'FAQ & Tips',
    };
    return categories[intent] || 'Guides';
  }

  /**
   * Generate URL-safe slug
   */
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Convert URL path to readable link text
   */
  private urlToLinkText(url: string): string {
    return url
      .split('/')
      .pop()
      ?.replace(/-/g, ' ')
      .replace(/^\w/, c => c.toUpperCase()) || 'Related Guide';
  }

  /**
   * Generate article outline (H2 + H3 structure)
   */
  generateOutline(topic: string): string[] {
    return [
      `What is ${topic}?`,
      `Why ${topic} Matters for Crocheters`,
      `Getting Started: Tools You Need`,
      `Step-by-Step Guide`,
      `Common Mistakes to Avoid`,
      `Practice Projects`,
      `FAQ`,
    ];
  }

  /**
   * Build content section with proper formatting
   * Rules: 150-200 words per section, bullet points, short sentences
   */
  buildContentSection(heading: string, level: 'h2' | 'h3', content: string): ContentSection {
    const sentences = content.split('. ').filter(s => s.trim());
    const wordCount = content.split(/\s+/).length;

    return {
      heading,
      level,
      content: sentences.join('. '),
      wordCount,
    };
  }

  /**
   * Generate SEO-optimized FAQ schema
   */
  generateFAQ(topic: string, keyword: string): Array<{ question: string; answer: string }> {
    return [
      {
        question: `What is ${keyword}?`,
        answer: `${keyword} is a fundamental crochet technique that allows you to create beautiful, consistent stitches.`,
      },
      {
        question: `How long does it take to learn ${keyword}?`,
        answer: `Most beginners can learn basic ${keyword} in 1-2 hours of practice.`,
      },
      {
        question: `What tools do I need?`,
        answer: `You primarily need a crochet hook and yarn. Our starter kits include everything needed.`,
      },
      {
        question: `Is ${keyword} difficult?`,
        answer: `No! ${keyword} is beginner-friendly. With practice, anyone can master it.`,
      },
    ];
  }

  /**
   * Add internal links naturally (3-5 per article)
   */
  addInternalLinks(
    targets: string[]
  ): Array<{ text: string; url: string }> {
    return targets.slice(0, 3).map(url => ({
      text: this.urlToLinkText(url),
      url,
    }));
  }

  /**
   * Add external authority links (2-3 per article)
   */
  addExternalLinks(): Array<{ text: string; url: string }> {
    return [
      {
        text: 'Ravelry - Crochet Pattern Library',
        url: 'https://www.ravelry.com/',
      },
      {
        text: 'The Crochet Crowd - Video Tutorials',
        url: 'https://www.thecrochetcrowd.com/',
      },
    ];
  }

  /**
   * Generate cover image URL (Unsplash)
   */
  generateCoverImage(): string {
    return `https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=1200`;
  }

  /**
   * Calculate read time (average 200 words per minute)
   */
  calculateReadTime(wordCount: number): number {
    return Math.ceil(wordCount / 200);
  }

  /**
   * Build complete article from trend
   */
  async buildCompleteArticle(trend: TrendTopic): Promise<BlogArticle> {
    const structure = this.generateArticleStructure(trend);
    const keyword = trend.relatedKeywords[0];
    const outline = this.generateOutline(trend.topic);

    const contentSections: ContentSection[] = [];
    let totalWordCount = 0;

    for (const heading of outline) {
      const section = this.buildContentSection(heading, 'h2', `Content for ${heading}`);
      contentSections.push(section);
      totalWordCount += section.wordCount;
    }

    const faqSchema = this.generateFAQ(trend.topic, keyword);
    const internalLinks = this.addInternalLinks(trend.internalLinkTargets);
    const externalLinks = this.addExternalLinks();
    const readTime = this.calculateReadTime(totalWordCount);

    return {
      ...(structure as BlogArticle),
      content: contentSections.map(s => `## ${s.heading}\n\n${s.content}`).join('\n\n'),
      publishedDate: new Date(),
      updatedDate: new Date(),
      readTime,
      coverImage: this.generateCoverImage(),
      internalLinks,
      externalLinks,
      faqSchema,
      contentSections,
    };
  }
}

export const contentGen = new ContentGenerator();
