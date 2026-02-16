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
