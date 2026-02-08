import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';
import { ShareButtons } from '../components/ShareButtons';

export const BlogPostC2CPatterns = () => {
  return (
    <>
      <SEOHead
        title="C2C Crochet Patterns: The Complete Corner-to-Corner Guide | MyCrochetKit"
        description="Learn corner-to-corner (C2C) crochet from scratch. How C2C works, reading color graphs, managing yarn, and using a free pattern generator to create your own designs."
        canonicalUrl="https://mycrochetkit.com/blog/c2c-crochet-patterns-complete-guide"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'C2C Crochet Patterns: The Complete Corner-to-Corner Guide',
          description:
            'Learn corner-to-corner (C2C) crochet from scratch. How the technique works, reading color graphs, managing bobbins, and generating your own patterns.',
          author: {
            '@type': 'Person',
            name: 'Jason',
            description: 'Crocheter and developer. Founder of MyCrochetKit.',
            url: 'https://mycrochetkit.com/about',
          },
          publisher: {
            '@type': 'Organization',
            name: 'MyCrochetKit',
            url: 'https://mycrochetkit.com',
          },
          datePublished: '2026-02-07',
          dateModified: '2026-02-07',
          mainEntityOfPage: 'https://mycrochetkit.com/blog/c2c-crochet-patterns-complete-guide',
          articleSection: 'Crochet Techniques',
          keywords: [
            'c2c crochet',
            'corner to corner crochet',
            'c2c crochet pattern',
            'c2c crochet blanket',
            'c2c crochet tutorial',
            'corner to corner crochet tutorial',
            'c2c pattern generator',
            'c2c color graph',
          ],
        }}
      />

      <div className="min-h-screen bg-[#FFF8F0]">
        {/* Header */}
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

        {/* Breadcrumbs */}
        <nav
          className="max-w-3xl mx-auto px-6 pt-6 text-sm text-[#2C1810]/70"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-[#E86A58]">
            Home
          </Link>
          <span className="mx-2">&rsaquo;</span>
          <Link to="/blog" className="hover:text-[#E86A58]">
            Blog
          </Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-[#2C1810]/70">C2C Crochet Patterns</span>
        </nav>

        {/* Article */}
        <article className="max-w-3xl mx-auto px-6 py-8">
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-[#E86A58] mb-4">
            <span className="px-3 py-1 bg-[#E86A58]/10 rounded-full font-medium">
              Crochet Techniques
            </span>
            <span className="flex items-center gap-1 text-[#2C1810]/70">
              <Calendar className="w-4 h-4" /> Feb 7, 2026
            </span>
            <span className="flex items-center gap-1 text-[#2C1810]/70">
              <Clock className="w-4 h-4" /> 10 min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-4 leading-tight">
            C2C Crochet Patterns: The Complete Corner-to-Corner Guide
          </h1>
          <p className="text-lg text-[#2C1810]/70 mb-6 leading-relaxed">
            Corner-to-corner crochet turns a simple grid of colors into a blanket, wall hanging, or
            pillow. It looks impressive, but the technique itself is surprisingly beginner-friendly.
            Here&apos;s everything you need to know.
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 py-4 border-t border-b border-[#2C1810]/10 mb-8">
            <div className="w-11 h-11 rounded-full bg-[#E86A58]/10 flex items-center justify-center">
              <span className="text-lg">🧶</span>
            </div>
            <div>
              <p className="font-semibold text-[#2C1810] text-sm">Jason</p>
              <p className="text-xs text-[#2C1810]/70">
                Crocheter & developer &middot; Founder of MyCrochetKit
              </p>
            </div>
          </div>

          {/* Key Answer Box */}
          <div className="bg-[#E8EDE5] border-l-4 border-[#7A8B6F] rounded-r-xl p-5 mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8B6F] mb-2">
              The short answer
            </p>
            <p className="text-[#2C1810] leading-relaxed">
              C2C (corner-to-corner) crochet builds a fabric diagonally using small blocks of double
              crochet stitches. You start with one block in a corner, increase one block per row
              until you reach the widest diagonal, then decrease back down. Color changes on the
              graph create pixel-art-style images. It&apos;s one of the easiest ways to make
              picture blankets.
            </p>
          </div>

          {/* Body */}
          <div className="prose-custom space-y-6 text-[#2C1810] leading-relaxed">
            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              What Is C2C Crochet?
            </h2>

            <p>
              Corner-to-corner crochet is a technique where you work diagonally across your fabric
              instead of in horizontal rows. Each &ldquo;block&rdquo; is a small cluster of double
              crochet stitches (usually 3 dc + a chain), and these blocks tile together to form a
              grid. By assigning different colors to different blocks, you can create images,
              geometric patterns, or color gradients.
            </p>
            <p>
              The name says it all: you literally start in one corner and end in the opposite
              corner. The first row is a single block. Each subsequent row adds one more block until
              you reach the diagonal midpoint, then you decrease one block per row until you&apos;re
              back to a single block.
            </p>
            <p>
              What makes C2C so popular is that you only need to know a few basic stitches &mdash;
              chain, slip stitch, and double crochet &mdash; and the pattern reads like a pixel art
              grid. If you can follow a color chart, you can make a C2C blanket.
            </p>

            {/* How C2C Works Visual */}
            <figure className="my-8 -mx-2 md:-mx-6">
              <div className="bg-[#FFF8EE] rounded-2xl p-6 md:p-8 border border-[#2C1810]/5">
                <p className="text-center text-lg font-bold text-[#E86A58] mb-6">
                  How a C2C Grows
                </p>
                <div className="flex flex-col items-center gap-2">
                  {[
                    { row: 1, blocks: 1, label: 'Start corner' },
                    { row: 2, blocks: 2, label: 'Increasing' },
                    { row: 3, blocks: 3, label: 'Increasing' },
                    { row: 4, blocks: 4, label: 'Widest diagonal' },
                    { row: 5, blocks: 3, label: 'Decreasing' },
                    { row: 6, blocks: 2, label: 'Decreasing' },
                    { row: 7, blocks: 1, label: 'End corner' },
                  ].map((r) => (
                    <div key={r.row} className="flex items-center gap-3">
                      <span className="text-xs text-[#2C1810]/50 w-12 text-right">
                        Row {r.row}
                      </span>
                      <div className="flex gap-1">
                        {Array.from({ length: r.blocks }).map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded bg-[#B8A9C9]/30 border border-[#B8A9C9]/50"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#2C1810]/60">{r.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-[#2C1810]/70 mt-4 italic">
                  Each row is a diagonal line. The fabric grows into a diamond, then shrinks.
                </p>
              </div>
            </figure>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              The Basic C2C Block
            </h2>

            <p>
              Every C2C block is the same: chain 6, double crochet in the 4th chain from hook,
              then dc in the next 2 chains. That gives you a small square of 3 double crochets
              sitting on a chain-3 base. All of C2C is just this one block repeated and connected
              with slip stitches and chains.
            </p>

            <div className="bg-[#FFF8EE] border border-[#2C1810]/10 rounded-xl p-5 my-6">
              <p className="font-bold text-[#2C1810] mb-2">The C2C block stitch</p>
              <ol className="list-decimal list-inside space-y-1 text-[#2C1810]/70 text-[15px]">
                <li>Chain 6</li>
                <li>Double crochet in 4th chain from hook</li>
                <li>Double crochet in next chain</li>
                <li>Double crochet in next chain</li>
              </ol>
              <p className="text-[#2C1810]/60 text-sm mt-3 italic">
                Result: a 3-dc block with a ch-3 post. This is your pixel.
              </p>
            </div>

            <p>
              To connect blocks within a row, you slip stitch into the chain-3 space of the block
              below, then chain 3 and work 3 dc into that same space. To start a new row on the
              increase side, you chain 6 and turn. On the decrease side, you slip stitch across the
              first block and chain 3 to begin.
            </p>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              Reading a C2C Color Graph
            </h2>

            <p>
              A C2C pattern is usually presented as a grid where each cell represents one block and
              each color represents a yarn color. Unlike traditional crochet charts with stitch
              symbols, C2C graphs are pure color grids &mdash; think pixel art or cross-stitch
              charts.
            </p>
            <p>
              The key thing to remember is that you read the graph diagonally, not in rows. Diagonal
              1 is the bottom-right cell. Diagonal 2 is the two cells that form the next diagonal
              line. You work each diagonal from bottom to top (on odd diagonals) or top to bottom
              (on even diagonals), alternating direction like a zigzag.
            </p>

            {/* Reading Direction Visual */}
            <figure className="my-8 -mx-2 md:-mx-6">
              <div className="bg-[#FFF8EE] rounded-2xl p-6 md:p-8 border border-[#2C1810]/5">
                <p className="text-center text-lg font-bold text-[#E86A58] mb-4">
                  Reading a 4&times;4 Graph Diagonally
                </p>
                <div className="flex justify-center">
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      ['7', '4', '2', '1'],
                      ['6', '3', '1', ''],
                      ['4', '2', '', ''],
                      ['3', '', '', ''],
                    ].map((row, r) =>
                      row.map((cell, c) => (
                        <div
                          key={`${r}-${c}`}
                          className={`w-12 h-12 rounded flex items-center justify-center text-xs font-bold ${
                            cell
                              ? 'bg-[#B8A9C9]/20 border border-[#B8A9C9]/40 text-[#6B5B7A]'
                              : 'bg-[#2C1810]/5 border border-[#2C1810]/10 text-[#2C1810]/20'
                          }`}
                        >
                          {cell ? `D${cell}` : ''}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <p className="text-center text-sm text-[#2C1810]/70 mt-4 italic">
                  Numbers show the diagonal each cell belongs to. D1 is your first row (1 block).
                </p>
              </div>
            </figure>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              Color Changes in C2C
            </h2>

            <p>
              Color changes in C2C happen at the block level. When you need to switch colors, you
              work the last double crochet of the current block until you have two loops on your
              hook, then pull through with the new color. The new color &ldquo;caps&rdquo; the
              block and sets up cleanly for the next one.
            </p>
            <p>
              For patterns with many color changes per row, you have two options: cut and tie each
              color (simpler but lots of ends to weave), or carry the unused yarn behind your work
              (fewer ends but the back looks messy and you need to manage tension). Most crocheters
              use bobbins or butterflies of yarn &mdash; small wound bundles that hang behind the
              work and unwind as needed.
            </p>

            <div className="bg-[#FFF8EE] border border-[#2C1810]/10 rounded-xl p-5 my-6">
              <p className="font-bold text-[#2C1810] mb-2">Yarn management tips</p>
              <ul className="space-y-2 text-[#2C1810]/70 text-[15px]">
                <li className="flex items-start gap-2">
                  <span className="text-[#7FBFA0] flex-shrink-0 mt-0.5">&#10003;</span>
                  <span>
                    <strong>Wind bobbins</strong> for each color section instead of using full
                    skeins. Small clothespin bobbins work great.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7FBFA0] flex-shrink-0 mt-0.5">&#10003;</span>
                  <span>
                    <strong>Don&apos;t carry yarn more than 2&ndash;3 blocks</strong> &mdash;
                    it creates stiff spots. Cut and rejoin instead.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7FBFA0] flex-shrink-0 mt-0.5">&#10003;</span>
                  <span>
                    <strong>Weave ends as you go</strong> by crocheting over the tails for a few
                    blocks. Saves hours of finishing work.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7FBFA0] flex-shrink-0 mt-0.5">&#10003;</span>
                  <span>
                    <strong>Use stitch markers</strong> to mark every 10th diagonal so you can
                    verify your position against the graph.
                  </span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              Choosing Yarn for C2C Projects
            </h2>

            <p>
              C2C works best with medium-weight (worsted or aran) acrylic yarn because the blocks
              need to be uniform. Cotton tends to stretch unevenly, and chunky yarn makes the
              blocks too bulky for detailed images. For blankets, a good go-to is any budget acrylic
              with consistent dye lots &mdash; you&apos;ll use a lot of yardage.
            </p>
            <p>
              How much yarn do you need? A rough estimate: each C2C block uses about 2 yards of
              yarn with a 5mm hook and worsted weight. For a 50&times;50 block blanket
              (approximately 40&rdquo;&times;40&rdquo;), that&apos;s 2,500 blocks &times; 2 yards =
              5,000 yards total, split across your colors. Always buy extra &mdash; dye lots
              vary and running out mid-project is painful.
            </p>

            {/* Yarn Estimate Table */}
            <div className="my-8 -mx-2 md:-mx-6 overflow-x-auto">
              <div className="bg-white rounded-2xl border border-[#2C1810]/10 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F5E6D3]">
                      <th className="text-left px-4 py-3 font-semibold text-[#2C1810]/70 text-xs uppercase tracking-wider">
                        Project Size
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-[#2C1810]/70 text-xs uppercase tracking-wider">
                        Grid
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-[#2C1810]/70 text-xs uppercase tracking-wider">
                        Total Blocks
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-[#2C1810]/70 text-xs uppercase tracking-wider">
                        ~Yarn (yds)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: 'Pillow (16")', grid: '20×20', blocks: '400', yarn: '~800' },
                      { size: 'Baby Blanket (30")', grid: '35×35', blocks: '1,225', yarn: '~2,450' },
                      { size: 'Throw (40")', grid: '50×50', blocks: '2,500', yarn: '~5,000' },
                      { size: 'Full Blanket (60")', grid: '75×75', blocks: '5,625', yarn: '~11,250' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-[#FFF8EE] border-t border-[#2C1810]/5">
                        <td className="px-4 py-3 font-semibold text-[#2C1810]">{row.size}</td>
                        <td className="px-4 py-3 text-center text-[#2C1810]/70">{row.grid}</td>
                        <td className="px-4 py-3 text-center text-[#2C1810]/70">{row.blocks}</td>
                        <td className="px-4 py-3 text-center font-semibold text-[#7A8B6F]">
                          {row.yarn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-center text-xs text-[#2C1810]/65 mt-3 italic">
                Estimates based on worsted weight yarn with a 5mm hook. Actual yardage varies by
                tension.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              Popular C2C Pattern Ideas
            </h2>

            <p>
              C2C is versatile enough for simple geometric designs and detailed pixel art. Here are
              some of the most popular categories:
            </p>

            <div className="grid sm:grid-cols-2 gap-4 my-6">
              {[
                {
                  title: 'Graphgan portraits',
                  desc: 'Turn a photo into a pixel grid. Pet portraits and family photos are hugely popular.',
                  emoji: '🖼️',
                },
                {
                  title: 'Geometric patterns',
                  desc: 'Chevrons, stripes, diamonds, and gradients. Great for beginners since they repeat.',
                  emoji: '🔷',
                },
                {
                  title: 'Character blankets',
                  desc: 'Video game sprites, cartoon characters, sports logos. The pixel-art nature of C2C makes these natural.',
                  emoji: '🎮',
                },
                {
                  title: 'Seasonal & holiday',
                  desc: 'Snowflakes, pumpkins, hearts, flags. Quick projects that make great gifts.',
                  emoji: '🎄',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl p-4 border border-[#2C1810]/5"
                >
                  <span className="text-2xl mb-2 block">{item.emoji}</span>
                  <p className="font-bold text-[#2C1810] text-sm mb-1">{item.title}</p>
                  <p className="text-[#2C1810]/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              Creating Your Own C2C Patterns
            </h2>

            <p>
              Designing your own C2C pattern comes down to creating a color grid. You can use graph
              paper and colored pencils, a spreadsheet with colored cells, or a dedicated pattern
              generator tool. The key is deciding your grid dimensions (which determines the size
              of your finished piece) and your color palette.
            </p>
            <p>
              Once you have your grid, you need to convert it into row-by-row written instructions.
              This is where it gets tedious by hand &mdash; you have to trace each diagonal, note
              every color change, and calculate whether you&apos;re on an increase or decrease row.
              For anything larger than 15&times;15, you really want a tool to do this for you.
            </p>
            <p>
              That&apos;s exactly why we built the{' '}
              <Link
                to="/tools/c2c-generator"
                className="text-[#E86A58] font-semibold hover:underline"
              >
                MyCrochetKit C2C Pattern Generator
              </Link>
              . Paint your grid, pick your colors, and it generates the full written instructions
              instantly &mdash; including increase/decrease notation, color changes per row, and
              block counts. You can copy the instructions or save the pattern directly to your
              library.
            </p>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              Common C2C Mistakes (and How to Avoid Them)
            </h2>

            <p>
              C2C is forgiving, but a few mistakes come up repeatedly for new crocheters:
            </p>

            <p>
              <strong>Tension inconsistency.</strong> Because C2C blocks are small, even slight
              tension changes are visible. Try to crochet in consistent sessions rather than
              switching between relaxed evening crocheting and tense commute crocheting. If your
              tension varies a lot, go up or down a hook size for different moods (seriously &mdash;
              some people keep two hooks handy).
            </p>
            <p>
              <strong>Miscounting diagonals.</strong> It&apos;s easy to lose track of which
              diagonal you&apos;re on, especially past the midpoint when you start decreasing.
              Place a stitch marker every 10 diagonals, and use a row counter (voice-activated
              works great here &mdash; your hands are already busy managing bobbins).
            </p>
            <p>
              <strong>Not checking gauge.</strong> Your blocks need to be square. If they&apos;re
              rectangular, your finished image will be stretched. Make a 10-block swatch and measure
              &mdash; height and width should be roughly equal. Adjust your hook size if needed.
            </p>
            <p>
              <strong>Too many colors in one row.</strong> Each color change means another bobbin
              hanging off the back. Patterns with 6+ colors per diagonal are manageable but slow.
              If you&apos;re a beginner, start with 2&ndash;3 colors max.
            </p>
            <p>
              <strong>Forgetting which direction to read.</strong> Odd diagonals read bottom to
              top, even diagonals read top to bottom (or vice versa, depending on your pattern). If
              your image comes out mirrored, you were reading every row in the same direction.
            </p>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              Mini C2C vs. Standard C2C
            </h2>

            <p>
              Standard C2C uses blocks of 3 double crochets. &ldquo;Mini C2C&rdquo; uses blocks of
              2 half double crochets, making each block smaller. Mini C2C gives you more detail per
              inch &mdash; better for small images or when you want a tighter fabric &mdash; but
              takes more blocks (and more time) for the same physical size.
            </p>
            <p>
              For blankets, standard C2C is the go-to. For detailed graphgans where image clarity
              matters (pet portraits, complex characters), mini C2C produces noticeably sharper
              results. The trade-off is time: a 50&times;50 mini C2C blanket might take twice as
              long as the standard version.
            </p>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#F5E6D3] to-[#E8EDE5] rounded-2xl p-8 text-center my-10">
            <h3 className="text-xl font-bold text-[#2C1810] mb-2">
              Design Your Own C2C Pattern
            </h3>
            <p className="text-[#2C1810]/70 mb-5">
              Paint a color grid, get instant row-by-row instructions. Free, no account required.
            </p>
            <Link
              to="/tools/c2c-generator"
              className="inline-block bg-[#E86A58] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#D35A4A] transition-colors"
            >
              Open C2C Generator &rarr;
            </Link>
          </div>

          {/* FAQ */}
          <section className="border-t-2 border-[#2C1810]/10 pt-8 mt-10">
            <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Frequently Asked Questions</h2>

            {[
              {
                q: 'What does C2C mean in crochet?',
                a: 'C2C stands for corner-to-corner, a crochet technique where you build fabric diagonally using small blocks of double crochet stitches. You start in one corner, increase by one block per row until the widest point, then decrease back down to the opposite corner. Each block acts like a pixel, making it ideal for creating images and colorwork blankets.',
              },
              {
                q: 'Is C2C crochet good for beginners?',
                a: 'Yes! C2C is one of the most beginner-friendly colorwork techniques. You only need to know chain, slip stitch, and double crochet. The block pattern is repetitive and rhythmic, and following a color graph is more intuitive than reading complex stitch charts. Start with a small project (like a 20×20 pillow) with 2–3 colors to learn the technique.',
              },
              {
                q: 'How do I calculate yarn for a C2C blanket?',
                a: 'A rough estimate is 2 yards of worsted weight yarn per C2C block with a 5mm hook. Multiply your total blocks (width × height) by 2 to get total yardage, then divide by color proportions from your pattern. Always buy 10–15% extra to account for tension variations and dye lot differences. A 50×50 throw uses approximately 5,000 yards total.',
              },
              {
                q: 'What is the difference between C2C and mini C2C?',
                a: 'Standard C2C uses blocks of 3 double crochets (ch-6 start), while mini C2C uses blocks of 2 half double crochets (ch-4 start). Mini C2C creates smaller blocks, giving more detail per inch — better for detailed images like pet portraits. The trade-off is that mini C2C takes more blocks and more time for the same physical size.',
              },
              {
                q: 'Can I make a C2C blanket without a pattern?',
                a: 'Absolutely. You can use a C2C pattern generator to design your own color grid — just paint the cells with your chosen colors and the tool will generate written row-by-row instructions. You can also improvise with simple geometric patterns like stripes, chevrons, or gradients without any chart at all.',
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-[#2C1810]/10 py-5 last:border-b-0">
                <h3 className="font-bold text-[#2C1810] mb-2">{faq.q}</h3>
                <p className="text-[#2C1810]/70 text-[15px] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </section>

          {/* Share */}
          <div className="mt-10 pt-8 border-t border-[#2C1810]/10">
            <ShareButtons
              url="/blog/c2c-crochet-patterns-complete-guide"
              title="C2C Crochet Patterns: The Complete Corner-to-Corner Guide"
              description="Learn corner-to-corner crochet from scratch. How C2C works, reading color graphs, managing yarn, and creating your own patterns."
            />
          </div>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-[#2C1810]/10 text-sm text-[#2C1810]/70">
            <p>
              Written by <strong className="text-[#2C1810]/70">Jason</strong>, founder of{' '}
              <Link to="/" className="text-[#E86A58] hover:underline">
                MyCrochetKit
              </Link>
              . Crocheter first, developer second.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['C2C Crochet', 'Corner to Corner', 'Pattern Design', 'Blankets', 'Colorwork'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#F5E6D3] rounded-full text-xs text-[#2C1810]/60"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </footer>
        </article>
      </div>
    </>
  );
};
