import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NewsletterSignup from '../components/NewsletterSignup';
import { goToLifetimeCheckout } from '../lib/stripe-client';

// Blog post data structure
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  path: string; // Direct path to page
  author: string;
  publishedDate: string;
  readTime: number; // minutes
  category: string;
  tags: string[];
  coverImage?: string;
  isExternal?: boolean;
}

// SEO Content Pages as Blog Posts
const blogPosts: BlogPost[] = [
  {
    id: 'guide-1',
    path: '/crochet-pricing-guide',
    title: 'How to Price Your Crochet Work: A Fair Formula',
    excerpt: 'Stop guessing! Learn how to calculate fair prices for your handmade items using our proven formula: Materials + (Time × Hourly Rate).',
    author: 'My Crochet Kit Team',
    publishedDate: '2024-12-07',
    readTime: 5,
    category: 'Business',
    tags: ['pricing', 'selling', 'business', 'calculator'],
  },
  {
    id: 'guide-2',
    path: '/crochet-abbreviations',
    title: 'Complete Crochet Abbreviations Guide (US vs UK)',
    excerpt: 'Confused by "sc" vs "dc"? Our comprehensive chart covers 40+ common abbreviations with translations between US and UK terminology.',
    author: 'My Crochet Kit Team',
    publishedDate: '2024-12-07',
    readTime: 8,
    category: 'Reference',
    tags: ['abbreviations', 'dictionary', 'beginners'],
  },
  {
    id: 'guide-3',
    path: '/hook-size-chart',
    title: 'Crochet Hook Size Conversion Chart',
    excerpt: 'Never guess your hook size again. Convert between Metric (mm), US letters/numbers, and UK numbers with our complete reference guide.',
    author: 'My Crochet Kit Team',
    publishedDate: '2024-12-07',
    readTime: 3,
    category: 'Guides',
    tags: ['hooks', 'sizes', 'tools', 'reference'],
  },
  {
    id: 'guide-4',
    path: '/yarn-weight-chart',
    title: 'Ultimate Yarn Weight Guide & Chart',
    excerpt: 'From Lace to Jumbo: Understand the Standard Yarn Weight System, WPI, and recommended hook sizes for every yarn category.',
    author: 'My Crochet Kit Team',
    publishedDate: '2024-12-07',
    readTime: 6,
    category: 'Guides',
    tags: ['yarn', 'weights', 'materials', 'guide'],
  },
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [importedPosts, setImportedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Business', 'Reference', 'Guides'];

  const fetchManifest = async () => {
    try {
      const response = await fetch('/blog/posts.json');
      if (response.ok) {
        const data: BlogPost[] = await response.json();
        // Add isExternal flag to imported posts
        const postsWithFlag = data.map((post) => ({
          ...post,
          isExternal: true
        }));
        setImportedPosts(postsWithFlag);
      }
    } catch (error) {
      console.error('Failed to fetch blog manifest:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManifest();
  }, []);

  const allPosts = [...blogPosts, ...importedPosts].sort((a, b) => 
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

  const filteredPosts = selectedCategory === 'All'
    ? allPosts
    : allPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900 text-white py-16 transition-colors">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-10 w-10" />
            <h1 className="text-4xl md:text-5xl font-black">Crochet Hub</h1>
          </div>
          <p className="text-xl opacity-90">
            Tips, tutorials, and business advice for crocheters
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Newsletter Signup */}
        <NewsletterSignup />

        {/* Lifetime Founders CTA */}
        <div className="mt-12 bg-indigo-900 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-indigo-800 dark:border-slate-800 text-white transition-colors">
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-emerald-500 text-xs font-bold px-2 py-1 rounded mb-4">FOUNDERS OFFER</div>
              <h3 className="text-3xl font-black mb-4">Lock in everything for life.</h3>
              <p className="text-indigo-200 text-lg mb-0">
                Join our first 500 members and never pay for a subscription again. 
                Includes all future Pro features, 0% marketplace fees, and a $10 Amazon Gift Card referral bonus.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="text-3xl font-bold text-emerald-300">$79.99 <span className="text-lg font-normal text-indigo-300">one-time</span></div>
                <button 
                  onClick={goToLifetimeCheckout}
                  className="bg-white text-indigo-900 px-8 py-4 rounded-full font-bold hover:bg-indigo-50 transition-all shadow-lg whitespace-nowrap"
                >
                  Claim Lifetime Access 🚀
                </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 mt-12">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-indigo-600 dark:bg-purple-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts */}
        <div id="blog-posts-list" className="grid gap-8 md:grid-cols-1">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            filteredPosts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))
          )}
        </div>

        {/* No Posts */}
        {!isLoading && filteredPosts.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-lg p-12 text-center shadow-sm border border-gray-100 dark:border-slate-800">
            <p className="text-gray-600 dark:text-slate-400">No posts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface BlogPostCardProps {
  post: BlogPost;
}

function BlogPostCard({ post }: BlogPostCardProps) {
  const isInternal = !post.isExternal;
  const defaultImage = "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800"; // Cozy yarn fallback
  const coverImage = post.coverImage || defaultImage;

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-indigo-500/20 transition-all duration-300">
      <div className="md:flex">
        <div className="md:w-[40%] relative overflow-hidden">
          <img
            src={coverImage}
            alt={post.title}
            className="w-full h-full aspect-video md:aspect-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:hidden" />
        </div>
        
        <div className="p-6 md:p-8 md:w-[60%] flex flex-col">
          {/* Category & Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400 mb-4">
            <span className="bg-indigo-50 dark:bg-purple-900/40 text-indigo-700 dark:text-purple-300 px-3 py-1 rounded-full font-semibold transition-colors">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {isInternal ? (
              <Link to={post.path} className="hover:text-indigo-600 transition-colors">
                {post.title}
              </Link>
            ) : (
              <a href={post.path} className="hover:text-indigo-600 transition-colors">
                {post.title}
              </a>
            )}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="text-xs bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 px-2 py-1 rounded border border-gray-100 dark:border-slate-700 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Read More */}
            {isInternal ? (
              <Link
                to={post.path}
                className="inline-flex items-center gap-2 text-indigo-600 dark:text-purple-400 font-bold hover:text-indigo-700 dark:hover:text-purple-300 transition-colors"
              >
                Read More
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <a
                href={post.path}
                className="inline-flex items-center gap-2 text-indigo-600 dark:text-purple-400 font-bold hover:text-indigo-700 dark:hover:text-purple-300 transition-colors"
              >
                Read More
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
