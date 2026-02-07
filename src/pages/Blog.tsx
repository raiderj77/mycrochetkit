import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';

export const Blog = () => {
  const posts = [
    {
      slug: 'real-cost-handmade-crochet-blanket',
      title: 'The Real Cost of a Handmade Crochet Blanket (The Math Will Hurt)',
      excerpt:
        'Someone asked me to make them a blanket. I did the math. Here is why most of us only crochet for people we actually love.',
      date: '2026-02-05',
      readTime: '5 min read',
      category: 'Crochet Life',
    },
    {
      slug: 'how-to-never-lose-row-count-crochet',
      title: 'How to Never Lose Your Row Count Again (5 Methods Compared)',
      excerpt:
        'Compare 5 row tracking methods — from tally marks to voice-activated apps — and find what actually works for your crochet workflow.',
      date: '2026-02-03',
      readTime: '7 min read',
      category: 'Crochet Tips',
    },
    {
      slug: 'crochet-trends-2026',
      title: "Top Crochet Trends 2026: What's Hot in the Crochet Community",
      excerpt:
        'From granny square revivals to sustainable yarn choices, discover what crocheters are actually making in 2026.',
      date: '2026-02-01',
      readTime: '8 min read',
      category: 'Trends',
    },
  ];

  return (
    <>
      <SEOHead
        title="Crochet Blog: Patterns, Tips, Trends & Tutorials | MyCrochetKit"
        description="Explore crochet patterns, techniques, trending projects, and expert tips. From beginner tutorials to advanced colorwork, your complete crochet resource."
        canonicalUrl="https://mycrochetkit.com/blog"
      />

      <div className="min-h-screen bg-[#FFF8F0]">
        <header className="sticky top-0 z-50 bg-[#FFF8F0]/80 backdrop-blur-xl border-b border-[#2C1810]/5">
          <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E86A58] to-[#D35A4A] flex items-center justify-center shadow-md">
                <span className="text-xl">🧶</span>
              </div>
              <span className="font-semibold text-[#2C1810] text-lg">MyCrochetKit</span>
            </Link>
          </div>
        </header>

        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-6">Crochet Blog</h1>
            <p className="text-xl text-[#2C1810]/70">
              Patterns, tips, trends, and inspiration for crocheters of all skill levels
            </p>
          </div>
        </section>

        <section className="px-6 py-12 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={'/blog/' + post.slug}
                className="group bg-white rounded-3xl p-8 shadow-sm border border-[#2C1810]/5 hover:shadow-md hover:border-[#E86A58]/20 transition-all"
              >
                <div className="flex items-center gap-2 text-sm text-[#E86A58] mb-3">
                  <span className="px-3 py-1 bg-[#E86A58]/10 rounded-full font-medium">
                    {post.category}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-[#2C1810] mb-3 group-hover:text-[#E86A58] transition-colors">
                  {post.title}
                </h2>

                <p className="text-[#2C1810]/70 mb-4 leading-relaxed">{post.excerpt}</p>

                <div className="flex items-center gap-4 text-sm text-[#2C1810]/60">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                <div className="mt-4 text-[#E86A58] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
