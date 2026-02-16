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
