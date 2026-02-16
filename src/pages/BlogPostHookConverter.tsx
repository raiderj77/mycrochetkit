import { BlogPostLayout } from '../components/BlogPostLayout';

export const BlogPostHookConverter = () => (
  <BlogPostLayout
    title="Crochet Hook Size Converter: US, UK & Metric Conversion Chart"
    description="Free crochet hook size converter. Instantly convert between US letter sizes, US number sizes, UK/Canadian sizes, and metric (mm) measurements."
    slug="crochet-hook-size-converter"
    date="2026-02-15"
    readTime="7 min read"
    category="Crochet Guides"
    keywords={['crochet hook size converter', 'hook size chart', 'crochet hook mm to us', 'uk to us hook sizes', 'crochet hook conversion chart']}
    breadcrumbTitle="Hook Size Converter"
    toolUrl="https://fibertools.app/hook-converter"
    toolName="Hook Size Converter"
    faqs={[
      { question: 'How do I convert crochet hook sizes between US and metric?', answer: 'US hook sizes use letters (B through S) or numbers (1-16), while metric uses millimeters. For example, US G/6 = 4.0mm, US H/8 = 5.0mm, and US J/10 = 6.0mm. Use a hook size converter chart for accurate conversions, as the relationship is not linear.' },
      { question: 'Are UK and US crochet hook sizes the same?', answer: 'No. UK sizes use a different numbering system that runs in the opposite direction from US sizes. A UK size 4 is roughly equivalent to a US G/6 (4.0mm). Always check a conversion chart rather than assuming the numbers match.' },
      { question: 'What crochet hook size should I use for worsted weight yarn?', answer: 'Worsted weight yarn typically works best with a 5.0mm to 6.0mm hook (US H/8 to J/10). Always check your pattern and make a gauge swatch, as personal tension varies significantly between crocheters.' },
      { question: 'Why do some patterns only list mm and not US sizes?', answer: 'Metric measurements are the international standard and more precise than lettered US sizes. Many designers, especially outside the US, list only millimeters. A hook converter makes it easy to find the US equivalent for any metric size.' },
    ]}
  >
    <p>
      You found a gorgeous pattern from a UK designer. It calls for a "4.00mm hook." You dig through your hook case and find hooks labeled B, G, H, 6, 8 &mdash; but no millimeters in sight. Sound familiar?
    </p>
    <p>
      Crochet hook sizing is one of those things that should be simple but isn't. Three different regional systems, inconsistent labeling between brands, and steel hooks with their own entirely separate numbering. The <a href="https://fibertools.app/hook-converter" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] underline hover:text-[#D35A4A]">FiberTools hook size converter</a> translates between all of them instantly.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Understanding the Three Hook Size Systems</h2>
    <p>
      <strong>Metric (mm)</strong> is the international standard and the most precise. Every hook has an exact millimeter measurement, and this is what manufacturers actually use to make hooks. When in doubt, metric is the one to trust.
    </p>
    <p>
      <strong>US sizes</strong> use a dual system: letters (B through S) and numbers (1 through 16). Most hooks show both, like "H/8" or "J/10." The letter and number always correspond to the same millimeter size &mdash; H/8 is always 5.0mm.
    </p>
    <p>
      <strong>UK/Canadian sizes</strong> run in the opposite direction from US sizes, which is where confusion really sets in. A UK 2 is a large hook (roughly US K/10.5 or 7.0mm), while a UK 14 is tiny (roughly US B/1 or 2.0mm). The higher the UK number, the smaller the hook.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Common Conversions You'll Use Most</h2>
    <p>
      These are the hook sizes that come up constantly in patterns. US G/6 = 4.0mm (great for DK weight). US H/8 = 5.0mm (worsted weight go-to). US I/9 = 5.5mm (slightly larger worsted). US J/10 = 6.0mm (bulky-friendly). US K/10.5 = 6.5mm. These five hooks cover probably 80% of crochet patterns.
    </p>
    <p>
      For a full list with UK equivalents, use the <a href="https://fibertools.app/hook-converter" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] underline hover:text-[#D35A4A]">hook converter tool</a>. It covers every standard size from 2.0mm steel hooks up to 25mm jumbo hooks.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Steel Hook Sizes: A Separate System</h2>
    <p>
      If you do thread crochet or lacework, steel hooks add another layer of confusion. Steel hooks use numbers that run <em>opposite</em> to regular hook numbers: a steel size 14 is the smallest (0.75mm), while a steel size 0 is the largest (3.5mm). They overlap slightly with regular hooks at the larger end but are generally much smaller.
    </p>
    <p>
      Steel hooks are specifically designed for crochet thread (sizes 3 through 100) rather than yarn. If a pattern calls for a "size 7 steel hook," that's 1.65mm &mdash; much smaller than a regular size 7 (4.5mm). The word "steel" is the critical distinction.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">When Hook Sizes Don't Match Between Brands</h2>
    <p>
      Here's the frustrating reality: not all hooks labeled the same size are actually the same size. A Boye H/8 hook might measure slightly differently than a Clover H/8 hook. Manufacturing tolerances vary, and some brands round differently. If your gauge is off despite using the "correct" hook size, try measuring your hook with calipers. The millimeter measurement is what actually matters for your stitches.
    </p>
    <p>
      This is also why gauge swatches matter more than hook size labels. Two crocheters using the exact same hook can produce very different gauge because of tension differences. The hook size in a pattern is a starting point, not a guarantee.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Matching Hooks to Yarn Weight</h2>
    <p>
      While patterns specify exact hook sizes, knowing the general yarn weight-to-hook pairing helps when you're designing your own projects or substituting yarn. Lace and fingering weight yarns work with 2.0-3.5mm hooks. DK weight pairs with 3.5-4.5mm. Worsted weight uses 4.5-5.5mm. Bulky needs 5.5-8.0mm. Super bulky and jumbo yarns go from 8.0mm up to 25mm.
    </p>
    <p>
      These are starting ranges. Personal tension, desired drape, and stitch pattern all influence your ideal hook size. A tighter crocheter might need to go up a size, while a loose crocheter goes down.
    </p>

    <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">Convert Any Hook Size</h2>
    <p>
      Stop squinting at tiny hook engravings and guessing at conversions. The <a href="https://fibertools.app/hook-converter" target="_blank" rel="noopener noreferrer" className="text-[#E86A58] underline hover:text-[#D35A4A]">FiberTools hook size converter</a> gives you instant, accurate conversions between US, UK, metric, and steel hook sizes. Bookmark it &mdash; you'll use it more than you expect.
    </p>
  </BlogPostLayout>
);
