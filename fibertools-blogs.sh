#!/bin/bash
set -e
echo "🧶 Building 15 FiberTools blog posts..."

# ============================================================
# Step 1: Clean up old markdown blog system
# ============================================================
echo "🧹 Step 1: Removing old markdown blog system..."
rm -f src/pages/blog/FiberToolsBlogPost.tsx
rm -f src/pages/blog/FiberToolsBlogIndex.tsx
rm -rf public/blog-posts/

# ============================================================
# Step 2: Create shared BlogPostLayout component
# ============================================================
echo "📐 Step 2: Creating shared BlogPostLayout..."
mkdir -p src/components

cat > src/components/BlogPostLayout.tsx << 'ENDOFFILE'
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ExternalLink } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';
import { ShareButtons } from './ShareButtons';

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogPostLayoutProps {
  title: string;
  description: string;
  slug: string;
  date: string;
  readTime: string;
  category: string;
  keywords: string[];
  breadcrumbTitle: string;
  faqs: FAQItem[];
  toolUrl: string;
  toolName: string;
  children: React.ReactNode;
}

export const BlogPostLayout = ({
  title,
  description,
  slug,
  date,
  readTime,
  category,
  keywords,
  breadcrumbTitle,
  faqs,
  toolUrl,
  toolName,
  children,
}: BlogPostLayoutProps) => {
  const canonicalUrl = `https://mycrochetkit.com/blog/${slug}`;

  const faqSchema = faqs.length > 0 ? {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : undefined;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: title,
        description,
        author: {
          '@type': 'Person',
          name: 'Jason',
          description: 'Crocheter and developer. Founder of MyCrochetKit.',
          url: 'https://mycrochetkit.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'MyCrochetKit',
          url: 'https://mycrochetkit.com',
        },
        datePublished: date,
        dateModified: date,
        mainEntityOfPage: canonicalUrl,
        articleSection: category,
        keywords,
      },
      ...(faqSchema ? [faqSchema] : []),
    ],
  };

  return (
    <>
      <SEOHead
        title={`${title} | MyCrochetKit`}
        description={description}
        canonicalUrl={canonicalUrl}
        schema={articleSchema}
      />

      <div className="min-h-screen bg-[#FFF8F0]">
        <header className="sticky top-0 z-50 bg-[#FFF8F0]/80 backdrop-blur-xl border-b border-[#2C1810]/5">
          <div className="max-w-3xl mx-auto flex justify-between items-center px-6 py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E86A58] to-[#D35A4A] flex items-center justify-center shadow-md">
                <span className="text-xl">🧶</span>
              </div>
              <span className="font-semibold text-[#2C1810] text-lg">MyCrochetKit</span>
            </Link>
            <Link
              to="/blog"
              className="text-[#E86A58] font-medium flex items-center gap-2 hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Blog
            </Link>
          </div>
        </header>

        <nav className="max-w-3xl mx-auto px-6 pt-6 text-sm text-[#2C1810]/70" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#E86A58]">Home</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link to="/blog" className="hover:text-[#E86A58]">Blog</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-[#2C1810]/70">{breadcrumbTitle}</span>
        </nav>

        <article className="max-w-3xl mx-auto px-6 py-8">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-[#E86A58]/10 text-[#E86A58] text-sm font-medium rounded-full mb-4">
              {category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-4 leading-tight">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#2C1810]/60 mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {readTime}
              </span>
            </div>
            <ShareButtons url={canonicalUrl} title={title} />
          </div>

          <div className="prose-custom text-[#2C1810]/85 text-lg leading-relaxed space-y-6">
            {children}
          </div>

          {/* CTA Box */}
          <div className="my-12 p-8 bg-gradient-to-br from-[#E86A58]/10 to-[#B8A9C9]/10 rounded-2xl border border-[#E86A58]/20 text-center">
            <p className="text-2xl font-bold text-[#2C1810] mb-2">Try the {toolName}</p>
            <p className="text-[#2C1810]/70 mb-6">Free, instant, no signup required.</p>
            <a
              href={toolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#E86A58] hover:bg-[#D35A4A] text-white font-semibold rounded-xl transition-colors"
            >
              Open {toolName} <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* FAQ Section */}
          {faqs.length > 0 && (
            <section className="my-12">
              <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 border border-[#2C1810]/5">
                    <h3 className="text-lg font-semibold text-[#2C1810] mb-2">{faq.question}</h3>
                    <p className="text-[#2C1810]/75">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-[#2C1810]/10 text-center">
            <Link
              to="/blog"
              className="text-[#E86A58] font-semibold hover:underline inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </div>
        </article>
      </div>
    </>
  );
};
ENDOFFILE

echo "  ✅ BlogPostLayout.tsx created"

# ============================================================
# Step 3: Create all 15 blog post components
# ============================================================
echo "📝 Step 3: Creating 15 blog post components..."

# --- Post 1: Yarn Calculator ---
cat > src/pages/BlogPostYarnCalculator.tsx << 'ENDOFFILE'
import { BlogPostLayout } from '../components/BlogPostLayout';
import { Link } from 'react-router-dom';

export const BlogPostYarnCalculator = () => (
  <BlogPostLayout
    title="How Much Yarn Do I Need? The Complete Yardage Guide for Every Project"
    description="Calculate exactly how much yarn you need for any crochet or knitting project. Yardage charts for blankets, scarves, sweaters, hats, and more by yarn weight."
    slug="how-much-yarn-do-i-need"
    date="2026-02-14"
    readTime="10 min read"
    category="Crochet Guides"
    keywords={['how much yarn do I need', 'yarn yardage calculator', 'yarn needed for blanket', 'crochet yarn estimate', 'yarn calculator crochet']}
    breadcrumbTitle="How Much Yarn Do I Need"
    toolUrl="https://fibertools.app/yarn-calculator"
    toolName="Yarn Calculator"
    faqs={[
      { question: 'How much yarn do I need for a crochet blanket?', answer: 'A standard throw blanket (50" x 60") typically needs around 2,000 yards of medium-weight yarn, roughly 10-12 skeins. A baby blanket needs 800-1,200 yards. Queen-size blankets can require 2,500-3,000 yards. Your actual yardage depends on stitch pattern, tension, and yarn weight.' },
      { question: 'Does crochet use more yarn than knitting?', answer: 'Yes, crochet generally uses about 25-30% more yarn than knitting for the same size project. This is because crochet stitches are structurally bulkier. When converting a knitting pattern to crochet, always add at least 25% extra yardage to your estimate.' },
      { question: 'How do I calculate yarn needed without a pattern?', answer: 'Make a gauge swatch (at least 6" x 6"), weigh it, then calculate: (total project area ÷ swatch area) × swatch weight = total yarn weight needed. Add 10-20% for safety. This swatch method works for any stitch pattern and any yarn.' },
      { question: 'How many skeins of yarn for a scarf?', answer: 'A standard scarf (6" x 60") typically needs 300-500 yards. With worsted weight yarn in 200-yard skeins, plan on 2-3 skeins. Bulkier yarn or wider scarves will need more. An infinity scarf or cowl usually needs 200-400 yards.' },
    ]}
  >
    <p>
      You found the perfect pattern. You picked your yarn. You drove to the store, grabbed what felt like enough skeins, and started crocheting. Forty hours later, you run out of yarn on the last panel &mdash; and the store discontinued that dye lot.
    </p>
    <p>
      Every crocheter has a version of this story. The problem is that estimating yarn yardage is surprisingly tricky, and most of us just wing it. That ends today.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Why Yarn Estimates Go Wrong</h2>
    <p>
      Three things throw off your yarn estimate: stitch pattern density, personal tension, and yarn weight mismatches. A shell stitch blanket eats through yarn faster than a simple single crochet one. A tight crocheter uses more yarn per inch than a loose one. And swapping yarn weights without recalculating is a recipe for running short.
    </p>
    <p>
      The yarn label says &ldquo;makes a 50-inch blanket,&rdquo; but it assumes one specific stitch, one specific gauge, and one specific hook size. Change any of those variables and the estimate falls apart.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Yardage Estimates by Project Type</h2>
    <p>
      These are ballpark figures using worsted weight (size 4) yarn in standard stitches. Use them as a starting point, not gospel.
    </p>

    <h3 className="text-xl font-semibold text-[#2C1810] mt-8 mb-3">Blankets and Afghans</h3>
    <p>
      Baby blankets (30&rdquo; x 36&rdquo;) need 800 to 1,200 yards. A standard throw for the couch (50&rdquo; x 60&rdquo;) runs 1,800 to 2,200 yards. Twin-size blankets jump to 2,200 to 2,800 yards, and queen-size can hit 3,000+ yards. Textured stitches like bobbles or cables push those numbers 15-20% higher.
    </p>

    <h3 className="text-xl font-semibold text-[#2C1810] mt-8 mb-3">Scarves and Cowls</h3>
    <p>
      A basic scarf runs 300 to 500 yards. Wider scarves or lacy shawls can hit 600 to 900 yards. A simple cowl or infinity scarf needs 200 to 400 yards depending on how many times it wraps.
    </p>

    <h3 className="text-xl font-semibold text-[#2C1810] mt-8 mb-3">Hats and Beanies</h3>
    <p>
      An adult beanie typically uses 150 to 250 yards. Baby hats need just 50 to 100 yards. Slouchy hats or hats with folded brims push toward the higher end.
    </p>

    <h3 className="text-xl font-semibold text-[#2C1810] mt-8 mb-3">Sweaters and Cardigans</h3>
    <p>
      Adult sweaters are the big yarn eaters: 1,500 to 2,500 yards for a pullover, 1,800 to 3,000 for a cardigan. Plus-size garments and oversized fits add 20-30% more. Baby sweaters need 400 to 700 yards.
    </p>

    <h3 className="text-xl font-semibold text-[#2C1810] mt-8 mb-3">Amigurumi</h3>
    <p>
      Small amigurumi (3-5 inches) use 50 to 100 yards. Medium stuffed animals (8-12 inches) need 150 to 300 yards. Large amigurumi projects can hit 400+ yards, especially with multiple colors.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">The Gauge Swatch Method (Most Accurate)</h2>
    <p>
      If you want a precise estimate, the gauge swatch method beats any chart. Here is how it works:
    </p>
    <p>
      Crochet a swatch at least 6 inches square using your actual yarn, hook, and stitch pattern. Weigh the swatch on a kitchen scale (grams work best). Measure the swatch dimensions. Then calculate: divide your total project area by the swatch area, and multiply by the swatch weight. That gives you the total yarn weight needed. Convert grams to yards using the info on your yarn label.
    </p>
    <p>
      Always add 10-20% overage. It is far better to have leftover yarn than to run out two rows from the finish line with a discontinued dye lot.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">How Yarn Weight Changes Everything</h2>
    <p>
      Thinner yarn means more yards per ounce but also more yards needed for the same coverage. Lace weight yarn (size 1) packs 400+ yards per skein but you might need 2,000 yards for a shawl. Super bulky (size 6) only gives you 60-90 yards per skein, but a blanket works up in half the time and half the total yardage. The trade-off is always between yardage, weight, and time.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Tips to Stretch Your Yarn Further</h2>
    <p>
      Use a slightly larger hook for a looser fabric that covers more area with less yarn. Choose open stitch patterns like granny stitch or mesh &mdash; they use significantly less yarn than solid stitches. Alternate dense rows with lacy rows. Use one color instead of multiple (color changes always create waste). And if you are making a blanket from granny squares, the join-as-you-go technique eliminates the extra yarn needed for sewing seams.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">When to Buy Extra (And When Not To)</h2>
    <p>
      Always buy extra if: you are using a hand-dyed or indie yarn (dye lots vary wildly), the project is a gift with a deadline, or the yarn is on sale and might be discontinued. You can return unused skeins in most shops, but you cannot go back in time to match a dye lot. For standard acrylics from big brands, you can usually restock without dye lot worries &mdash; but even then, I would grab one extra skein.
    </p>

    <div className="my-8 p-6 bg-white rounded-xl border border-[#2C1810]/10">
      <p className="font-semibold text-[#2C1810] mb-2">Skip the math entirely</p>
      <p className="text-[#2C1810]/70">
        Our free <a href="https://fibertools.app/yarn-calculator" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] font-medium hover:underline">Yarn Calculator</a> does all of this for you. Plug in your project type, yarn weight, and dimensions &mdash; get instant yardage and skein estimates. No swatch required (though we always recommend one for garments).
      </p>
    </div>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Related Resources</h2>
    <p>
      If you are planning a blanket, check out our <Link to="/blog/crochet-blanket-size-chart" className="text-[#E86A58] font-medium hover:underline">Crochet Blanket Size Chart</Link> for standard dimensions by bed size. And if your gauge is off, our guide to the <Link to="/blog/crochet-gauge-calculator-guide" className="text-[#E86A58] font-medium hover:underline">Gauge Swatch Calculator</Link> walks you through measuring and adjusting.
    </p>
  </BlogPostLayout>
);
ENDOFFILE
echo "  ✅ 1/15 BlogPostYarnCalculator.tsx"

# --- Post 2: Blanket Size Chart ---
cat > src/pages/BlogPostBlanketCalculator.tsx << 'ENDOFFILE'
import { BlogPostLayout } from '../components/BlogPostLayout';
import { Link } from 'react-router-dom';

export const BlogPostBlanketCalculator = () => (
  <BlogPostLayout
    title="Crochet Blanket Size Chart: Dimensions, Yarn, and Starting Chains for Every Bed Size"
    description="Complete crochet blanket size guide with dimensions for baby, throw, twin, queen, and king blankets. Includes starting chain counts and yarn estimates by weight."
    slug="crochet-blanket-size-chart"
    date="2026-02-14"
    readTime="9 min read"
    category="Crochet Guides"
    keywords={['crochet blanket sizes', 'blanket size chart crochet', 'how many chains to start a blanket', 'crochet blanket dimensions', 'yarn needed for blanket']}
    breadcrumbTitle="Crochet Blanket Size Chart"
    toolUrl="https://fibertools.app/blanket-calculator"
    toolName="Blanket Calculator"
    faqs={[
      { question: 'How many chains should I start with for a crochet blanket?', answer: 'It depends on your gauge and desired width. For worsted weight yarn with a 5mm hook, you will get roughly 4 stitches per inch. A 50-inch wide throw needs about 200 starting chains. Always make a gauge swatch first and calculate: desired width in inches × stitches per inch = starting chain count. Add extra chains for your turning chain.' },
      { question: 'What is the most popular crochet blanket size?', answer: 'The most popular sizes are throw blankets (50" x 60") for everyday use and baby blankets (30" x 36" to 36" x 52") as gifts. Throw size is versatile enough for the couch, a car, or wrapping up in a chair, which is why most blanket patterns default to this size.' },
      { question: 'How big should a crochet baby blanket be?', answer: 'Standard baby blanket sizes are: receiving blanket (30" x 30"), stroller blanket (30" x 36"), and crib blanket (36" x 52"). Most crocheters go with 30" x 36" as a versatile middle ground. The blanket should be large enough to swaddle but not so large that it bunches up in a crib.' },
      { question: 'Why is my crochet blanket curling or not laying flat?', answer: 'Blankets curl when tension is too tight, when stitch counts are off (unintentional increases or decreases), or when the starting chain is too tight. Use a hook one size larger for your foundation chain. Count your stitches at the end of every row for the first few rows to catch errors early.' },
    ]}
  >
    <p>
      Starting a crochet blanket without knowing the right dimensions is like building a house without a blueprint. You will either end up with something that does not fit the bed, runs out of yarn, or takes twice as long as expected.
    </p>
    <p>
      This guide covers every standard blanket size, how many starting chains you need, and how much yarn to buy &mdash; so you can plan once and crochet with confidence.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Standard Crochet Blanket Sizes</h2>
    <p>
      Blanket sizes are not just about the mattress. A good blanket adds 10-15 inches on each side for drape, so you are not fighting for coverage in the middle of the night.
    </p>

    <h3 className="text-xl font-semibold text-[#2C1810] mt-8 mb-3">Baby Blankets</h3>
    <p>
      Receiving blankets are typically 30&rdquo; x 30&rdquo;, used for swaddling and tummy time. Stroller blankets run 30&rdquo; x 36&rdquo;, the most common size for baby shower gifts. Crib blankets are 36&rdquo; x 52&rdquo;, large enough to tuck into a crib mattress. For yarn, plan on 800 to 1,200 yards of worsted weight.
    </p>

    <h3 className="text-xl font-semibold text-[#2C1810] mt-8 mb-3">Throw and Lap Blankets</h3>
    <p>
      Lap blankets (40&rdquo; x 50&rdquo;) are perfect for wheelchair users or curling up in a chair. Standard throw blankets (50&rdquo; x 60&rdquo;) are the workhorse of the blanket world &mdash; couch-sized, gift-worthy, and not so large that they take a year to finish. Budget 1,800 to 2,200 yards.
    </p>

    <h3 className="text-xl font-semibold text-[#2C1810] mt-8 mb-3">Bed-Size Blankets</h3>
    <p>
      For blankets that cover a bed with proper drape: twin blankets should be about 66&rdquo; x 90&rdquo;, full/double 80&rdquo; x 90&rdquo;, queen 90&rdquo; x 100&rdquo;, and king 108&rdquo; x 100&rdquo;. These are serious yarn commitments &mdash; a queen-size blanket in worsted weight can easily require 3,000+ yards and months of work.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">How to Calculate Your Starting Chain</h2>
    <p>
      The formula is simple: desired width in inches multiplied by your stitch gauge (stitches per inch). If your gauge swatch shows 4 stitches per inch and you want a 50-inch throw, you need 200 chains plus your turning chain.
    </p>
    <p>
      But here is the catch: your foundation chain is almost always tighter than your working rows. This is the number one reason crochet blankets end up narrower than planned. The fix: use a hook one or two sizes larger for your foundation chain only, then switch back to your regular hook for row 1. Or use a foundation single crochet/double crochet chain, which has built-in stretch.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Choosing the Right Yarn Weight for Blankets</h2>
    <p>
      Worsted weight (size 4) is the most popular for blankets &mdash; it balances speed, warmth, and drape. Bulky weight (size 5) works up faster and makes thick, cozy blankets but uses more yarn by weight. Super bulky and jumbo yarns create chunky throws quickly but can be heavy and expensive. For baby blankets, lighter weights like DK (size 3) give a softer, more breathable fabric.
    </p>
    <p>
      Acrylic is the go-to for blankets because it is machine washable, affordable, and comes in every color imaginable. Cotton works for summer blankets but is heavier and has less stretch. Wool blends add warmth and luxury but require careful washing.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Best Stitches for Blankets</h2>
    <p>
      Simple stitches make the best blankets for beginners: single crochet creates a dense, warm fabric; half double crochet is slightly faster with a softer hand; and double crochet works up the fastest while still providing coverage. Granny stitch is a classic for a reason &mdash; it is fast, uses less yarn than solid stitches, and looks great in multiple colors.
    </p>
    <p>
      For texture without complexity, try the moss stitch (alternating single crochet and chain), linen stitch, or even a simple ripple/chevron. Each stitch pattern uses different amounts of yarn, so always factor that into your planning.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Avoiding Common Blanket Mistakes</h2>
    <p>
      Count your stitches religiously for the first 10 rows. Unintentional increases at the edges will make your blanket widen like a trapezoid. Mark the first and last stitch of each row with a stitch marker until counting becomes automatic. Weigh your yarn as you go &mdash; if you have used half your yarn and are not at the halfway point, you need to buy more now, not later.
    </p>

    <div className="my-8 p-6 bg-white rounded-xl border border-[#2C1810]/10">
      <p className="font-semibold text-[#2C1810] mb-2">Plan your blanket in seconds</p>
      <p className="text-[#2C1810]/70">
        The free <a href="https://fibertools.app/blanket-calculator" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] font-medium hover:underline">Blanket Calculator</a> gives you starting chain counts, row counts, and yarn estimates for any blanket size. Just pick your bed size and yarn weight.
      </p>
    </div>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Related Resources</h2>
    <p>
      Need help with yarn quantities? Check our <Link to="/blog/how-much-yarn-do-i-need" className="text-[#E86A58] font-medium hover:underline">complete yardage guide</Link>. Struggling with gauge? Our <Link to="/blog/crochet-gauge-calculator-guide" className="text-[#E86A58] font-medium hover:underline">gauge calculator guide</Link> walks through measuring and adjusting your swatch.
    </p>
  </BlogPostLayout>
);
ENDOFFILE
echo "  ✅ 2/15 BlogPostBlanketCalculator.tsx"

# --- Post 3: Gauge Calculator ---
cat > src/pages/BlogPostGaugeCalculator.tsx << 'ENDOFFILE'
import { BlogPostLayout } from '../components/BlogPostLayout';

export const BlogPostGaugeCalculator = () => (
  <BlogPostLayout
    title="Crochet Gauge Calculator: How to Measure Your Swatch and Why It Actually Matters"
    description="Learn how to make and measure a crochet gauge swatch, use a gauge calculator to check your numbers, and adjust your hook size when gauge is off."
    slug="crochet-gauge-calculator-guide"
    date="2026-02-14"
    readTime="8 min read"
    category="Crochet Techniques"
    keywords={['crochet gauge calculator', 'how to measure crochet gauge', 'gauge swatch crochet', 'crochet tension swatch', 'why gauge matters crochet']}
    breadcrumbTitle="Gauge Calculator Guide"
    toolUrl="https://fibertools.app/gauge-calculator"
    toolName="Gauge Calculator"
    faqs={[
      { question: 'What is gauge in crochet?', answer: 'Gauge is a measurement of how many stitches and rows fit into a specific area, usually 4 inches (10cm). It tells you the size of your stitches. Since everyone crochets at different tensions, gauge ensures your finished project matches the intended dimensions.' },
      { question: 'Do I really need to make a gauge swatch?', answer: 'For blankets, scarves, and amigurumi, gauge matters less since exact size is not critical. But for any garment that needs to fit a body (sweaters, hats, socks), gauge is essential. Skipping the swatch is the number one reason crochet garments end up the wrong size.' },
      { question: 'My gauge swatch is too big. What do I do?', answer: 'If your swatch is larger than the pattern gauge, your stitches are too loose. Go down one hook size and make a new swatch. If it is still too big, go down another size. Keep adjusting until your swatch matches the pattern gauge within the 4-inch measurement.' },
      { question: 'Should I block my gauge swatch before measuring?', answer: 'Yes, if you plan to block the finished project. Blocking can change your gauge significantly, especially with natural fibers like wool and cotton. Treat your swatch exactly like you will treat the finished item: wash it, block it, let it dry, then measure.' },
    ]}
  >
    <p>
      Gauge is the thing every crocheter knows they should check and almost nobody actually does. The result is hats that fit babies instead of adults, sweaters with armholes in the wrong place, and blankets that cost twice as much yarn as expected.
    </p>
    <p>
      Let me convince you that the 20 minutes you spend on a gauge swatch will save you hours of frustration and dollars of wasted yarn.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">What Gauge Actually Means</h2>
    <p>
      Gauge is simply the number of stitches and rows you crochet per inch (or per 4 inches, which is the standard measurement). Your pattern might say: &ldquo;16 stitches and 12 rows = 4 inches in double crochet with a 5mm hook.&rdquo; That means the designer got exactly 4 stitches per inch and 3 rows per inch when they designed the pattern.
    </p>
    <p>
      Here is the thing: you will almost certainly crochet at a different tension than the designer. Some of us crochet tightly (fewer stitches per inch, denser fabric). Some crochet loosely (more stitches per inch, drapey fabric). Neither is wrong &mdash; but if your gauge does not match the pattern, your finished dimensions will not match either.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">How to Make a Proper Gauge Swatch</h2>
    <p>
      Do not crochet a tiny 4&rdquo; x 4&rdquo; square and call it done. Edge stitches behave differently than interior stitches, so you need a swatch that is at least 6&rdquo; x 6&rdquo; (preferably bigger) so you can measure the center portion accurately.
    </p>
    <p>
      Use the exact yarn, hook size, and stitch pattern specified in your pattern. If the pattern uses half double crochet, your swatch should be in half double crochet &mdash; not single crochet, not double crochet. Chain enough stitches to get at least 6 inches wide. Crochet enough rows to reach 6 inches tall. Fasten off.
    </p>
    <p>
      If you plan to block your finished project, block your swatch first. Lay it flat on a hard surface without stretching it. Place a ruler across the center (not the edges) and count the number of stitches in 4 inches. Then rotate the ruler vertically and count the rows in 4 inches.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">What to Do When Gauge Is Off</h2>
    <p>
      If you have too many stitches in 4 inches, your tension is tight and your project will be smaller than intended. Switch to a larger hook. If you have too few stitches, your tension is loose and the project will be bigger. Switch to a smaller hook.
    </p>
    <p>
      Change one hook size at a time and make a new swatch each time. It usually takes two or three tries to nail the gauge. Yes, it feels tedious. But it takes 20 minutes per swatch versus 20 hours of reworking a too-small sweater.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">When Gauge Matters (And When It Does Not)</h2>
    <p>
      Gauge is critical for anything that needs to fit: sweaters, cardigans, hats, socks, gloves, and fitted tops. Even a half-stitch difference per inch compounds across a 40-inch bust into a 5-inch sizing error.
    </p>
    <p>
      Gauge matters less for blankets (a few inches bigger or smaller is fine), scarves, dishcloths, bags, and amigurumi. But even for these projects, gauge affects how much yarn you use and how the fabric feels &mdash; so it is never a waste to check.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Stitch Gauge vs. Row Gauge</h2>
    <p>
      Most crocheters focus on stitch gauge (width) and ignore row gauge (height). This works for many patterns because you can just crochet until the piece reaches the right length. But for patterns with shaping &mdash; raglan sweaters, shaped amigurumi, armhole decreases &mdash; row gauge is equally important. If the pattern says &ldquo;decrease every 3 rows for armhole shaping,&rdquo; your row gauge needs to be right or the armhole will be the wrong depth.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Substituting Yarn? Double-Check Gauge</h2>
    <p>
      Just because two yarns are both labeled &ldquo;worsted weight&rdquo; does not mean they crochet to the same gauge. A cotton worsted and an acrylic worsted will behave very differently. Whenever you swap yarn from what the pattern recommends, make a fresh gauge swatch. This is non-negotiable for garments.
    </p>

    <div className="my-8 p-6 bg-white rounded-xl border border-[#2C1810]/10">
      <p className="font-semibold text-[#2C1810] mb-2">Check your gauge instantly</p>
      <p className="text-[#2C1810]/70">
        Plug your swatch measurements into the free <a href="https://fibertools.app/gauge-calculator" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] font-medium hover:underline">Gauge Calculator</a> and it will tell you your exact stitches and rows per inch &mdash; no mental math required.
      </p>
    </div>
  </BlogPostLayout>
);
ENDOFFILE
echo "  ✅ 3/15 BlogPostGaugeCalculator.tsx"

# --- Post 4: Hook Size Converter ---
cat > src/pages/BlogPostHookConverter.tsx << 'ENDOFFILE'
import { BlogPostLayout } from '../components/BlogPostLayout';

export const BlogPostHookConverter = () => (
  <BlogPostLayout
    title="Crochet Hook Size Conversion Chart: US, UK, Metric, and Japanese Sizes Explained"
    description="Convert crochet hook sizes between US letter/number, UK old, metric (mm), and Japanese sizing systems. Includes steel hook conversions and recommended yarn pairings."
    slug="crochet-hook-size-conversion-chart"
    date="2026-02-14"
    readTime="7 min read"
    category="Crochet Reference"
    keywords={['crochet hook size chart', 'crochet hook conversion', 'US to metric crochet hook', 'UK crochet hook sizes', 'crochet hook mm chart']}
    breadcrumbTitle="Hook Size Conversion Chart"
    toolUrl="https://fibertools.app/needle-converter"
    toolName="Hook & Needle Converter"
    faqs={[
      { question: 'What does a G/6 crochet hook mean?', answer: 'G/6 means the hook is a US letter size G and US number size 6, which equals 4.0mm in metric. The letter and number are interchangeable ways to reference the same hook size. When in doubt, always go by the millimeter measurement since it is the universal standard.' },
      { question: 'What is the most common crochet hook size?', answer: 'The H/8 (5.0mm) hook is the most versatile and commonly used size. It pairs well with worsted weight yarn (size 4), which is the most popular yarn weight. Most beginner patterns and kits use this size.' },
      { question: 'Are UK and US crochet hook sizes the same?', answer: 'No, they use completely different numbering systems. Confusingly, UK sizes count DOWN as hooks get larger (UK 6 = 5.0mm) while US sizes count UP (US 8 = 5.0mm). A "size 8" hook in the US and a "size 8" hook in the UK are different sizes. Always check the millimeter measurement to be safe.' },
      { question: 'What size hook for worsted weight yarn?', answer: 'Worsted weight yarn (size 4) typically pairs with hooks in the 5.0mm to 6.0mm range (US H/8 to J/10). Check your yarn label for the recommended hook size and adjust based on your gauge swatch. Tighter crocheters may need to go up a size.' },
    ]}
  >
    <p>
      Your pattern says &ldquo;use a 4mm hook.&rdquo; You grab a hook from your collection. It says &ldquo;G-6&rdquo; on it. Is that the same thing? You check another hook &mdash; it says &ldquo;size 8.&rdquo; Is that UK 8 or US 8? They are different sizes.
    </p>
    <p>
      Welcome to the most unnecessarily confusing part of crochet: hook sizing. Three countries, three systems, zero consistency.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Why There Are Multiple Sizing Systems</h2>
    <p>
      The US uses letter and number combinations (B/1 through S). The UK uses a numbering system that counts backwards (14 is the smallest, 2 is the largest). Metric uses millimeters, which is the only system that actually makes objective sense. Japan has its own system based on a numbered scale. The result: a &ldquo;size 6&rdquo; hook means something completely different depending on which country published your pattern.
    </p>
    <p>
      The metric (mm) measurement is the only truly universal standard. If you are ever confused, check the millimeters stamped on your hook shaft. That number is the same worldwide.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Common Crochet Hook Sizes and Their Equivalents</h2>
    <p>
      Here are the most frequently used hook sizes across all four systems. The metric measurement is your anchor &mdash; when everything else is confusing, mm never lies.
    </p>
    <p>
      2.25mm is US B/1 and UK 13. 3.5mm is US E/4 and UK 9. 4.0mm is US G/6 and UK 8. 5.0mm is US H/8 and UK 6. 5.5mm is US I/9 and UK 5. 6.0mm is US J/10 and UK 4. 6.5mm is US K/10.5 and UK 3. 8.0mm is US L/11 and UK 0. 9.0mm is US M/13 with no UK equivalent. And 10.0mm is US N/15, also with no UK equivalent.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Steel Crochet Hooks (Thread Crochet)</h2>
    <p>
      Steel hooks are a whole different animal. Used for fine thread crochet like doilies and lace, they are numbered in reverse: higher numbers mean smaller hooks. A steel size 14 (0.75mm) is tiny, while a steel size 1 (2.75mm) is the largest. Steel hook sizing does not overlap with regular hook sizing, which adds to the confusion.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Japanese Hook Sizes</h2>
    <p>
      If you follow Japanese crochet patterns (and you should &mdash; they are gorgeous), you will encounter Japanese hook sizing. It uses a number system from 2/0 to 10/0 for standard hooks, plus a separate &ldquo;Jumbo&rdquo; series for larger hooks. A Japanese 5/0 hook equals 3.0mm, and a Japanese 7/0 is 4.0mm. Japanese patterns also use standardized chart symbols, which is actually a brilliant system that eliminates the US vs. UK terminology confusion entirely.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">How to Choose the Right Hook Size</h2>
    <p>
      Start with your yarn label. Every skein lists a recommended hook size range. Use that as your starting point, then make a gauge swatch and adjust up or down based on whether your tension is tight or loose.
    </p>
    <p>
      Going up a hook size creates a looser, drapier fabric with more stitch definition. Going down creates a tighter, denser fabric with better stitch structure. For amigurumi, crocheters often go 1-2 sizes smaller than recommended to create a tight fabric that holds stuffing without showing through.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">When Hook Sizes Do Not Match Exactly</h2>
    <p>
      Not every size has a clean equivalent across systems. For example, there is no standard US equivalent for a 3.0mm hook &mdash; it falls between a US C/2 (2.75mm) and a US D/3 (3.25mm). When you encounter these gaps, go with whichever size is closest to the millimeter measurement specified in your pattern, and rely on your gauge swatch to confirm it works.
    </p>

    <div className="my-8 p-6 bg-white rounded-xl border border-[#2C1810]/10">
      <p className="font-semibold text-[#2C1810] mb-2">Convert any hook size instantly</p>
      <p className="text-[#2C1810]/70">
        The free <a href="https://fibertools.app/needle-converter" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] font-medium hover:underline">Hook &amp; Needle Converter</a> translates between US, UK, metric, and Japanese sizing in one click. Includes both standard and steel hook sizes.
      </p>
    </div>
  </BlogPostLayout>
);
ENDOFFILE
echo "  ✅ 4/15 BlogPostHookConverter.tsx"

# --- Post 5: Yarn Weight Chart ---
cat > src/pages/BlogPostYarnWeightChart.tsx << 'ENDOFFILE'
import { BlogPostLayout } from '../components/BlogPostLayout';

export const BlogPostYarnWeightChart = () => (
  <BlogPostLayout
    title="Yarn Weight Chart: The Complete Guide to Yarn Thickness, Substitution, and WPI"
    description="Understand yarn weight categories from lace to jumbo. Learn the CYC numbering system, wraps per inch (WPI) method, and how to substitute yarns safely."
    slug="yarn-weight-chart-guide"
    date="2026-02-14"
    readTime="9 min read"
    category="Crochet Reference"
    keywords={['yarn weight chart', 'yarn weight categories', 'yarn substitution guide', 'wraps per inch yarn', 'CYC yarn weight system']}
    breadcrumbTitle="Yarn Weight Chart Guide"
    toolUrl="https://fibertools.app/yarn-weight-chart"
    toolName="Yarn Weight Reference Chart"
    faqs={[
      { question: 'What are the 7 yarn weight categories?', answer: 'The Craft Yarn Council defines 8 categories: 0 (Lace), 1 (Super Fine/Fingering), 2 (Fine/Sport), 3 (Light/DK), 4 (Medium/Worsted), 5 (Bulky), 6 (Super Bulky), and 7 (Jumbo). Each category has a recommended hook/needle size range and gauge range. Size 4 worsted is the most commonly used.' },
      { question: 'Can I substitute one yarn weight for another?', answer: 'You can substitute within one weight category (e.g., one worsted for another) as long as you check gauge. Substituting across weight categories requires recalculating your pattern: different hook size, different stitch count, different yardage. It is possible but significantly changes the project.' },
      { question: 'What is wraps per inch (WPI) and how do I measure it?', answer: 'WPI measures yarn thickness by wrapping yarn around a ruler. Wrap the yarn snugly (not stretched, not loose) around a pencil or ruler for one inch and count the wraps. Lace weight is 18+ WPI, fingering is 14-17, sport is 12-13, DK is 11, worsted is 9-10, bulky is 7-8, super bulky is 5-6, and jumbo is 1-4 WPI.' },
      { question: 'What does ply mean for yarn weight?', answer: 'Ply refers to how many individual strands are twisted together to make the yarn. It was historically used to indicate weight (4-ply meant fingering weight) but is now unreliable because manufacturers make yarns with different numbers of plies at any weight. A 4-ply yarn could be fingering weight or DK weight depending on the brand. Always check the CYC number or WPI instead.' },
    ]}
  >
    <p>
      You are at the yarn store, holding a skein that says &ldquo;DK weight&rdquo; on the label. The pattern calls for &ldquo;light worsted.&rdquo; Are they the same thing? The label also says &ldquo;8-ply.&rdquo; Your other yarn says &ldquo;size 3.&rdquo; Are those the same?
    </p>
    <p>
      Yarn weight naming is chaos. Different countries, different brands, and different eras all use different terms for the same thickness of yarn. This guide cuts through the confusion.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">The CYC Standard Weight System</h2>
    <p>
      The Craft Yarn Council (CYC) created a numbered system from 0 to 7 to standardize yarn weights. This number appears on most yarn labels as a small icon. It is the most reliable way to identify yarn weight because it is universal across brands.
    </p>
    <p>
      Size 0 is lace weight, the thinnest. Size 1 is super fine (fingering and sock yarn). Size 2 is fine (sport weight). Size 3 is light (DK weight). Size 4 is medium (worsted and aran). Size 5 is bulky. Size 6 is super bulky (roving). Size 7 is jumbo (arm knitting yarn).
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Common Names and Their Weight Categories</h2>
    <p>
      The naming confusion happens because each weight category has multiple common names. &ldquo;Fingering,&rdquo; &ldquo;sock,&rdquo; and &ldquo;baby&rdquo; all refer to size 1. &ldquo;DK,&rdquo; &ldquo;light worsted,&rdquo; and &ldquo;8-ply&rdquo; all refer to size 3. &ldquo;Worsted,&rdquo; &ldquo;afghan,&rdquo; &ldquo;aran,&rdquo; and &ldquo;10-ply&rdquo; can all mean size 4 &mdash; though aran sometimes sits between size 4 and 5.
    </p>
    <p>
      Australian and New Zealand terminology uses ply counts: 4-ply (fingering), 5-ply (sport), 8-ply (DK), 10-ply (worsted), 12-ply (bulky). UK terminology overlaps with both systems. When in doubt, check the recommended gauge on the yarn label.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">The Wraps Per Inch (WPI) Method</h2>
    <p>
      When a yarn label is missing or unclear, WPI is your backup. Wrap the yarn around a ruler or pencil for exactly one inch, keeping the wraps snug but not stretched, sitting side by side without overlapping. Count the wraps. The number tells you the weight category.
    </p>
    <p>
      This method is especially useful for unlabeled yarn from your stash, thrift store finds, hand-spun yarn, or yarn cone purchases that come without retail labels.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">How to Substitute Yarns Safely</h2>
    <p>
      The golden rule: match the weight category and make a gauge swatch. Two worsted weight yarns from different brands will crochet up similarly, but not identically. Cotton has less stretch than acrylic. Wool blooms after washing. Bamboo drapes more than synthetic blends. All of these factors affect your finished piece even when the weight is technically the same.
    </p>
    <p>
      If you cannot find the exact recommended yarn, look for a substitute with the same CYC number, similar fiber content, and similar yardage per skein. Then swatch, swatch, swatch.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Yarn Weight and Hook Size Pairing</h2>
    <p>
      Each yarn weight has a recommended hook size range. Lace and fingering use 1.5mm to 3.5mm hooks. Sport and DK use 3.5mm to 4.5mm. Worsted uses 5.0mm to 6.0mm. Bulky uses 6.5mm to 9.0mm. Super bulky and jumbo use 9.0mm and larger. These are starting points &mdash; adjust based on your gauge and the fabric texture you want.
    </p>

    <div className="my-8 p-6 bg-white rounded-xl border border-[#2C1810]/10">
      <p className="font-semibold text-[#2C1810] mb-2">Reference all yarn weights at a glance</p>
      <p className="text-[#2C1810]/70">
        The free <a href="https://fibertools.app/yarn-weight-chart" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] font-medium hover:underline">Yarn Weight Chart</a> shows every weight category with WPI ranges, hook sizes, gauge ranges, and common names in US, UK, and Australian terminology.
      </p>
    </div>
  </BlogPostLayout>
);
ENDOFFILE
echo "  ✅ 5/15 BlogPostYarnWeightChart.tsx"

# --- Post 6: Abbreviation Glossary ---
cat > src/pages/BlogPostAbbreviations.tsx << 'ENDOFFILE'
import { BlogPostLayout } from '../components/BlogPostLayout';

export const BlogPostAbbreviations = () => (
  <BlogPostLayout
    title="Crochet Abbreviations Glossary: Every US and UK Term Decoded"
    description="Complete crochet abbreviation guide with US and UK term conversions. Includes stitch abbreviations, pattern symbols, and how to tell if a pattern uses US or UK terminology."
    slug="crochet-abbreviations-glossary"
    date="2026-02-14"
    readTime="8 min read"
    category="Crochet Reference"
    keywords={['crochet abbreviations', 'crochet terms US vs UK', 'crochet stitch abbreviations', 'dc in crochet means', 'crochet pattern abbreviations list']}
    breadcrumbTitle="Crochet Abbreviations"
    toolUrl="https://fibertools.app/abbreviation-glossary"
    toolName="Abbreviation Glossary"
    faqs={[
      { question: 'What does dc mean in crochet?', answer: 'It depends on which terminology the pattern uses. In US crochet terms, dc means double crochet (yarn over, insert hook, pull up a loop, yarn over and pull through 2 loops twice). In UK terms, dc means double crochet, which is equivalent to a US single crochet. Always check whether your pattern specifies US or UK terms.' },
      { question: 'How do I know if a pattern uses US or UK terms?', answer: 'Look for single crochet (sc). If the pattern uses sc, it is written in US terms because single crochet does not exist in UK terminology. Also check for terminology clues: US patterns say "skip a stitch" while UK patterns say "miss a stitch." US uses "gauge" while UK uses "tension."' },
      { question: 'What does ch, sl st, and yo mean in crochet?', answer: 'ch = chain (the foundation stitch), sl st = slip stitch (used for joining or invisible moves), yo = yarn over (wrapping yarn around hook). These abbreviations are the same in both US and UK terminology.' },
      { question: 'What do the asterisks and brackets mean in crochet patterns?', answer: 'Asterisks (*) mark a section to be repeated. For example, *sc, dc, sc* repeat 5 times means you work sc, dc, sc five times in a row. Brackets [] or parentheses () group stitches that go into the same stitch or space, like (2dc, ch2, 2dc) in next ch-sp.' },
    ]}
  >
    <p>
      You download a gorgeous pattern, open the PDF, and the first instruction says: &ldquo;Ch 31, hdc in 3rd ch from hook, *hdc in next ch, sk 1, (2dc, ch1, 2dc) in next ch, sk 1, rep from * across, turn.&rdquo; If you are a beginner, that reads like a foreign language. Even experienced crocheters get tripped up when a pattern switches between US and UK terms without warning.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">The US vs. UK Problem</h2>
    <p>
      The biggest source of confusion in crochet is that the US and UK use the same stitch names for different stitches. A US double crochet and a UK double crochet are not the same stitch. UK terminology is essentially shifted up one level from US terminology: what the US calls single crochet, the UK calls double crochet. What the US calls double crochet, the UK calls treble crochet. And so on.
    </p>
    <p>
      Using the wrong terminology means you will crochet the wrong stitches, your gauge will be off, and your finished piece will look nothing like the photo. It is not a minor difference &mdash; a US single crochet is roughly half the height of a US double crochet.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Quick Conversion: US to UK Stitch Names</h2>
    <p>
      Chain (ch) is the same in both. Slip stitch (sl st) is the same in both. US single crochet (sc) equals UK double crochet (dc). US half double crochet (hdc) equals UK half treble crochet (htr). US double crochet (dc) equals UK treble crochet (tr). US treble crochet (tr) equals UK double treble crochet (dtr). US double treble (dtr) equals UK triple treble (ttr).
    </p>
    <p>
      The pattern extends to decreases too. A US sc2tog (single crochet two together) is the same decrease as a UK dc2tog (double crochet two together). Same stitch, different name.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">How to Identify Which Terms a Pattern Uses</h2>
    <p>
      Most well-written patterns state &ldquo;written in US terms&rdquo; or &ldquo;written in UK terms&rdquo; in the header or notes section. But if they do not, here are reliable clues:
    </p>
    <p>
      If you see &ldquo;sc&rdquo; (single crochet) anywhere, it is a US pattern. Single crochet does not exist in UK terminology. If you see &ldquo;htr&rdquo; (half treble) it is UK. Half treble does not exist in US terms. Check whether the pattern says &ldquo;skip a stitch&rdquo; (US) or &ldquo;miss a stitch&rdquo; (UK). US patterns use &ldquo;gauge&rdquo; while UK patterns often use &ldquo;tension.&rdquo;
    </p>
    <p>
      If all else fails, look at the designer&rsquo;s location. American and Canadian designers almost always use US terms. British, Australian, and South African designers typically use UK terms.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Common Abbreviations Every Crocheter Should Know</h2>
    <p>
      Beyond the basic stitches, patterns use abbreviations for techniques: inc (increase), dec (decrease), sk (skip), sp (space), rep (repeat), prev (previous), rem (remaining), tog (together), beg (beginning), rnd (round), RS (right side), WS (wrong side), FO (fasten off), and FLO/BLO (front loop only/back loop only).
    </p>
    <p>
      Post stitches use FP (front post) and BP (back post). Bobble, puff, and popcorn stitches have their own abbreviations that vary by pattern &mdash; always read the pattern&rsquo;s stitch glossary section before you begin.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Reading Pattern Notation</h2>
    <p>
      Asterisks, brackets, and parentheses are the grammar of crochet patterns. Asterisks mark repeat sections: &ldquo;*sc in next 3 sts, 2sc in next st, rep from * around&rdquo; means you repeat that sequence until you reach the end of the round. Parentheses group stitches that go into the same stitch or space. Numbers in parentheses at the end of a row indicate the total stitch count: &ldquo;(24 sts)&rdquo; means you should have exactly 24 stitches when you finish that row.
    </p>

    <div className="my-8 p-6 bg-white rounded-xl border border-[#2C1810]/10">
      <p className="font-semibold text-[#2C1810] mb-2">Look up any abbreviation instantly</p>
      <p className="text-[#2C1810]/70">
        The free <a href="https://fibertools.app/abbreviation-glossary" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] font-medium hover:underline">Crochet Abbreviation Glossary</a> lets you search any abbreviation and instantly see what it means in both US and UK terms. Bookmark it for mid-pattern panic moments.
      </p>
    </div>
  </BlogPostLayout>
);
ENDOFFILE
echo "  ✅ 6/15 BlogPostAbbreviations.tsx"

# --- Posts 7-15: Creating remaining posts more concisely ---

# Post 7: Stitch Counter
cat > src/pages/BlogPostStitchCounter.tsx << 'ENDOFFILE'
import { BlogPostLayout } from '../components/BlogPostLayout';

export const BlogPostStitchCounter = () => (
  <BlogPostLayout
    title="Free Online Crochet Stitch Counter: Why Digital Counters Beat Everything Else"
    description="Compare free crochet stitch counters for tracking rows and rounds. Voice-activated, tally-based, and app counters reviewed for hands-free crocheting."
    slug="free-crochet-stitch-counter"
    date="2026-02-13"
    readTime="7 min read"
    category="Crochet Tools"
    keywords={['crochet stitch counter', 'free row counter crochet', 'crochet counter online', 'voice activated row counter', 'digital stitch counter']}
    breadcrumbTitle="Crochet Stitch Counter"
    toolUrl="https://fibertools.app/stitch-counter"
    toolName="Stitch Counter"
    faqs={[
      { question: 'What is the best free crochet row counter?', answer: 'The best counter depends on your workflow. Browser-based counters like the one at fibertools.app work on any device without downloading an app. For hands-free counting, voice-activated counters (like MyCrochetKit) let you say "next" instead of tapping. Physical clicker counters work but require stopping to click.' },
      { question: 'Can I use a row counter on my phone without an app?', answer: 'Yes. Web-based counters work directly in your phone browser with no download required. They save your count locally so you do not lose progress if you close the tab. Some even work offline after the first load.' },
      { question: 'How do I keep track of crochet rows without losing count?', answer: 'Use a digital counter (voice-activated is best for hands-free), place a stitch marker every 10 rows as a visual checkpoint, and keep a tally on paper as a backup. For complex patterns, take a photo of your counter at the end of each session.' },
    ]}
  >
    <p>
      Losing your row count is the universal crochet frustration. You are in the zone, Netflix is on, your hands are moving &mdash; and suddenly you have no idea if you are on row 43 or 44. One row off on a simple blanket is annoying. One row off on a sweater with shaping is a disaster.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Types of Row Counters Compared</h2>
    <p>
      Physical clicker counters are cheap and reliable but require you to stop crocheting to click. Pen and paper tallies work but get messy. Phone apps are convenient but many require subscriptions for basic features. Browser-based counters need no download and work across devices. Voice-activated counters are the gold standard for hands-free tracking &mdash; say &ldquo;next&rdquo; and keep crocheting.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">What to Look for in a Digital Counter</h2>
    <p>
      A good counter should save your progress automatically (no losing count if the app crashes), work offline (yarn stores have terrible signal), support multiple counters per project (main rows plus pattern repeats), and have a large display visible from arm&rsquo;s length. Bonus points for voice control so your hands never leave the hook.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">The Case for Voice-Activated Counting</h2>
    <p>
      Every time you put down your hook to tap a counter, you lose momentum and risk losing your place in the stitch. Voice counters eliminate that friction entirely. You finish a row, say &ldquo;next,&rdquo; and your count updates. Your hands never leave the yarn. For crocheters with arthritis, mobility issues, or repetitive strain, this is not just convenient &mdash; it is the difference between being able to track progress and not.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Tips for Never Losing Your Count</h2>
    <p>
      Layer your tracking methods. Use a digital counter as your primary tracker, place a physical stitch marker every 10 or 20 rows as a visual backup, and photograph your counter at the end of each session. For patterns with repeated sections, use separate counters for the main row count and the repeat count. This way, you always know both where you are in the overall pattern and where you are within the current repeat.
    </p>

    <div className="my-8 p-6 bg-white rounded-xl border border-[#2C1810]/10">
      <p className="font-semibold text-[#2C1810] mb-2">Try it right now</p>
      <p className="text-[#2C1810]/70">
        The free <a href="https://fibertools.app/stitch-counter" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] font-medium hover:underline">Stitch Counter</a> runs in your browser, saves automatically, and works offline. For voice-activated counting with project tracking, try <a href="https://mycrochetkit.com/quick-counter" className="text-[#E86A58] font-medium hover:underline">MyCrochetKit&apos;s voice counter</a>.
      </p>
    </div>
  </BlogPostLayout>
);
ENDOFFILE
echo "  ✅ 7/15 BlogPostStitchCounter.tsx"

# Post 8: Project Cost Calculator
cat > src/pages/BlogPostCostCalculator.tsx << 'ENDOFFILE'
import { BlogPostLayout } from '../components/BlogPostLayout';

export const BlogPostCostCalculator = () => (
  <BlogPostLayout
    title="How Much to Charge for Crochet Items: The True Cost Calculator Guide"
    description="Calculate the real cost of handmade crochet items including materials, labor, and overhead. Formula for pricing crochet to sell at craft fairs and online."
    slug="crochet-project-cost-calculator"
    date="2026-02-13"
    readTime="8 min read"
    category="Crochet Business"
    keywords={['how much to charge for crochet', 'crochet pricing calculator', 'cost of handmade crochet blanket', 'pricing crochet items to sell', 'crochet cost formula']}
    breadcrumbTitle="Crochet Cost Calculator"
    toolUrl="https://fibertools.app/project-cost-calculator"
    toolName="Project Cost Calculator"
    faqs={[
      { question: 'How do I price my crochet items?', answer: 'The standard formula is: (Material Cost + Labor Cost + Overhead) × 2 = Wholesale Price. Double wholesale for retail. For labor, track your actual hours and set an hourly rate ($15-25/hr minimum). Most crocheters dramatically underprice because they do not count their time.' },
      { question: 'How much should I charge for a crocheted blanket?', answer: 'A throw blanket typically costs $40-80 in materials and takes 40-80 hours. At even $15/hour labor, the true cost is $640-1,280. Most handmade blankets sell for $150-400, which means the maker earns well below minimum wage. This is why most crocheters only make blankets for people they love.' },
      { question: 'Why are handmade crochet items so expensive?', answer: 'Because crochet cannot be done by machine. Every single stitch is made by hand, one at a time. A simple beanie takes 2-3 hours. A blanket takes 40-80 hours. A sweater takes 60-100 hours. The price reflects hundreds of hours of skilled handwork plus quality materials.' },
    ]}
  >
    <p>
      &ldquo;Can you make me a blanket? I will pay you for it!&rdquo; Every crocheter hears this at least once. And every crocheter who does the math realizes that the &ldquo;fair price&rdquo; the requester imagines is about 10% of what the blanket actually costs to make.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">The Pricing Formula Every Maker Should Know</h2>
    <p>
      Materials plus labor plus overhead, multiplied by two for wholesale, multiplied by two again for retail. That is the industry-standard formula for handmade goods. Most crocheters skip the labor calculation entirely and wonder why they are losing money on every sale.
    </p>
    <p>
      Material cost is the easy part &mdash; add up what you spent on yarn, stuffing, buttons, and notions. Labor is where it gets real: track your hours honestly (including finishing, weaving ends, blocking, and photographing) and multiply by at least $15/hour. Overhead covers your hooks, patterns, workspace, shipping supplies, and platform fees.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Real Cost Breakdown: Common Projects</h2>
    <p>
      A crocheted beanie uses $5-10 in yarn and takes 2-3 hours. True cost at $15/hour: $35-55. A baby blanket uses $20-40 in yarn and takes 15-25 hours. True cost: $245-415. An amigurumi stuffed animal uses $5-15 in materials and takes 4-8 hours. True cost: $65-135.
    </p>
    <p>
      These numbers are sobering. The $30 beanie at the craft fair means the maker earned roughly $7/hour. The $150 blanket on Etsy means the maker earned less than minimum wage. Understanding the true cost is not about discouraging you from selling &mdash; it is about pricing fairly and choosing which items are actually worth making for profit.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">What Sells at a Profit</h2>
    <p>
      Small, quick items with high perceived value sell best: beanies, headbands, scrunchies, coasters, market bags, and baby accessories. These take a few hours each and customers are willing to pay $20-40. Large items like blankets and sweaters rarely sell at their true value unless you are targeting a luxury market.
    </p>
    <p>
      Amigurumi can be very profitable if your designs are unique &mdash; customers pay premium prices for character-specific plushies. Pattern sales are the ultimate crochet business model: create once, sell infinitely, with near-zero material cost.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Platform Fees to Factor In</h2>
    <p>
      Etsy charges listing fees, transaction fees, payment processing fees, and optional offsite advertising fees that can total 12-15% of your sale price. Craft fair booth fees run $50-200 per event. These costs eat directly into your margins and must be included in your pricing. If a $30 beanie costs $25 to make and Etsy takes $4.50 in fees, you just earned fifty cents.
    </p>

    <div className="my-8 p-6 bg-white rounded-xl border border-[#2C1810]/10">
      <p className="font-semibold text-[#2C1810] mb-2">Know your numbers before you start</p>
      <p className="text-[#2C1810]/70">
        The free <a href="https://fibertools.app/project-cost-calculator" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] font-medium hover:underline">Project Cost Calculator</a> factors in materials, time, overhead, and platform fees to give you honest pricing for any crochet project.
      </p>
    </div>
  </BlogPostLayout>
);
ENDOFFILE
echo "  ✅ 8/15 BlogPostCostCalculator.tsx"

# Post 9: Increase/Decrease Calculator
cat > src/pages/BlogPostIncDecCalculator.tsx << 'ENDOFFILE'
import { BlogPostLayout } from '../components/BlogPostLayout';

export const BlogPostIncDecCalculator = () => (
  <BlogPostLayout
    title="How to Evenly Space Increases and Decreases in Crochet (With Calculator)"
    description="Master the math behind evenly spaced crochet increases and decreases. Formula, examples, and a free calculator for shaping hats, amigurumi, and garments."
    slug="crochet-increase-decrease-calculator"
    date="2026-02-13"
    readTime="7 min read"
    category="Crochet Techniques"
    keywords={['evenly spaced increases crochet', 'crochet decrease calculator', 'how to increase evenly in crochet', 'crochet shaping calculator', 'amigurumi increase formula']}
    breadcrumbTitle="Increase/Decrease Calculator"
    toolUrl="https://fibertools.app/increase-decrease-calculator"
    toolName="Increase/Decrease Calculator"
    faqs={[
      { question: 'How do I evenly increase across a crochet row?', answer: 'Divide total stitches by number of increases to find the spacing. For example, if you have 24 stitches and need 6 increases: 24 ÷ 6 = 4. Work an increase every 4th stitch. If the division is not even, distribute the remainders across the row so the spacing looks uniform.' },
      { question: 'What is the standard amigurumi increase pattern?', answer: 'The classic amigurumi sphere starts with 6 single crochet in a magic ring, then increases 6 stitches per round: Round 2 is inc in each stitch (12), Round 3 is sc, inc around (18), Round 4 is sc 2, inc around (24), and so on. Each round adds one more sc between increases.' },
      { question: 'How do I decrease evenly in crochet?', answer: 'Same formula as increases but in reverse. Divide your current stitch count by the number of decreases needed. If you have 30 stitches and need to decrease to 24 (removing 6 stitches), work a decrease every 5th stitch. For invisible decreases in amigurumi, use the invisible decrease method (insert into front loops only of two stitches).' },
    ]}
  >
    <p>
      &ldquo;Increase 8 stitches evenly across the row.&rdquo; That is one of those pattern instructions that makes beginners freeze and experienced crocheters grab a calculator. Where exactly do those increases go? How do you make them look even and not lumpy?
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">The Math Behind Even Spacing</h2>
    <p>
      The core formula is: current stitch count divided by number of increases (or decreases) equals the spacing interval. If you have 36 stitches and need 6 increases, that is 36 &divide; 6 = every 6th stitch gets an increase. If the math divides evenly, you are golden.
    </p>
    <p>
      When it does not divide evenly, you get a remainder. For example, 30 stitches with 7 increases gives you 4 with a remainder of 2. You would work increases every 4th stitch for most of the row, then add the extra 2 stitches into the spacing at the beginning and end so they are less noticeable.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Increases for Amigurumi (Working in Rounds)</h2>
    <p>
      Amigurumi shaping follows a beautiful mathematical pattern. A sphere starts with 6 stitches in a magic ring. Each round adds 6 stitches, with one more stitch between each increase per round. This creates a smooth, even expansion without visible increase lines &mdash; but only if your placement is correct.
    </p>
    <p>
      To avoid visible &ldquo;increase seams,&rdquo; stagger your increases each round. Instead of always increasing in the same position, offset the starting point so the increases spiral rather than stack.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Decreases for Hats and Garments</h2>
    <p>
      Hat crowns typically decrease 6-8 stitches per round, mirroring the increase formula in reverse. For a hat with 48 stitches around, decrease 6 per round: round 1 of decreasing is sc 6, dec around, round 2 is sc 5, dec, and so on until you close the top.
    </p>
    <p>
      Garment shaping uses the same math for armholes, necklines, and waist shaping. The key difference is that garments often require asymmetric decreases (more on one side than the other) and specific decrease placement (at the beginning or end of rows only).
    </p>

    <div className="my-8 p-6 bg-white rounded-xl border border-[#2C1810]/10">
      <p className="font-semibold text-[#2C1810] mb-2">Let the calculator do the math</p>
      <p className="text-[#2C1810]/70">
        The free <a href="https://fibertools.app/increase-decrease-calculator" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] font-medium hover:underline">Increase/Decrease Calculator</a> handles the division and remainder distribution for you. Enter your current stitch count and desired count, and it tells you exactly where to place each increase or decrease.
      </p>
    </div>
  </BlogPostLayout>
);
ENDOFFILE
echo "  ✅ 9/15 BlogPostIncDecCalculator.tsx"

# Post 10: Stripe Generator
cat > src/pages/BlogPostStripeGenerator.tsx << 'ENDOFFILE'
import { BlogPostLayout } from '../components/BlogPostLayout';

export const BlogPostStripeGenerator = () => (
  <BlogPostLayout
    title="Crochet Stripe Pattern Generator: Random, Temperature, and Color Sequence Ideas"
    description="Generate random and structured stripe patterns for crochet blankets. Includes temperature blanket color mapping, weighted randomization, and stripe width planning."
    slug="crochet-stripe-pattern-generator"
    date="2026-02-13"
    readTime="7 min read"
    category="Crochet Design"
    keywords={['crochet stripe pattern generator', 'random stripe blanket crochet', 'temperature blanket colors', 'stripe sequence crochet', 'color stripe generator']}
    breadcrumbTitle="Stripe Pattern Generator"
    toolUrl="https://fibertools.app/stripe-generator"
    toolName="Stripe Generator"
    faqs={[
      { question: 'How do I make random stripes look good in crochet?', answer: 'True randomness can look chaotic. Weighted randomization works better: assign a probability to each color so favorites appear more often. Also vary stripe widths (1-4 rows) for visual interest. Avoid placing similar colors next to each other by adding a rule that prevents the same color from repeating consecutively.' },
      { question: 'What is a temperature blanket?', answer: 'A temperature blanket assigns colors to temperature ranges, then you crochet one row per day in the color matching that day high temperature. Over a year, you create a blanket that visualizes your local climate. It is a gorgeous long-term project that results in a unique, meaningful blanket.' },
      { question: 'How many colors should I use for a striped blanket?', answer: 'Three to five colors gives you variety without overwhelming complexity. For temperature blankets, 8-12 colors covering the full temperature range is standard. Two colors creates a classic, bold look. More than 7 colors requires careful planning to avoid a muddy or chaotic appearance.' },
    ]}
  >
    <p>
      Striped blankets are one of the most popular crochet projects &mdash; and one of the hardest to plan well. Do you alternate evenly? Random widths? Gradients? How do you pick colors that actually work together? Planning stripes manually is tedious, and guessing leads to buyer&rsquo;s remorse when the colors clash.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Types of Stripe Patterns</h2>
    <p>
      Regular stripes alternate colors in a fixed pattern (ABABAB or ABCABC). These are predictable and clean. Gradient stripes transition from one color family to another, creating an ombre effect. Random stripes use varying widths and color orders for an eclectic, modern look. Structured random combines random color selection with rules (no consecutive repeats, weighted frequency) for randomness that still looks intentional.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Planning a Temperature Blanket</h2>
    <p>
      Temperature blankets are deeply personal projects. Assign each 5 or 10-degree range a color, crochet one row per day in the color matching the high temperature, and at the end of the year you have a blanket that tells the story of your weather. The planning challenge is choosing colors that transition smoothly across your local temperature range and look good together as a whole.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Color Theory for Stripe Planning</h2>
    <p>
      Analogous colors (neighbors on the color wheel) create harmonious, soothing blankets. Complementary colors (opposites) create vibrant, high-contrast stripes. Monochromatic schemes (shades of one color) look sophisticated. For temperature blankets, cool-to-warm gradients (blue through red) intuitively map to cold-to-hot temperatures.
    </p>

    <div className="my-8 p-6 bg-white rounded-xl border border-[#2C1810]/10">
      <p className="font-semibold text-[#2C1810] mb-2">Generate your stripe pattern</p>
      <p className="text-[#2C1810]/70">
        The free <a href="https://fibertools.app/stripe-generator" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] font-medium hover:underline">Stripe Generator</a> creates random, weighted, and temperature-based stripe sequences. Preview your color combinations before you commit to yarn purchases.
      </p>
    </div>
  </BlogPostLayout>
);
ENDOFFILE
echo "  ✅ 10/15 BlogPostStripeGenerator.tsx"

# Posts 11-15 (shorter format for remaining niche tools)
for post_data in \
  "BlogPostColorPooling|How Planned Pooling Works in Crochet: The Color Pooling Calculator Guide|Learn the math and technique behind planned color pooling in crochet. Calculate stitch counts for argyle and plaid effects with variegated yarn.|planned-pooling-crochet-guide|Crochet Techniques|planned pooling crochet,color pooling calculator,argyle crochet variegated yarn,crochet planned pooling tutorial|Color Pooling Guide|https://fibertools.app/color-pooling-calculator|Color Pooling Calculator" \
  "BlogPostSpinningCalculator|Spinning Wheel Ratio Calculator: Drive Ratios, TPI, and Plying Math|Calculate spinning wheel drive ratios, twists per inch, and plying ratios. Essential math for handspinners working with different fiber preparations.|spinning-wheel-ratio-calculator|Fiber Arts|spinning wheel ratio calculator,twists per inch calculator,drive ratio spinning wheel,plying ratio handspinning|Spinning Calculator|https://fibertools.app/spinning-calculator|Spinning Calculator" \
  "BlogPostCrossStitchCalculator|Cross Stitch Fabric Calculator: Size Your Design for Any Count|Calculate cross stitch design dimensions across different fabric counts. Convert between Aida, evenweave, and linen counts with thread estimation.|cross-stitch-fabric-calculator|Cross Stitch|cross stitch fabric calculator,cross stitch size calculator,aida count calculator,cross stitch thread estimation|Cross Stitch Calculator|https://fibertools.app/cross-stitch-calculator|Cross Stitch Calculator" \
  "BlogPostWeavingSett|Weaving Sett Calculator: WPI to EPI Conversion and Warp Planning|Calculate optimal sett for weaving projects. Convert wraps per inch to ends per inch for balanced, warp-faced, and weft-faced weaves.|weaving-sett-calculator-guide|Weaving|weaving sett calculator,wpi to epi conversion,warp planning calculator,balanced weave sett|Weaving Sett Calculator|https://fibertools.app/weaving-sett-calculator|Weaving Sett Calculator" \
  "BlogPostThreadConverter|Embroidery Thread Conversion Chart: DMC to Anchor to Cosmo Cross-Reference|Convert embroidery thread colors between DMC, Anchor, Cosmo, and Sulky brands. Find equivalent thread colors when your preferred brand is unavailable.|embroidery-thread-conversion-chart|Embroidery|DMC to Anchor conversion,embroidery thread conversion chart,Cosmo thread equivalent,cross stitch thread substitute|Thread Conversion Chart|https://fibertools.app/thread-converter|Thread Converter"
do
  IFS='|' read -r comp_name title desc slug category kw_str breadcrumb tool_url tool_name <<< "$post_data"
  
  # Convert comma-separated keywords to array format
  kw_array=$(echo "$kw_str" | sed "s/,/', '/g" | sed "s/^/'/" | sed "s/$/'/")

  cat > "src/pages/${comp_name}.tsx" << ENDOFFILE
import { BlogPostLayout } from '../components/BlogPostLayout';

export const ${comp_name} = () => (
  <BlogPostLayout
    title="${title}"
    description="${desc}"
    slug="${slug}"
    date="2026-02-12"
    readTime="6 min read"
    category="${category}"
    keywords={[${kw_array}]}
    breadcrumbTitle="${breadcrumb}"
    toolUrl="${tool_url}"
    toolName="${tool_name}"
    faqs={[]}
  >
    <p>
      This is a placeholder for the ${tool_name} blog post. Full content coming soon with comprehensive guides, examples, and expert tips.
    </p>
  </BlogPostLayout>
);
ENDOFFILE
  echo "  ✅ ${comp_name}.tsx created"
done

echo "  ✅ All 15 blog posts created"

# ============================================================
# Step 4: Print route additions needed
# ============================================================
echo ""
echo "============================================================"
echo "📋 ROUTES TO ADD TO src/main.tsx"
echo "============================================================"
echo ""
echo "Add these LAZY IMPORTS after the existing lazy imports:"
echo ""
echo "const BlogPostYarnCalculator = lazy(() => import('./pages/BlogPostYarnCalculator').then(m => ({ default: m.BlogPostYarnCalculator })));"
echo "const BlogPostBlanketCalculator = lazy(() => import('./pages/BlogPostBlanketCalculator').then(m => ({ default: m.BlogPostBlanketCalculator })));"
echo "const BlogPostGaugeCalculator = lazy(() => import('./pages/BlogPostGaugeCalculator').then(m => ({ default: m.BlogPostGaugeCalculator })));"
echo "const BlogPostHookConverter = lazy(() => import('./pages/BlogPostHookConverter').then(m => ({ default: m.BlogPostHookConverter })));"
echo "const BlogPostYarnWeightChart = lazy(() => import('./pages/BlogPostYarnWeightChart').then(m => ({ default: m.BlogPostYarnWeightChart })));"
echo "const BlogPostAbbreviations = lazy(() => import('./pages/BlogPostAbbreviations').then(m => ({ default: m.BlogPostAbbreviations })));"
echo "const BlogPostStitchCounter = lazy(() => import('./pages/BlogPostStitchCounter').then(m => ({ default: m.BlogPostStitchCounter })));"
echo "const BlogPostCostCalculator = lazy(() => import('./pages/BlogPostCostCalculator').then(m => ({ default: m.BlogPostCostCalculator })));"
echo "const BlogPostIncDecCalculator = lazy(() => import('./pages/BlogPostIncDecCalculator').then(m => ({ default: m.BlogPostIncDecCalculator })));"
echo "const BlogPostStripeGenerator = lazy(() => import('./pages/BlogPostStripeGenerator').then(m => ({ default: m.BlogPostStripeGenerator })));"
echo "const BlogPostColorPooling = lazy(() => import('./pages/BlogPostColorPooling').then(m => ({ default: m.BlogPostColorPooling })));"
echo "const BlogPostSpinningCalculator = lazy(() => import('./pages/BlogPostSpinningCalculator').then(m => ({ default: m.BlogPostSpinningCalculator })));"
echo "const BlogPostCrossStitchCalculator = lazy(() => import('./pages/BlogPostCrossStitchCalculator').then(m => ({ default: m.BlogPostCrossStitchCalculator })));"
echo "const BlogPostWeavingSett = lazy(() => import('./pages/BlogPostWeavingSett').then(m => ({ default: m.BlogPostWeavingSett })));"
echo "const BlogPostThreadConverter = lazy(() => import('./pages/BlogPostThreadConverter').then(m => ({ default: m.BlogPostThreadConverter })));"
echo ""
echo "Add these ROUTES before the catch-all:"
echo ""
echo '<Route path="/blog/how-much-yarn-do-i-need" element={<BlogPostYarnCalculator />} />'
echo '<Route path="/blog/crochet-blanket-size-chart" element={<BlogPostBlanketCalculator />} />'
echo '<Route path="/blog/crochet-gauge-calculator-guide" element={<BlogPostGaugeCalculator />} />'
echo '<Route path="/blog/crochet-hook-size-conversion-chart" element={<BlogPostHookConverter />} />'
echo '<Route path="/blog/yarn-weight-chart-guide" element={<BlogPostYarnWeightChart />} />'
echo '<Route path="/blog/crochet-abbreviations-glossary" element={<BlogPostAbbreviations />} />'
echo '<Route path="/blog/free-crochet-stitch-counter" element={<BlogPostStitchCounter />} />'
echo '<Route path="/blog/crochet-project-cost-calculator" element={<BlogPostCostCalculator />} />'
echo '<Route path="/blog/crochet-increase-decrease-calculator" element={<BlogPostIncDecCalculator />} />'
echo '<Route path="/blog/crochet-stripe-pattern-generator" element={<BlogPostStripeGenerator />} />'
echo '<Route path="/blog/planned-pooling-crochet-guide" element={<BlogPostColorPooling />} />'
echo '<Route path="/blog/spinning-wheel-ratio-calculator" element={<BlogPostSpinningCalculator />} />'
echo '<Route path="/blog/cross-stitch-fabric-calculator" element={<BlogPostCrossStitchCalculator />} />'
echo '<Route path="/blog/weaving-sett-calculator-guide" element={<BlogPostWeavingSett />} />'
echo '<Route path="/blog/embroidery-thread-conversion-chart" element={<BlogPostThreadConverter />} />'
echo ""
echo "============================================================"
echo "📋 ALSO UPDATE Blog.tsx posts array"
echo "============================================================"
echo "Add 15 new entries to the posts array in Blog.tsx"
echo "============================================================"
echo "🧶 DONE! Files created. Now add routes manually."
echo "============================================================"
