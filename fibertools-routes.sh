#!/bin/bash
set -e
echo "🔧 Updating routes and blog index..."

# ============================================================
# Step 1: Remove old FiberTools markdown routes from main.tsx
# ============================================================
echo "🧹 Removing old /blog/tools routes..."
sed -i '/FiberToolsBlogPost/d' src/main.tsx
sed -i '/FiberToolsBlogIndex/d' src/main.tsx
sed -i '/blog\/tools/d' src/main.tsx

# ============================================================
# Step 2: Add new lazy imports to main.tsx
# ============================================================
echo "📦 Adding lazy imports to main.tsx..."

# Insert after the last existing lazy import (NotFound)
sed -i '/^const NotFound/a\
const BlogPostYarnCalculator = lazy(() => import('\''./pages/BlogPostYarnCalculator'\'').then(m => ({ default: m.BlogPostYarnCalculator })));\
const BlogPostBlanketCalculator = lazy(() => import('\''./pages/BlogPostBlanketCalculator'\'').then(m => ({ default: m.BlogPostBlanketCalculator })));\
const BlogPostGaugeCalculator = lazy(() => import('\''./pages/BlogPostGaugeCalculator'\'').then(m => ({ default: m.BlogPostGaugeCalculator })));\
const BlogPostHookConverter = lazy(() => import('\''./pages/BlogPostHookConverter'\'').then(m => ({ default: m.BlogPostHookConverter })));\
const BlogPostYarnWeightChart = lazy(() => import('\''./pages/BlogPostYarnWeightChart'\'').then(m => ({ default: m.BlogPostYarnWeightChart })));\
const BlogPostAbbreviations = lazy(() => import('\''./pages/BlogPostAbbreviations'\'').then(m => ({ default: m.BlogPostAbbreviations })));\
const BlogPostStitchCounter = lazy(() => import('\''./pages/BlogPostStitchCounter'\'').then(m => ({ default: m.BlogPostStitchCounter })));\
const BlogPostCostCalculator = lazy(() => import('\''./pages/BlogPostCostCalculator'\'').then(m => ({ default: m.BlogPostCostCalculator })));\
const BlogPostIncDecCalculator = lazy(() => import('\''./pages/BlogPostIncDecCalculator'\'').then(m => ({ default: m.BlogPostIncDecCalculator })));\
const BlogPostStripeGenerator = lazy(() => import('\''./pages/BlogPostStripeGenerator'\'').then(m => ({ default: m.BlogPostStripeGenerator })));\
const BlogPostColorPooling = lazy(() => import('\''./pages/BlogPostColorPooling'\'').then(m => ({ default: m.BlogPostColorPooling })));\
const BlogPostSpinningCalculator = lazy(() => import('\''./pages/BlogPostSpinningCalculator'\'').then(m => ({ default: m.BlogPostSpinningCalculator })));\
const BlogPostCrossStitchCalculator = lazy(() => import('\''./pages/BlogPostCrossStitchCalculator'\'').then(m => ({ default: m.BlogPostCrossStitchCalculator })));\
const BlogPostWeavingSett = lazy(() => import('\''./pages/BlogPostWeavingSett'\'').then(m => ({ default: m.BlogPostWeavingSett })));\
const BlogPostThreadConverter = lazy(() => import('\''./pages/BlogPostThreadConverter'\'').then(m => ({ default: m.BlogPostThreadConverter })));' src/main.tsx

# ============================================================
# Step 3: Add routes to main.tsx (before the catch-all * route)
# ============================================================
echo "🛤️  Adding routes to main.tsx..."

sed -i '/<Route path="\*"/i\
              <Route path="/blog/how-much-yarn-do-i-need" element={<BlogPostYarnCalculator />} />\
              <Route path="/blog/crochet-blanket-size-chart" element={<BlogPostBlanketCalculator />} />\
              <Route path="/blog/crochet-gauge-calculator-guide" element={<BlogPostGaugeCalculator />} />\
              <Route path="/blog/crochet-hook-size-conversion-chart" element={<BlogPostHookConverter />} />\
              <Route path="/blog/yarn-weight-chart-guide" element={<BlogPostYarnWeightChart />} />\
              <Route path="/blog/crochet-abbreviations-glossary" element={<BlogPostAbbreviations />} />\
              <Route path="/blog/free-crochet-stitch-counter" element={<BlogPostStitchCounter />} />\
              <Route path="/blog/crochet-project-cost-calculator" element={<BlogPostCostCalculator />} />\
              <Route path="/blog/crochet-increase-decrease-calculator" element={<BlogPostIncDecCalculator />} />\
              <Route path="/blog/crochet-stripe-pattern-generator" element={<BlogPostStripeGenerator />} />\
              <Route path="/blog/planned-pooling-crochet-guide" element={<BlogPostColorPooling />} />\
              <Route path="/blog/spinning-wheel-ratio-calculator" element={<BlogPostSpinningCalculator />} />\
              <Route path="/blog/cross-stitch-fabric-calculator" element={<BlogPostCrossStitchCalculator />} />\
              <Route path="/blog/weaving-sett-calculator-guide" element={<BlogPostWeavingSett />} />\
              <Route path="/blog/embroidery-thread-conversion-chart" element={<BlogPostThreadConverter />} />' src/main.tsx

# ============================================================
# Step 4: Update Blog.tsx with new posts
# ============================================================
echo "📝 Updating Blog.tsx with 15 new posts..."

# Find the opening of the posts array and add new entries at the beginning
sed -i '/const posts = \[/a\
    {\
      slug: '\''how-much-yarn-do-i-need'\'',\
      title: '\''How Much Yarn Do I Need? The Complete Yardage Guide'\'',\
      excerpt: '\''Calculate exactly how much yarn you need for any project. Yardage charts for blankets, scarves, sweaters, hats, and amigurumi by yarn weight.'\'',\
      date: '\''2026-02-14'\'',\
      readTime: '\''10 min read'\'',\
      category: '\''Crochet Guides'\'',\
    },\
    {\
      slug: '\''crochet-blanket-size-chart'\'',\
      title: '\''Crochet Blanket Size Chart: Dimensions and Starting Chains'\'',\
      excerpt: '\''Every standard blanket size from baby to king with starting chain counts, row estimates, and yarn requirements by weight.'\'',\
      date: '\''2026-02-14'\'',\
      readTime: '\''9 min read'\'',\
      category: '\''Crochet Guides'\'',\
    },\
    {\
      slug: '\''crochet-gauge-calculator-guide'\'',\
      title: '\''Crochet Gauge Calculator: Measure Your Swatch Right'\'',\
      excerpt: '\''Why gauge matters, how to make a proper swatch, and what to do when your numbers do not match the pattern.'\'',\
      date: '\''2026-02-14'\'',\
      readTime: '\''8 min read'\'',\
      category: '\''Crochet Techniques'\'',\
    },\
    {\
      slug: '\''crochet-hook-size-conversion-chart'\'',\
      title: '\''Crochet Hook Size Conversion: US, UK, Metric, Japanese'\'',\
      excerpt: '\''Convert hook sizes between all four major systems. Includes steel hooks, recommended yarn pairings, and common size confusion fixes.'\'',\
      date: '\''2026-02-14'\'',\
      readTime: '\''7 min read'\'',\
      category: '\''Crochet Reference'\'',\
    },\
    {\
      slug: '\''yarn-weight-chart-guide'\'',\
      title: '\''Yarn Weight Chart: Thickness, Substitution, and WPI Guide'\'',\
      excerpt: '\''Understand yarn weight categories from lace to jumbo. CYC numbering, wraps per inch method, and how to substitute yarns safely.'\'',\
      date: '\''2026-02-14'\'',\
      readTime: '\''9 min read'\'',\
      category: '\''Crochet Reference'\'',\
    },\
    {\
      slug: '\''crochet-abbreviations-glossary'\'',\
      title: '\''Crochet Abbreviations: Every US and UK Term Decoded'\'',\
      excerpt: '\''Complete glossary of crochet abbreviations with US and UK conversions. Never mix up dc and tr again.'\'',\
      date: '\''2026-02-14'\'',\
      readTime: '\''8 min read'\'',\
      category: '\''Crochet Reference'\'',\
    },\
    {\
      slug: '\''free-crochet-stitch-counter'\'',\
      title: '\''Free Crochet Stitch Counter: Digital vs Physical Compared'\'',\
      excerpt: '\''Compare row counter options from clickers to voice-activated apps. Find the best hands-free counting method for your workflow.'\'',\
      date: '\''2026-02-13'\'',\
      readTime: '\''7 min read'\'',\
      category: '\''Crochet Tools'\'',\
    },\
    {\
      slug: '\''crochet-project-cost-calculator'\'',\
      title: '\''How Much to Charge for Crochet: The True Cost Calculator'\'',\
      excerpt: '\''The real cost of handmade crochet items including materials, labor, and overhead. Pricing formula for selling at craft fairs and online.'\'',\
      date: '\''2026-02-13'\'',\
      readTime: '\''8 min read'\'',\
      category: '\''Crochet Business'\'',\
    },\
    {\
      slug: '\''crochet-increase-decrease-calculator'\'',\
      title: '\''How to Evenly Space Increases and Decreases in Crochet'\'',\
      excerpt: '\''The math behind evenly spaced increases and decreases. Formula, examples, and a free calculator for shaping hats and amigurumi.'\'',\
      date: '\''2026-02-13'\'',\
      readTime: '\''7 min read'\'',\
      category: '\''Crochet Techniques'\'',\
    },\
    {\
      slug: '\''crochet-stripe-pattern-generator'\'',\
      title: '\''Crochet Stripe Pattern Generator: Random and Temperature'\'',\
      excerpt: '\''Generate stripe patterns for blankets. Random, weighted, gradient, and temperature blanket color mapping tools.'\'',\
      date: '\''2026-02-13'\'',\
      readTime: '\''7 min read'\'',\
      category: '\''Crochet Design'\'',\
    },\
    {\
      slug: '\''planned-pooling-crochet-guide'\'',\
      title: '\''How Planned Pooling Works: Color Pooling Calculator Guide'\'',\
      excerpt: '\''Learn the math and technique behind planned color pooling in crochet for argyle and plaid effects with variegated yarn.'\'',\
      date: '\''2026-02-12'\'',\
      readTime: '\''6 min read'\'',\
      category: '\''Crochet Techniques'\'',\
    },\
    {\
      slug: '\''spinning-wheel-ratio-calculator'\'',\
      title: '\''Spinning Wheel Ratio Calculator: Drive Ratios and TPI'\'',\
      excerpt: '\''Calculate spinning wheel drive ratios, twists per inch, and plying ratios for handspinners.'\'',\
      date: '\''2026-02-12'\'',\
      readTime: '\''6 min read'\'',\
      category: '\''Fiber Arts'\'',\
    },\
    {\
      slug: '\''cross-stitch-fabric-calculator'\'',\
      title: '\''Cross Stitch Fabric Calculator: Size Your Design for Any Count'\'',\
      excerpt: '\''Calculate cross stitch dimensions across fabric counts. Convert between Aida, evenweave, and linen.'\'',\
      date: '\''2026-02-12'\'',\
      readTime: '\''6 min read'\'',\
      category: '\''Cross Stitch'\'',\
    },\
    {\
      slug: '\''weaving-sett-calculator-guide'\'',\
      title: '\''Weaving Sett Calculator: WPI to EPI Conversion Guide'\'',\
      excerpt: '\''Calculate optimal sett for weaving projects. Convert wraps per inch to ends per inch for balanced weaves.'\'',\
      date: '\''2026-02-12'\'',\
      readTime: '\''6 min read'\'',\
      category: '\''Weaving'\'',\
    },\
    {\
      slug: '\''embroidery-thread-conversion-chart'\'',\
      title: '\''DMC to Anchor Thread Conversion Chart'\'',\
      excerpt: '\''Convert embroidery thread colors between DMC, Anchor, Cosmo, and Sulky brands instantly.'\'',\
      date: '\''2026-02-12'\'',\
      readTime: '\''6 min read'\'',\
      category: '\''Embroidery'\'',\
    },
' src/pages/Blog.tsx

echo ""
echo "============================================================"
echo "✅ ALL DONE! Now build and deploy:"
echo "   npm run build && firebase deploy"
echo "============================================================"
