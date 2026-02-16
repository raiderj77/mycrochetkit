import { BlogPostLayout } from '../components/BlogPostLayout';

export const BlogPostCrossStitchCalculator = () => (
  <BlogPostLayout
    title="Cross Stitch Calculator: Fabric Size, Thread Estimates & Stitch Count"
    description="Free cross stitch calculator for fabric size, thread quantity, and finished dimensions. Plan projects with accurate Aida cloth measurements."
    slug="cross-stitch-calculator-fabric-thread"
    date="2026-02-15"
    readTime="7 min read"
    category="Fiber Arts Tools"
    keywords={['cross stitch calculator', 'aida cloth calculator', 'cross stitch fabric size', 'embroidery thread calculator', 'cross stitch stitch count']}
    breadcrumbTitle="Cross Stitch Calculator"
    toolUrl="https://fibertools.app/cross-stitch-calculator"
    toolName="Cross Stitch Calculator"
    faqs={[
      { question: 'How do I calculate cross stitch fabric size?', answer: 'Divide your pattern\'s stitch count by the fabric count (e.g., 14-count Aida = 14 stitches per inch). A 140x100 stitch pattern on 14-count Aida = 10x7.14 inches of stitching area. Add 3-4 inches on each side for framing margins.' },
      { question: 'How much embroidery thread do I need for cross stitch?', answer: 'A general estimate is that one skein of DMC floss (8 meters) covers about 90-100 full cross stitches on 14-count Aida using 2 strands. Count the stitches of each color in your pattern and divide by 90 to estimate skeins needed.' },
      { question: 'What\'s the difference between 14-count and 18-count Aida?', answer: 'The count refers to stitches per inch. 14-count has 14 holes per inch (larger stitches, easier to see), while 18-count has 18 holes per inch (smaller stitches, more detail). Higher counts produce finer pieces but take longer.' },
      { question: 'How do I convert a cross stitch pattern between fabric counts?', answer: 'The stitch count stays the same — only the physical size changes. Divide the stitch count by the new fabric count to get the new dimensions. A 140-stitch-wide pattern is 10 inches on 14-count but 7.78 inches on 18-count.' },
    ]}
  >
    <p>
      Every cross stitch project starts with the same question: "How big do I cut the fabric?" Get it wrong and you're either wasting expensive Aida cloth or &mdash; worse &mdash; running out of fabric three-quarters through a project you've spent months on.
    </p>
    <p>
      The <a href="https://fibertools.app/cross-stitch-calculator" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] underline hover:text-[#D35A4A]">FiberTools cross stitch calculator</a> handles fabric sizing, thread estimates, and count conversions so you can focus on the actual stitching.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Calculating Fabric Size</h2>
    <p>
      The formula is simple: <strong>design stitches &divide; fabric count = stitched area in inches</strong>. A pattern that's 200 stitches wide on 14-count Aida will be 14.3 inches across. On 18-count, that same pattern shrinks to 11.1 inches.
    </p>
    <p>
      But you can't cut your fabric to the exact stitched size. You need margins for framing, finishing, and keeping the fabric taut in your hoop or scroll frame. The standard recommendation is 3-4 inches of margin on every side. So that 14.3" &times; 10" stitched area needs fabric cut to at least 20" &times; 16".
    </p>
    <p>
      Use the <a href="https://fibertools.app/cross-stitch-calculator" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] underline hover:text-[#D35A4A]">calculator</a> to instantly see your cut size with margins included &mdash; no mental math required.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Estimating Thread and Floss</h2>
    <p>
      Thread estimation is where most stitchers either over-buy (expensive) or under-buy (finding a discontinued DMC color mid-project is a special kind of pain). The general rule: one standard skein of 6-strand embroidery floss (8 meters / 8.7 yards) covers approximately 90-100 full cross stitches on 14-count Aida when using 2 strands.
    </p>
    <p>
      That coverage drops on higher-count fabric because you use more thread per stitch to cover the smaller squares adequately. On 18-count, expect about 70-80 stitches per skein. On 11-count, you might get 110-120.
    </p>
    <p>
      Count each color in your pattern, divide by the per-skein coverage for your fabric count, and round up. Always buy at least one extra skein of your background color and any color that covers more than 500 stitches &mdash; dye lot variations between purchases are real, and they show.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Choosing Your Fabric Count</h2>
    <p>
      Your fabric count choice affects everything: finished size, detail level, stitching time, and thread consumption. <strong>11-count Aida</strong> is great for beginners and quick projects &mdash; large holes, easy to see, forgiving of slight placement errors. <strong>14-count Aida</strong> is the most popular all-purpose count with a good balance of detail and ease. <strong>18-count Aida</strong> produces detailed, refined pieces where text looks much cleaner, though you'll need good lighting. <strong>28-count evenweave</strong> (stitched over 2 threads) is equivalent to 14-count Aida but with a softer fabric feel preferred by experienced stitchers.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Converting Between Fabric Counts</h2>
    <p>
      Want to stitch a 14-count pattern on 18-count fabric? The stitch count doesn't change &mdash; only the physical dimensions. Plug both counts into the <a href="https://fibertools.app/cross-stitch-calculator" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] underline hover:text-[#D35A4A]">cross stitch calculator</a> to see exactly how the finished size and thread requirements shift.
    </p>
    <p>
      A common conversion trap: going from 14-count to 18-count makes your piece about 22% smaller in each dimension, which means 40% less total area. That can turn a bold wall piece into something that looks undersized in its frame. Plan your frame size and display location before committing to a count change.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Planning Your Next Cross Stitch Project</h2>
    <p>
      Good project planning is the difference between a relaxing craft session and a frustrating fabric shortage. The <a href="https://fibertools.app/cross-stitch-calculator" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] underline hover:text-[#D35A4A]">FiberTools cross stitch calculator</a> gives you fabric dimensions with margins, thread estimates by color, and count conversions &mdash; all in one place. Cut once, stitch with confidence.
    </p>
  </BlogPostLayout>
);
