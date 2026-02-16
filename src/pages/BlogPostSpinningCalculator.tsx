import { BlogPostLayout } from '../components/BlogPostLayout';

export const BlogPostSpinningCalculator = () => (
  <BlogPostLayout
    title="Spinning Calculator: Estimate Yardage from Fiber to Finished Yarn"
    description="Free spinning calculator for handspinners. Estimate finished yardage from fiber weight, calculate twist per inch, and plan spinning projects."
    slug="spinning-calculator-fiber-yardage"
    date="2026-02-15"
    readTime="9 min read"
    category="Fiber Arts Tools"
    keywords={['spinning calculator', 'handspinning yardage', 'fiber to yarn calculator', 'twist per inch calculator', 'spinning yardage estimator']}
    breadcrumbTitle="Spinning Calculator"
    toolUrl="https://fibertools.app/spinning-calculator"
    toolName="Spinning Calculator"
    faqs={[
      { question: 'How much yarn will I get from a pound of fiber?', answer: 'It depends on how thick you spin. A pound of fiber typically yields 800-1,600 yards of worsted-weight yarn, 1,200-2,400 yards of sport weight, or 2,000-4,000+ yards of laceweight. Processing loss (washing, carding) removes about 5-15% of the starting weight.' },
      { question: 'How do I calculate twist per inch for handspun yarn?', answer: 'Hold a 1-inch section of your yarn next to a ruler and count the visible twists (bumps on the surface). For singles, count complete rotations. For plied yarn, count the visible plies crossing per inch. Worsted typically needs 4-6 TPI, while lace may need 8-12 TPI.' },
      { question: 'What is the spinning ratio and why does it matter?', answer: 'The spinning ratio (or drive ratio) is the number of times the flyer rotates for each treadle. Higher ratios add more twist per treadle, good for thin yarns. Lower ratios add less twist, good for thick yarns. Most wheels offer ratios from 5:1 to 15:1.' },
      { question: 'How much fiber should I buy for a sweater?', answer: 'Plan for about 20% more fiber than your finished yarn needs to account for processing loss, sampling, and waste. If a sweater pattern calls for 1,200 yards of worsted, you\'ll need roughly 16-20 oz of fiber depending on your spinning style.' },
    ]}
  >
    <p>
      Handspinners face a question that never gets easier to answer: "How much yarn will this pile of fiber actually make?" Whether you're staring at a gorgeous braid of hand-dyed merino at a fiber festival or planning a sweater from your own sheep's fleece, estimating finished yardage from raw fiber is part math, part experience.
    </p>
    <p>
      The <a href="https://fibertools.app/spinning-calculator" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] underline hover:text-[#D35A4A]">FiberTools spinning calculator</a> helps take the guesswork out of that equation. Enter your fiber weight, target yarn weight, and it estimates your finished yardage &mdash; accounting for processing loss and twist.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">The Fiber-to-Yarn Math</h2>
    <p>
      The core calculation is surprisingly straightforward: thinner yarn means more yardage from the same weight of fiber. A pound of merino spun into bulky yarn might give you 500 yards, while that same pound spun laceweight could produce over 3,000 yards. The variable is <strong>wraps per inch (WPI)</strong> &mdash; how many times your finished yarn wraps around a ruler in one inch.
    </p>
    <p>
      But there are losses along the way. Washing raw fleece removes lanolin and dirt (sometimes 30-50% of the weight). Even processed roving loses 5-10% during spinning from fiber fly and waste. And plying adds twist that slightly shortens your total yardage &mdash; typically a 10-15% reduction from singles length.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Estimating Yardage by Yarn Weight</h2>
    <p>
      As a starting reference, here's what spinners typically get from one pound (16 oz) of prepared fiber: Laceweight (14+ WPI) yields roughly 2,000-4,000 yards. Fingering weight (11-13 WPI) gives about 1,400-2,000 yards. Sport weight (9-10 WPI) produces 1,000-1,400 yards. Worsted weight (7-8 WPI) comes in around 800-1,200 yards. Bulky weight (5-6 WPI) gives approximately 400-700 yards.
    </p>
    <p>
      These ranges are wide because they depend on your personal spinning style &mdash; how much twist you add, how consistent your drafting is, and whether you're spinning woolen or worsted style. The <a href="https://fibertools.app/spinning-calculator" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] underline hover:text-[#D35A4A]">spinning calculator</a> lets you dial in your specific parameters for a tighter estimate.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Twist Per Inch: Finding the Sweet Spot</h2>
    <p>
      Twist per inch (TPI) determines your yarn's strength, drape, and feel. Too little twist and your yarn falls apart. Too much and it becomes wiry and biased (fabric that leans diagonally). The right amount depends on your fiber and intended yarn weight.
    </p>
    <p>
      For worsted-weight singles, aim for 4-6 TPI. Sport and fingering weight need more: 6-10 TPI. Laceweight can go up to 12+ TPI. These are starting points &mdash; spin a sample, knit or crochet a swatch, and adjust. Your hands will learn to feel the right twist faster than any number can teach you.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Planning a Spinning Project</h2>
    <p>
      Let's say you want to spin enough yarn for a crocheted shawl that calls for 600 yards of sport-weight yarn. Working backward: 600 yards of sport weight requires roughly 7-8 oz of prepared fiber. Add 20% for waste, sampling, and the yarn you'll use for gauge swatches &mdash; so buy about 9-10 oz.
    </p>
    <p>
      If you're buying a 4 oz braid of hand-dyed roving, that means you need 2-3 braids. Always buy an extra &mdash; running out of a specific indie dyer's colorway mid-project is the spinner's nightmare.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Fiber Types and Their Yield</h2>
    <p>
      Different fibers behave differently during spinning, which affects your final yardage. Merino and other fine wools draft easily and spin into consistent yarn with predictable yardage. Longwools like BFL (Bluefaced Leicester) and Romney have more body and less elasticity &mdash; they're easier to spin worsted-style and tend to give slightly more yardage per ounce because they compress less.
    </p>
    <p>
      Plant fibers like cotton and linen are denser and produce heavier yarn per yard &mdash; expect 20-30% less yardage by weight compared to wool. Silk is a wildcard: incredibly strong, very fine, and capable of producing massive yardage, but it's slippery to spin and requires more twist.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">From Fiber to Finished Object</h2>
    <p>
      The <a href="https://fibertools.app/spinning-calculator" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] underline hover:text-[#D35A4A]">spinning calculator on FiberTools</a> bridges the gap between your fiber stash and your project plans. Estimate yardage before you buy, plan your spinning sessions, and stop guessing whether three braids of roving will be enough for that cardigan. The fiber-to-yarn pipeline has enough variables already &mdash; let the math handle itself.
    </p>
  </BlogPostLayout>
);
