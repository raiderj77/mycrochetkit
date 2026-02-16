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
