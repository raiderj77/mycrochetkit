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
