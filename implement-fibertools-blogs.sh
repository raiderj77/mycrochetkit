#!/bin/bash
# ============================================================
# FiberTools Blog Posts → MyCrochetKit Implementation
# Run from: ~/projects/mycrochetkit
# ============================================================

set -e

cd ~/projects/mycrochetkit || { echo "❌ Run from ~/projects/mycrochetkit"; exit 1; }

echo "🧶 Step 1: Install markdown renderer..."
echo "Already installed, skipping..."

echo ""
echo "🧶 Step 2: Creating blog infrastructure..."
mkdir -p public/blog-posts
mkdir -p src/pages/blog

# ============================================================
# Copy your markdown blog posts to public/
# (These are the files Claude created earlier)
# ============================================================
echo "🧶 Step 3: Creating markdown blog post files..."

cat > public/blog-posts/yarn-calculator.md << 'BLOGEOF'
---
title: "How Much Yarn Do I Need? Free Calculator + Complete Yardage Guide"
description: "Stop guessing. Stop over-buying. Stop running out on row 247."
date: "2026-02-15"
tag: "Free Tool"
keywords: "how much yarn do i need for a blanket, yarn yardage calculator free, how many skeins for a sweater"
---

Every crocheter and knitter has been there — you're three-quarters through a blanket and the yarn runs out. Or you buy six skeins "just in case" and end up with a stash that could outfit a small village.

**[→ Use Our Free Yarn Calculator](https://fibertools.app/yarn-calculator)** — instant results, no login, works offline.

## How the Yarn Calculator Works

Our yarn calculator takes three inputs and gives you an accurate estimate in seconds:

1. **Project type** — blanket, sweater, scarf, hat, amigurumi, socks, or custom dimensions
2. **Yarn weight** — lace through super bulky (standard CYC categories)
3. **Your gauge** — stitches and rows per 4 inches (or use built-in defaults)

The calculator outputs total yardage needed and the number of skeins based on your yarn's skein yardage. No account required. No ads. No email gates.

## Quick Reference: Average Yardage by Project

### Crochet Projects

| Project | Yarn Weight | Approx. Yardage |
|---------|------------|-----------------|
| Baby blanket (30×36") | Worsted (#4) | 900–1,400 yds |
| Throw blanket (50×60") | Worsted (#4) | 2,200–3,000 yds |
| Queen afghan (90×100") | Worsted (#4) | 5,500–7,500 yds |
| Adult beanie | Worsted (#4) | 150–200 yds |
| Infinity scarf | Bulky (#5) | 200–350 yds |
| Women's sweater (M) | DK (#3) | 1,200–1,800 yds |
| Amigurumi (small, ~6") | Worsted (#4) | 50–100 yds |
| Amigurumi (large, ~14") | Worsted (#4) | 250–450 yds |

### Knitting Projects

| Project | Yarn Weight | Approx. Yardage |
|---------|------------|-----------------|
| Pair of socks | Fingering (#1) | 350–450 yds |
| Adult mittens | Worsted (#4) | 200–250 yds |
| Pullover sweater (M) | Worsted (#4) | 1,500–2,000 yds |
| Chunky cowl | Super Bulky (#6) | 120–200 yds |
| Lace shawl | Lace (#0) | 800–1,200 yds |

These are estimates. Your actual yardage depends on your tension, stitch pattern, and how tightly you crochet or knit. That's why a gauge swatch matters — and why the [Gauge Calculator](https://fibertools.app/gauge-calculator) exists.

## Why Stitch Type Affects Yardage

Not all stitches use the same amount of yarn. Taller stitches consume more yarn per row, but they also cover more height — so you need fewer rows.

| Stitch | Yarn Usage per Stitch | Height per Row |
|--------|-----------------------|----------------|
| Single crochet (sc) | Least | Shortest |
| Half double crochet (hdc) | Moderate | Medium |
| Double crochet (dc) | More | Taller |
| Treble crochet (tr) | Most per stitch | Tallest |

**The net effect:** Dense stitches like single crochet often use *more* total yarn because you need significantly more rows. Double crochet blankets typically use 10-15% less yarn than single crochet blankets of the same size.

## How to Measure Yarn You Already Have

### The Kitchen Scale Method
1. Weigh your partial skein in grams
2. Check the label for the full skein's weight and yardage
3. Calculate: (partial weight ÷ full weight) × full yardage = your remaining yardage

**Example:** Your skein label says 198 yds / 100g. Your partial skein weighs 43g.
(43 ÷ 100) × 198 = **85.1 yards remaining**

## Common Yarn Buying Mistakes

**Buying by skein count instead of yardage.** A "worsted weight" skein can contain anywhere from 170 to 364 yards depending on brand. Always compare yardage, not skein count.

**Ignoring dye lots.** If you need 6 skeins, buy 7 from the same dye lot. Running out and finding that dye lot discontinued is a special kind of heartbreak.

**Skipping the gauge swatch.** Yes, it's boring. Yes, it takes 20 minutes. But it can save you $30 in yarn you didn't need. The [Gauge Calculator](https://fibertools.app/gauge-calculator) makes this painless.

**Forgetting about borders and finishing.** Budget an extra 10-15% for borders, edging, seaming, and weaving in ends.

## FAQ

**How many skeins do I need for a baby blanket?**
For a standard 30×36" baby blanket in worsted weight, plan for 4-6 skeins. Use the [Blanket Calculator](https://fibertools.app/blanket-calculator) for exact numbers.

**Does crochet use more yarn than knitting?**
Generally yes — crochet uses roughly 25-30% more yarn than knitting for the same project dimensions.

**How much extra yarn should I buy?**
Buy 10-15% more than calculated. For colorwork or stripes, add 15-20% per color.

**Can I substitute a different yarn weight?**
Yes, but it changes everything. Use the [Yarn Weight Chart](https://fibertools.app/yarn-weight-chart) to find compatible substitutions, then recalculate.

## Related Free Tools

- [Blanket Calculator](https://fibertools.app/blanket-calculator) — Exact stitch counts and yarn for every blanket size
- [Gauge Calculator](https://fibertools.app/gauge-calculator) — Measure your swatch and resize any pattern
- [Project Cost Calculator](https://fibertools.app/project-cost-calculator) — Know the true cost before you start
- [Yarn Weight Chart](https://fibertools.app/yarn-weight-chart) — Interactive weight reference with substitution checker

---

**[→ Calculate Your Yarn Now — Free at FiberTools.app](https://fibertools.app/yarn-calculator)**

*No login. No ads. No email required. Just math that works.*
BLOGEOF

cat > public/blog-posts/blanket-calculator.md << 'BLOGEOF'
---
title: "Crochet Blanket Size Calculator: Stitches, Rows & Yarn for Every Size"
description: "From baby blankets to king-size afghans — get the exact numbers before you chain one."
date: "2026-02-15"
tag: "Free Tool"
keywords: "crochet blanket size chart, how many chains for a baby blanket, blanket yarn calculator"
---

You found the perfect stitch pattern. You picked your yarn. But how many chains do you cast on for a throw? How many rows until it's 60 inches?

**[→ Use Our Free Blanket Calculator](https://fibertools.app/blanket-calculator)** — instant results, no login, works on your phone.

## Standard Blanket Sizes

| Blanket Type | Width | Length | Common Use |
|-------------|-------|--------|------------|
| Lovey / Security | 12" | 12" | Infant comfort blanket |
| Preemie | 18" | 24" | NICU / hospital donation |
| Baby / Receiving | 30" | 36" | Stroller, crib |
| Toddler / Crib | 36" | 52" | Toddler bed |
| Throw / Lap | 50" | 60" | Couch, armchair |
| Twin | 66" | 90" | Twin bed with drape |
| Full / Double | 80" | 90" | Full bed with drape |
| Queen | 90" | 100" | Queen bed with drape |
| King | 108" | 100" | King bed with drape |

**Pro tip:** If your blanket is a gift, go one size up. A throw-sized blanket (50×60") is the safest gift size — it works on any couch.

## How to Calculate Starting Chains

**Starting chains = (desired width × stitches per inch) + turning chain**

**Example:** 50" wide throw, gauge of 14 stitches per 4 inches
1. Stitches per inch: 14 ÷ 4 = 3.5
2. Total stitches: 50 × 3.5 = 175
3. Add turning chain: 175 + 3 (for dc) = **178 starting chains**

If your pattern uses a stitch multiple (like shells every 6 stitches), round to the nearest multiple after calculating.

## How to Calculate Rows

**Total rows = desired length ÷ row height**

Your row height comes from your gauge swatch. Use the [Gauge Calculator](https://fibertools.app/gauge-calculator) for precision.

## Yarn Estimates by Blanket Size

| Blanket Size | Approx. Yardage (worsted) | Skeins (200yd) |
|-------------|---------------------------|-----------------|
| Baby (30×36") | 1,000–1,400 | 5–7 |
| Toddler (36×52") | 1,800–2,400 | 9–12 |
| Throw (50×60") | 2,500–3,200 | 13–16 |
| Twin (66×90") | 4,500–5,800 | 23–29 |
| Queen (90×100") | 6,500–8,000 | 33–40 |
| King (108×100") | 8,000–10,000 | 40–50 |

For exact yarn calculations, use the [Yarn Calculator](https://fibertools.app/yarn-calculator).

## Tips for Giant Blankets

**Buy all your yarn at once.** Dye lots vary — even slight differences show up across a queen-size blanket.

**Use stitch markers every 25-50 stitches.** Miscounting row 1 of a king blanket means frogging 108 inches of chains.

**Consider modular construction.** Granny squares or strips let you work portably and join later. Our [Stitch Counter](https://fibertools.app/stitch-counter) can track individual sections.

## FAQ

**How many chains for a baby blanket?**
It depends on your gauge. With worsted weight at 14 stitches per 4 inches, you'd chain approximately 106 for a 30" wide baby blanket in dc. Use the [blanket calculator](https://fibertools.app/blanket-calculator) for your exact gauge.

**How long does it take to crochet a blanket?**
A baby blanket: 15-25 hours. A throw: 30-50 hours. A queen afghan: 80-120+ hours. Track your time with [MyCrochetKit](https://mycrochetkit.com).

**What's the best stitch for a beginner blanket?**
Half double crochet (hdc) — it's fast, creates good drape, has minimal curling, and uses a moderate amount of yarn.

## Related Free Tools

- [Yarn Calculator](https://fibertools.app/yarn-calculator) — How much yarn for any project
- [Gauge Calculator](https://fibertools.app/gauge-calculator) — Measure your swatch accurately
- [Stripe Generator](https://fibertools.app/stripe-generator) — Random stripe patterns with yardage
- [Stitch Counter](https://fibertools.app/stitch-counter) — Track rows in your browser

---

**[→ Calculate Your Blanket Now — Free at FiberTools.app](https://fibertools.app/blanket-calculator)**
BLOGEOF

cat > public/blog-posts/gauge-calculator.md << 'BLOGEOF'
---
title: "Gauge Swatch Calculator: Stop Guessing, Start Measuring"
description: "Your pattern says 18 stitches = 4 inches. You're getting 20. Now what?"
date: "2026-02-15"
tag: "Free Tool"
keywords: "gauge calculator knitting, crochet gauge swatch calculator, how to calculate gauge"
---

Gauge is the single most important number in any crochet or knitting project — and the one most crafters skip. A gauge swatch takes 15 minutes. Ripping out a too-small sweater takes an evening and your will to live.

**[→ Use Our Free Gauge Calculator](https://fibertools.app/gauge-calculator)**

## What Is Gauge?

Gauge (also called "tension" in UK patterns) is the number of stitches and rows you produce in 4 inches (10 cm). Two crocheters using identical yarn and hooks will almost never get the same gauge — your tension is personal.

**When gauge matters most:** Wearable garments, fitted items, projects where dimensions are critical.

**When gauge matters less:** Scarves, amigurumi (tighter is better), decorative items.

## How to Make a Gauge Swatch

1. **Chain enough for at least 6 inches** — edge stitches behave differently
2. **Work in the stitch pattern specified** — if the pattern says dc, swatch in dc
3. **Work at least 6 inches tall**
4. **Block your swatch** if your project will be blocked
5. **Let it rest 30+ minutes** before measuring

## When Your Gauge Is Off

**Too many stitches (swatch too small):** Go up one hook/needle size.

**Too few stitches (swatch too big):** Go down one hook/needle size.

**Close but not exact:** Within 0.5 stitches per 4 inches is acceptable for non-fitted items. For garments, keep adjusting.

## Resizing a Pattern to Your Gauge

**Scale factor = pattern gauge ÷ your gauge**

**Example:** Pattern gauge: 16 st/4" — Your gauge: 18 st/4"
If pattern says "chain 80": adjusted = 80 × (18 ÷ 16) = **90 chains**

The [Gauge Calculator](https://fibertools.app/gauge-calculator) does this math for you.

## FAQ

**Do I really need to swatch for a blanket?**
Gauge determines finished size. If your blanket gauge is off by 1 stitch per 4", a queen blanket could end up 6" too narrow.

**Can I use my project as the swatch?**
Yes — crochet the first few inches, measure, and adjust before committing to 200 rows.

**My stitch gauge matches but row gauge doesn't. What do I do?**
Match stitch gauge first. Row gauge can be adjusted by adding or subtracting rows.

## Related Free Tools

- [Yarn Calculator](https://fibertools.app/yarn-calculator) — Convert gauge into accurate yardage
- [Needle Converter](https://fibertools.app/needle-converter) — Find the right hook when sizing up/down
- [Blanket Calculator](https://fibertools.app/blanket-calculator) — Gauge-based stitch counts
- [Inc/Dec Calculator](https://fibertools.app/increase-decrease-calculator) — Space shaping evenly after resizing

---

**[→ Calculate Your Gauge Now — Free at FiberTools.app](https://fibertools.app/gauge-calculator)**
BLOGEOF

cat > public/blog-posts/needle-converter.md << 'BLOGEOF'
---
title: "Crochet Hook & Knitting Needle Size Conversion Chart (Free Tool)"
description: "US, UK, metric, and Japanese sizes — all in one place."
date: "2026-02-15"
tag: "Free Tool"
keywords: "crochet hook size chart, knitting needle conversion chart, us to metric hook sizes"
---

You bought a pattern from a UK designer. It calls for a 4.00mm hook. Your hooks are labeled in US sizes. What's the US equivalent?

**[→ Use Our Free Needle & Hook Converter](https://fibertools.app/needle-converter)** — instant conversion between US, UK, metric, and Japanese sizes.

## Crochet Hook Size Chart

| Metric (mm) | US Size | UK/Canadian |
|-------------|---------|-------------|
| 2.25 | B/1 | 13 |
| 2.75 | C/2 | 12 |
| 3.25 | D/3 | 10 |
| 3.50 | E/4 | 9 |
| 3.75 | F/5 | — |
| 4.00 | G/6 | 8 |
| 4.50 | 7 | 7 |
| 5.00 | H/8 | 6 |
| 5.50 | I/9 | 5 |
| 6.00 | J/10 | 4 |
| 6.50 | K/10½ | 3 |
| 8.00 | L/11 | — |
| 9.00 | M-N/13 | — |
| 10.00 | N-P/15 | — |

## Why Metric Is Most Reliable

US letter/number sizing isn't standardized — a "G hook" from one brand may be 4.00mm while another is 4.25mm. **Always go by the millimeter measurement.** If your hook doesn't have mm printed on it, use a hook gauge tool or check with our [converter](https://fibertools.app/needle-converter).

## Recommended Hook Size by Yarn Weight

| Yarn Weight | Recommended Hook |
|------------|-----------------|
| #0 Lace | 1.5–2.25mm (Steel 7–B/1) |
| #1 Fingering | 2.25–3.25mm (B/1–D/3) |
| #2 Sport | 3.25–3.75mm (D/3–F/5) |
| #3 DK | 3.75–4.50mm (F/5–7) |
| #4 Worsted | 4.50–5.50mm (7–I/9) |
| #5 Bulky | 5.50–6.50mm (I/9–K/10½) |
| #6 Super Bulky | 6.50–9.00mm (K/10½–M/13) |
| #7 Jumbo | 9.00mm+ (M/13+) |

## Tunisian Hooks

Tunisian crochet hooks are typically 2-3mm larger than standard crochet hooks for the same yarn weight. A worsted project that uses a 5.00mm regular hook would use a 7.00-8.00mm Tunisian hook.

## FAQ

**My hook has no size marking. How do I identify it?**
Use a hook gauge (a flat card with holes). Insert the hook — the hole it fits snugly into is your size. Or measure the shaft diameter with calipers.

**Are Japanese and US sizes the same?**
No. Japanese sizes use a different numbering system. Use the [converter](https://fibertools.app/needle-converter) to translate.

## Related Free Tools

- [Gauge Calculator](https://fibertools.app/gauge-calculator) — Check if you need to size up or down
- [Yarn Weight Chart](https://fibertools.app/yarn-weight-chart) — Match hooks to yarn weights
- [Abbreviation Glossary](https://fibertools.app/abbreviation-glossary) — Decode any pattern term

---

**[→ Convert Hook & Needle Sizes — Free at FiberTools.app](https://fibertools.app/needle-converter)**
BLOGEOF

cat > public/blog-posts/stitch-counter.md << 'BLOGEOF'
---
title: "Free Online Stitch Counter — No App Download Required"
description: "Count rows in your browser. Multiple counters. Works offline. Zero friction."
date: "2026-02-15"
tag: "Free Tool"
keywords: "free stitch counter online, row counter crochet free, digital stitch counter no download"
---

You don't need another app on your phone. You need a counter that works.

**[→ Use Our Free Stitch Counter](https://fibertools.app/stitch-counter)** — tap to count, works offline, no account needed.

## What You Get

- Multiple counters running simultaneously
- Row reminders at specific counts
- Works offline (even in airplane mode)
- No login, no account, no email
- Tap anywhere to increment

## When to Upgrade to Voice Counting

The free counter at FiberTools works great for quick projects. But if you're tired of stopping to tap your screen, **[MyCrochetKit](https://mycrochetkit.com)** offers voice-activated counting — just say "next" to count up, hands-free. It also syncs across devices and tracks multiple projects.

## Tips for Not Losing Count

**Use stitch markers every 10-25 stitches.** Even with a digital counter, physical markers let you verify your count without recounting the entire row.

**Count in groups.** Instead of counting 1-2-3...175, count groups of 10. It's faster and you catch mistakes sooner.

**Mark your right side.** Put a removable stitch marker on the front of your work. When it faces you, you know which side you're on.

## Physical vs Digital Counters

| Feature | Physical Counter | FiberTools Counter | MyCrochetKit |
|---------|-----------------|-------------------|--------------|
| Price | $3-15 | Free | Free |
| Multiple counters | No | Yes | Yes |
| Voice counting | No | No | Yes |
| Row reminders | No | Yes | Yes |
| Cloud sync | No | No | Yes |
| Battery needed | Yes | No | No |
| Can lose it | Yes | No | No |

## FAQ

**Can I use this on my phone?**
Yes — it's a web app that works in any browser. Bookmark it for easy access.

**Does it save my count if I close the browser?**
Yes — your count is saved locally. For cloud backup across devices, use [MyCrochetKit](https://mycrochetkit.com).

## Related Free Tools

- [Gauge Calculator](https://fibertools.app/gauge-calculator) — Know your stitch count before starting
- [Blanket Calculator](https://fibertools.app/blanket-calculator) — How many rows for your blanket
- [Abbreviation Glossary](https://fibertools.app/abbreviation-glossary) — Decode pattern instructions
- [Inc/Dec Calculator](https://fibertools.app/increase-decrease-calculator) — Space shaping evenly

---

**[→ Start Counting — Free at FiberTools.app](https://fibertools.app/stitch-counter)**
BLOGEOF

cat > public/blog-posts/project-cost-calculator.md << 'BLOGEOF'
---
title: "How Much Does It Cost to Crochet a Blanket? (Free Calculator)"
description: "The real cost of handmade — materials, time, and why you should never feel bad about the price."
date: "2026-02-15"
tag: "Free Tool"
keywords: "cost to crochet a blanket, crochet project cost calculator, how to price handmade crochet"
---

"Why don't you sell those?"

Every crocheter has heard it. Here's why the answer is complicated.

**[→ Use Our Free Cost Calculator](https://fibertools.app/project-cost-calculator)**

## The Real Cost of a Handmade Throw Blanket

| Cost Component | Amount |
|---------------|--------|
| Yarn (8 skeins worsted @ $9.50) | $76.00 |
| Hook, markers, extras | ~$5.00 |
| Your time (35-50 hours @ $15/hr) | $525–750 |
| **True cost** | **$606–831** |

That $40 blanket at Target isn't your competition. You're making something machine production literally cannot replicate.

## Cost by Project Type

| Project | Materials | Time (hrs) | True Cost |
|---------|-----------|-----------|-----------|
| Baby blanket | $30-60 | 15-25 | $255-435 |
| Throw blanket | $60-100 | 35-50 | $585-850 |
| Adult sweater | $40-90 | 30-60 | $490-990 |
| Amigurumi (small) | $5-15 | 3-8 | $50-135 |
| Pair of socks | $15-25 | 15-25 | $240-400 |
| Beanie | $8-15 | 4-8 | $68-135 |

## Pricing Formula for Selling

**Materials × 2 + (Time × hourly rate) + overhead = minimum price**

Most sellers undercharge because they don't count their time. The [Cost Calculator](https://fibertools.app/project-cost-calculator) makes this math transparent.

## Tips for Reducing Costs

- **Buy during sales.** Joann's and Michael's run 40-50% off yarn sales regularly
- **Use coupons strategically.** Stack manufacturer coupons with store sales
- **Buy in bulk for large projects.** Price per yard drops significantly
- **Consider yarn substitution.** The [Yarn Weight Chart](https://fibertools.app/yarn-weight-chart) helps find budget alternatives

## FAQ

**Is crocheting cheaper than buying?**
For materials only, sometimes yes. For materials + time, almost never. But you're not paying for a product — you're paying for the experience and a unique handmade item.

**How do I price custom orders?**
Never price below materials × 2 + minimum wage × hours. Use our calculator to get exact numbers before quoting.

## Related Free Tools

- [Yarn Calculator](https://fibertools.app/yarn-calculator) — Know exactly how much yarn you need
- [Blanket Calculator](https://fibertools.app/blanket-calculator) — Size and yarn for any blanket
- [Yarn Weight Chart](https://fibertools.app/yarn-weight-chart) — Find budget yarn substitutions
- [Stitch Counter](https://fibertools.app/stitch-counter) — Track progress for time estimates

---

**[→ Calculate Your Project Cost — Free at FiberTools.app](https://fibertools.app/project-cost-calculator)**
BLOGEOF

cat > public/blog-posts/yarn-weight-chart.md << 'BLOGEOF'
---
title: "Yarn Weight Guide: What Weight Is My Yarn? (Interactive Chart)"
description: "CYC categories, WPI method, substitution rules, and when holding double works."
date: "2026-02-15"
tag: "Free Tool"
keywords: "yarn weight chart, yarn weight comparison, what weight is my yarn, yarn substitution guide"
---

You found unlabeled yarn at a thrift store. Or the label faded. Or it's from your grandmother's stash. What weight is it?

**[→ Use Our Interactive Yarn Weight Chart](https://fibertools.app/yarn-weight-chart)** — identify any yarn and find substitutions.

## The CYC Yarn Weight System

| # | Name | WPI | Gauge (st/4") | Hook | Needle |
|---|------|-----|---------------|------|--------|
| 0 | Lace | 30+ | 32-42 | 1.5-2.25mm | 1.5-2.25mm |
| 1 | Fingering | 19-22 | 27-32 | 2.25-3.25mm | 2.25-3.25mm |
| 2 | Sport | 15-18 | 23-26 | 3.25-3.75mm | 3.25-3.75mm |
| 3 | DK | 12-14 | 21-24 | 3.75-4.50mm | 3.75-4.50mm |
| 4 | Worsted | 9-11 | 16-20 | 4.50-5.50mm | 4.50-5.50mm |
| 5 | Bulky | 7-8 | 12-15 | 5.50-6.50mm | 5.50-6.50mm |
| 6 | Super Bulky | 5-6 | 7-11 | 6.50-9mm | 6.50-9mm |
| 7 | Jumbo | 1-4 | 6 or fewer | 9mm+ | 9mm+ |

## The WPI Method (Wraps Per Inch)

No label? Wrap yarn around a ruler:
1. Wrap snugly but don't stretch
2. Wraps should touch but not overlap
3. Count wraps in one inch
4. Match to the WPI column above

## Substitution Rules

**Same weight category = usually safe.** A DK for a DK works in most cases.

**Going up or down one weight = possible with hook adjustment.** Use the [Gauge Calculator](https://fibertools.app/gauge-calculator) to verify.

**Fiber content matters.** Cotton has no stretch; substituting cotton for wool changes drape significantly.

## Holding Double

Two strands of a lighter weight can substitute for a heavier weight:
- 2 strands fingering ≈ sport/DK
- 2 strands sport ≈ worsted
- 2 strands DK ≈ bulky

## FAQ

**What's the most versatile yarn weight?**
Worsted (#4). It works for blankets, garments, amigurumi, accessories — everything.

**Is "medium" the same as worsted?**
Yes. "Medium" is the CYC category label for #4 weight yarn.

## Related Free Tools

- [Yarn Calculator](https://fibertools.app/yarn-calculator) — Yardage estimates by weight
- [Needle Converter](https://fibertools.app/needle-converter) — Match hooks to yarn weight
- [Gauge Calculator](https://fibertools.app/gauge-calculator) — Verify substitutions with a swatch

---

**[→ Check Yarn Weights — Free at FiberTools.app](https://fibertools.app/yarn-weight-chart)**
BLOGEOF

cat > public/blog-posts/increase-decrease-calculator.md << 'BLOGEOF'
---
title: "How to Evenly Space Increases and Decreases (Free Calculator)"
description: "The math nobody wants to do — now done for you."
date: "2026-02-15"
tag: "Free Tool"
keywords: "evenly distribute increases crochet, decrease calculator knitting, spacing decreases evenly"
---

Your pattern says "decrease 8 stitches evenly across." You have 96 stitches. Where exactly do you put those decreases?

**[→ Use Our Free Inc/Dec Calculator](https://fibertools.app/increase-decrease-calculator)** — get stitch-by-stitch instructions instantly.

## The Formula

**Spacing = total stitches ÷ number of changes**

With 96 stitches and 8 decreases: 96 ÷ 8 = every 12th stitch.

But what if it doesn't divide evenly? That's where it gets complicated — and where the calculator saves you.

## Handling Remainders

If you have 100 stitches and need 7 decreases: 100 ÷ 7 = 14.28... That doesn't work.

The calculator distributes the remainder across the row so the spacing looks even to the eye. You'd get instructions like: "dec 1, work 14, dec 1, work 14, dec 1, work 14, dec 1, work 15..." with the extra stitches spread across the last few sections.

## Common Shaping Scenarios

| Shaping | Typical Use |
|---------|------------|
| Decrease evenly across | Hat crown, sleeve cap, waist shaping |
| Increase evenly across | Yoke expansion, skirt flare, bottom ribbing to body |
| Decrease every X rows | Raglan sleeve, tapered body |
| Increase every X rows | A-line skirt, flared sleeve |

## FAQ

**Should I place shaping at the start/end of the row or distribute it?**
Depends on the pattern. For invisible shaping (like adjusting stitch count between sections), distribute evenly. For decorative shaping (raglan lines), place at specific points.

## Related Free Tools

- [Gauge Calculator](https://fibertools.app/gauge-calculator) — Calculate exact stitch counts
- [Blanket Calculator](https://fibertools.app/blanket-calculator) — Stitch counts for any size
- [Yarn Calculator](https://fibertools.app/yarn-calculator) — Yardage after resizing

---

**[→ Calculate Your Shaping — Free at FiberTools.app](https://fibertools.app/increase-decrease-calculator)**
BLOGEOF

cat > public/blog-posts/abbreviation-glossary.md << 'BLOGEOF'
---
title: "Crochet & Knitting Abbreviations: The Complete Searchable Guide"
description: "What does dc mean? What's the difference between US and UK terms? Every abbreviation, decoded."
date: "2026-02-15"
tag: "Free Tool"
keywords: "crochet abbreviations list, knitting abbreviations chart, what does dc mean in crochet, us vs uk crochet terms"
---

You're reading a pattern and it says "sc2tog, ch 1, sk 1, dc in next." If you're a beginner, that looks like someone fell asleep on their keyboard.

**[→ Use Our Searchable Abbreviation Glossary](https://fibertools.app/abbreviation-glossary)** — type any abbreviation, get the full term and description.

## The US vs UK Problem

This is the single biggest source of confusion in crochet. **The same abbreviation means different stitches in US and UK patterns.**

| US Term | US Abbr | UK Term | UK Abbr |
|---------|---------|---------|---------|
| Single crochet | sc | Double crochet | dc |
| Half double crochet | hdc | Half treble | htr |
| Double crochet | dc | Treble | tr |
| Treble | tr | Double treble | dtr |

**US single crochet = UK double crochet.** If you use a UK pattern with US terminology, every stitch is one height too tall. Your project will be completely wrong.

Always check whether your pattern uses US or UK terms. Most modern patterns state this at the top.

## Most Common Crochet Abbreviations

| Abbr | Meaning |
|------|---------|
| ch | chain |
| sl st | slip stitch |
| sc | single crochet |
| hdc | half double crochet |
| dc | double crochet |
| tr | treble crochet |
| sk | skip |
| sp | space |
| st(s) | stitch(es) |
| yo | yarn over |
| tog | together |
| inc | increase |
| dec | decrease |
| RS | right side |
| WS | wrong side |
| rep | repeat |
| FO | fasten off |

## FAQ

**What does "sc2tog" mean?**
Single crochet two together — it's a decrease. Insert hook in next stitch, pull up a loop, insert in following stitch, pull up a loop, yarn over and pull through all 3 loops.

**What's the difference between "turn" and "do not turn"?**
"Turn" means flip your work to crochet back across. "Do not turn" means continue in the same direction (working in rounds or in the same direction).

## Related Free Tools

- [Needle Converter](https://fibertools.app/needle-converter) — Convert hook sizes between systems
- [Stitch Counter](https://fibertools.app/stitch-counter) — Track your rows
- [Yarn Weight Chart](https://fibertools.app/yarn-weight-chart) — Identify yarn types

---

**[→ Search All Abbreviations — Free at FiberTools.app](https://fibertools.app/abbreviation-glossary)**
BLOGEOF

cat > public/blog-posts/stripe-generator.md << 'BLOGEOF'
---
title: "Random Stripe Pattern Generator for Stash-Busting Projects"
description: "Turn leftover yarn into beautiful stripe patterns with per-color yardage estimates."
date: "2026-02-15"
tag: "Free Tool"
keywords: "random stripe generator crochet, crochet stripe pattern maker, stash buster stripe calculator"
---

You have 14 partial skeins in a bin. You want to make something with them. But what stripe pattern won't look like a disaster?

**[→ Use Our Free Stripe Generator](https://fibertools.app/stripe-generator)** — random, weighted, or structured patterns with yardage breakdown.

## Modes

**Random stripes** — Every color gets equal random placement. Great for true stash-busting.

**Weighted stripes** — Colors you have more of appear more often. Matches your actual stash quantities.

**Structured patterns** — Fibonacci sequences, gradients, or repeating blocks with mathematical precision.

## Temperature Blanket Mode

Assign colors to temperature ranges and generate a full year's stripe pattern from weather data. Each row = one day.

## Per-Color Yardage Estimates

The generator calculates how much of each color you'll need based on your gauge and blanket dimensions. No more running out of the accent color on month 11.

## Scrap-Buster Tips

**Stick to one yarn weight.** Mixed weights create uneven fabric. If you must mix, go up a hook size for thinner yarns.

**Limit your palette to 4-6 colors.** More than that looks chaotic unless you're intentionally going for a scrappy look.

**Use a neutral between bright colors.** A row of cream or gray between bold colors makes everything look intentional.

## Related Free Tools

- [Yarn Calculator](https://fibertools.app/yarn-calculator) — Yardage for each color
- [Blanket Calculator](https://fibertools.app/blanket-calculator) — Size your stripe blanket
- [Color Pooling Calculator](https://fibertools.app/color-pooling-calculator) — Turn variegated yarn into argyle
- [Yarn Weight Chart](https://fibertools.app/yarn-weight-chart) — Match weights across your stash

---

**[→ Generate Your Stripe Pattern — Free at FiberTools.app](https://fibertools.app/stripe-generator)**
BLOGEOF

cat > public/blog-posts/color-pooling-calculator.md << 'BLOGEOF'
---
title: "Color Pooling Calculator: Turn Variegated Yarn Into Argyle"
description: "That random-looking yarn can make perfect argyle. You just need the right stitch count."
date: "2026-02-15"
tag: "Free Tool"
keywords: "color pooling stitch count, planned pooling calculator, variegated yarn pooling"
---

Color pooling looks like magic, but it's just math. The key: your stitch count must match the yarn's color repeat length.

**[→ Use Our Free Color Pooling Calculator](https://fibertools.app/color-pooling-calculator)**

## How Pooling Works

Variegated yarn has a repeating color sequence. If you crochet with exactly the right number of stitches per row, each color lands in the same column every time — creating argyle, plaid, or stripe effects.

## The Technique

1. Count the color sections in one repeat of your yarn
2. Use moss stitch (sc, ch1, skip 1) for best results
3. Adjust your stitch count until colors align vertically
4. The calculator does this math for you

## Best Yarn for Pooling

- **Long, regular color sections** work best
- Yarns with 4-6 colors per repeat are ideal
- Short color changes create messy results
- Red Heart Super Saver and Caron Simply Soft have popular pooling colorways

## FAQ

**Why isn't my pooling working?**
Your stitch count is likely off by 1-2. Even one stitch difference breaks the pattern. Use the calculator and swatch first.

**Does it work with knitting?**
Yes, but the stitch count will be different than crochet. Recalculate for your knitting gauge.

## Related Free Tools

- [Stripe Generator](https://fibertools.app/stripe-generator) — Alternative stripe patterns
- [Gauge Calculator](https://fibertools.app/gauge-calculator) — Dial in your exact stitch count
- [Stitch Counter](https://fibertools.app/stitch-counter) — Track rows while pooling

---

**[→ Calculate Your Pooling — Free at FiberTools.app](https://fibertools.app/color-pooling-calculator)**
BLOGEOF

cat > public/blog-posts/spinning-calculator.md << 'BLOGEOF'
---
title: "Handspinning Calculator: Drive Ratios, TPI & Plying Made Easy"
description: "The only free online calculator built specifically for handspinners."
date: "2026-02-15"
tag: "Free Tool"
keywords: "spinning calculator drive ratio, twists per inch calculator, plying ratio calculator"
---

Handspinning math shouldn't require a spreadsheet. But until now, it kind of did.

**[→ Use Our Free Spinning Calculator](https://fibertools.app/spinning-ratio-calculator)** — the only free online tool for handspinners.

## Drive Ratio by Yarn Type

| Target Yarn | Drive Ratio | TPI Range |
|------------|-------------|-----------|
| Bulky | 4:1–6:1 | 2–4 |
| Worsted | 6:1–8:1 | 4–6 |
| Sport/DK | 8:1–12:1 | 6–10 |
| Fingering | 10:1–14:1 | 10–14 |
| Lace | 14:1–20:1 | 14–20+ |

## TPI Calculator

Twists per inch determines your yarn's characteristics. More twist = stronger, thinner, more energized yarn. Less twist = softer, loftier, more fragile.

## Plying Ratios

When plying, spin your singles with 10-15% more twist than your target. The plying process removes some twist. A good starting ratio: if your singles have 8 TPI, ply with 5-6 TPI in the opposite direction.

## FAQ

**What ratio should I start with as a beginner?**
Start at 6:1–8:1 for worsted weight. It's forgiving and produces usable yarn quickly.

**My yarn is over-twisted. What went wrong?**
Too many treadles per draft, or your draft length is too short. Slow down the treadling or pull more fiber per draft.

## Related Free Tools

- [Yarn Weight Chart](https://fibertools.app/yarn-weight-chart) — Classify your handspun
- [Yarn Calculator](https://fibertools.app/yarn-calculator) — Estimate yardage for projects
- [Gauge Calculator](https://fibertools.app/gauge-calculator) — Swatch your handspun before committing

---

**[→ Calculate Your Spinning — Free at FiberTools.app](https://fibertools.app/spinning-ratio-calculator)**
BLOGEOF

cat > public/blog-posts/cross-stitch-calculator.md << 'BLOGEOF'
---
title: "Cross Stitch Fabric Calculator: Finished Size & Thread Estimates"
description: "Will your pattern fit the frame? Calculate finished dimensions for any fabric count."
date: "2026-02-15"
tag: "Free Tool"
keywords: "cross stitch size calculator, aida cloth calculator, cross stitch dimensions calculator"
---

Your pattern is 150 × 200 stitches. On 14-count Aida, how big will it be? Will it fit that frame you already bought?

**[→ Use Our Free Cross Stitch Calculator](https://fibertools.app/cross-stitch-calculator)**

## Fabric Count Affects Size

| Fabric Count | Stitches/inch | 150×200 pattern size |
|-------------|---------------|---------------------|
| 11-count Aida | 11 | 13.6" × 18.2" |
| 14-count Aida | 14 | 10.7" × 14.3" |
| 16-count Aida | 16 | 9.4" × 12.5" |
| 18-count Aida | 18 | 8.3" × 11.1" |
| 28-count linen (over 2) | 14 | 10.7" × 14.3" |
| 32-count linen (over 2) | 16 | 9.4" × 12.5" |

## Don't Forget Margins

Add 3-4 inches to each side for framing. A 10.7" × 14.3" finished piece needs fabric cut to at least 17" × 21".

## Thread Estimation

The calculator estimates thread amounts per color based on stitch count. For full coverage pieces, expect roughly 1 skein of DMC floss per 500-700 stitches of that color.

## FAQ

**What count is best for beginners?**
14-count Aida. The holes are visible enough to count easily, and the finished size is manageable.

**Can I stitch over 1 on evenweave instead of over 2?**
Yes, but it doubles the count — stitching over 1 on 28-count makes it behave like 28-count, not 14-count.

## Related Free Tools

- [Thread Converter](https://fibertools.app/thread-converter) — DMC to Anchor to Cosmo
- [Stitch Counter](https://fibertools.app/stitch-counter) — Track your progress

---

**[→ Calculate Your Cross Stitch — Free at FiberTools.app](https://fibertools.app/cross-stitch-calculator)**
BLOGEOF

cat > public/blog-posts/weaving-sett-calculator.md << 'BLOGEOF'
---
title: "Weaving Sett Calculator: Find the Perfect EPI for Your Project"
description: "WPI to EPI conversion, warp length formulas, and reed substitution — all in one tool."
date: "2026-02-15"
tag: "Free Tool"
keywords: "weaving sett calculator, epi calculator weaving, warp calculator free"
---

You measured your yarn at 12 WPI. What sett do you use for plain weave? For twill? How much warp do you need?

**[→ Use Our Free Weaving Sett Calculator](https://fibertools.app/weaving-sett-calculator)**

## WPI to EPI by Weave Structure

| Weave Structure | EPI Formula | 12 WPI Example |
|----------------|-------------|-----------------|
| Plain weave | WPI ÷ 2 | 6 EPI |
| Twill 2/2 | WPI × 2/3 | 8 EPI |
| Twill 3/1 | WPI × 3/4 | 9 EPI |
| Satin | WPI × 3/4 to 5/6 | 9-10 EPI |

## Warp Length Formula

**Total warp length = finished length + fringe (both ends) + shrinkage + loom waste + sampling**

Typical loom waste: 20-30 inches. Shrinkage: 10-15%. Always add sampling length for testing your sett.

## Reed Substitution

Don't have the exact reed? The calculator suggests alternatives. An 8-dent reed can produce 4, 8, 12, or 16 EPI by changing how many ends per dent.

## FAQ

**What if I don't know my WPI?**
Wrap yarn around a ruler snugly. Count wraps per inch. That's your WPI.

**My fabric is too stiff / too loose. What do I adjust?**
Too stiff = sett is too high, reduce EPI. Too loose = sett is too low, increase EPI. Weave a sample first.

## Related Free Tools

- [Yarn Weight Chart](https://fibertools.app/yarn-weight-chart) — Identify your yarn weight
- [Spinning Calculator](https://fibertools.app/spinning-ratio-calculator) — For handspun warp/weft
- [Yarn Calculator](https://fibertools.app/yarn-calculator) — Total yardage needs

---

**[→ Calculate Your Sett — Free at FiberTools.app](https://fibertools.app/weaving-sett-calculator)**
BLOGEOF

cat > public/blog-posts/thread-converter.md << 'BLOGEOF'
---
title: "Embroidery Thread Conversion Chart: DMC to Anchor to Cosmo"
description: "Instantly convert between DMC, Anchor, Cosmo, and Sulky thread numbers."
date: "2026-02-15"
tag: "Free Tool"
keywords: "dmc to anchor conversion, thread conversion chart, embroidery floss converter"
---

Your pattern calls for DMC 3801. You only have Anchor. What's the equivalent?

**[→ Use Our Free Thread Converter](https://fibertools.app/thread-converter)** — instant conversion between DMC, Anchor, Cosmo, and Sulky.

## Why Conversions Are Approximate

No two brands dye exactly the same color. Conversions are based on the closest visual match, not an exact color formula. For critical color matching, buy a skein and compare in person.

**Same-brand is always better.** If your pattern specifies DMC, use DMC. Convert only when a specific color is unavailable in your preferred brand.

## Most Commonly Converted Colors

| DMC | Anchor | Cosmo | Color |
|-----|--------|-------|-------|
| 310 | 403 | 600 | Black |
| blanc | 2 | 100 | White |
| 321 | 47 | 346 | Red |
| 815 | 44 | 245 | Dark Garnet |
| 3799 | 236 | 895 | Very Dark Pewter Gray |
| 436 | 363 | 367 | Tan |

## FAQ

**Can I mix brands in the same project?**
Yes, but slight color differences may be visible side by side. Test first.

**DMC vs Anchor — which is better?**
Neither. Both are high quality. DMC has slightly more color options; Anchor is sometimes easier to find in certain countries.

## Related Free Tools

- [Cross Stitch Calculator](https://fibertools.app/cross-stitch-calculator) — Finished size and thread amounts
- [Abbreviation Glossary](https://fibertools.app/abbreviation-glossary) — Pattern term reference

---

**[→ Convert Thread Colors — Free at FiberTools.app](https://fibertools.app/thread-converter)**
BLOGEOF

echo "  ✅ All 15 blog post markdown files created in public/blog-posts/"

# ============================================================
# Step 4: Create the generic blog post renderer
# ============================================================
echo ""
echo "🧶 Step 4: Creating blog post renderer component..."

cat > src/pages/blog/FiberToolsBlogPost.tsx << 'COMPONENTEOF'
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogMeta {
  title: string;
  description: string;
  date: string;
  tag: string;
  keywords: string;
}

function parseFrontmatter(content: string): { meta: BlogMeta; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: { title: '', description: '', date: '', tag: '', keywords: '' }, body: content };

  const frontmatter = match[1];
  const body = match[2];
  const meta: Record<string, string> = {};

  frontmatter.split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      meta[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
    }
  });

  return { meta: meta as unknown as BlogMeta, body };
}

const BLOG_POSTS: Record<string, string> = {
  'yarn-calculator': 'yarn-calculator.md',
  'blanket-calculator': 'blanket-calculator.md',
  'gauge-calculator': 'gauge-calculator.md',
  'needle-converter': 'needle-converter.md',
  'stitch-counter': 'stitch-counter.md',
  'project-cost-calculator': 'project-cost-calculator.md',
  'yarn-weight-chart': 'yarn-weight-chart.md',
  'increase-decrease-calculator': 'increase-decrease-calculator.md',
  'abbreviation-glossary': 'abbreviation-glossary.md',
  'stripe-generator': 'stripe-generator.md',
  'color-pooling-calculator': 'color-pooling-calculator.md',
  'spinning-calculator': 'spinning-calculator.md',
  'cross-stitch-calculator': 'cross-stitch-calculator.md',
  'weaving-sett-calculator': 'weaving-sett-calculator.md',
  'thread-converter': 'thread-converter.md',
};

export const BLOG_POST_SLUGS = Object.keys(BLOG_POSTS);

export default function FiberToolsBlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState('');
  const [meta, setMeta] = useState<BlogMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug || !BLOG_POSTS[slug]) {
      setLoading(false);
      return;
    }

    fetch(`/blog-posts/${BLOG_POSTS[slug]}`)
      .then(res => res.text())
      .then(text => {
        const { meta, body } = parseFrontmatter(text);
        setMeta(meta);
        setContent(body);
        setLoading(false);

        // Update page title for SEO
        if (meta.title) document.title = `${meta.title} | MyCrochetKit`;
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <p className="text-[#8B7355]">Loading...</p>
      </div>
    );
  }

  if (!slug || !BLOG_POSTS[slug] || !meta) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-6">
        <p className="text-2xl font-bold text-[#2C1810] mb-4">Post not found</p>
        <Link to="/blog" className="text-amber-700 underline">← Back to blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* SEO meta tags */}
      {meta.description && (
        <meta name="description" content={meta.description} />
      )}

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm">
          <Link to="/" className="text-[#8B7355] hover:text-amber-700">Home</Link>
          <span className="text-[#8B7355] mx-2">/</span>
          <Link to="/blog" className="text-[#8B7355] hover:text-amber-700">Blog</Link>
          <span className="text-[#8B7355] mx-2">/</span>
          <span className="text-amber-700">{meta.tag || 'Guide'}</span>
        </div>

        {/* Tag + Date */}
        <div className="mb-6">
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {meta.tag || 'Guide'}
          </span>
          <span className="text-sm text-[#8B7355] ml-3">{meta.date}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#2C1810] mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
          {meta.title}
        </h1>

        {/* Subtitle */}
        {meta.description && (
          <p className="text-lg text-[#8B7355] italic mb-8 leading-relaxed">
            {meta.description}
          </p>
        )}

        {/* Markdown Content */}
        <article className="prose prose-amber max-w-none
          prose-headings:font-bold prose-headings:text-[#2C1810]
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-[#2C1810] prose-p:mb-4 prose-p:leading-relaxed
          prose-a:text-amber-700 prose-a:underline hover:prose-a:text-amber-800
          prose-strong:text-[#2C1810]
          prose-table:text-sm prose-th:bg-amber-50 prose-th:p-3 prose-th:text-left prose-th:font-bold prose-th:border prose-th:border-amber-200
          prose-td:p-3 prose-td:border prose-td:border-amber-200
          prose-li:text-[#2C1810]
          prose-code:bg-[#F5EDE3] prose-code:px-1 prose-code:rounded
          prose-blockquote:border-l-amber-400 prose-blockquote:bg-amber-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>

        {/* Back to blog */}
        <div className="mt-12 pt-8 border-t border-amber-200">
          <Link to="/blog" className="text-amber-700 hover:text-amber-800 font-medium">
            ← Back to all posts
          </Link>
        </div>
      </div>
    </div>
  );
}
COMPONENTEOF

echo "  ✅ FiberToolsBlogPost.tsx created"

# ============================================================
# Step 5: Create the blog index page for fibertools posts
# ============================================================
echo ""
echo "🧶 Step 5: Creating blog index additions..."

cat > src/pages/blog/FiberToolsBlogIndex.tsx << 'COMPONENTEOF'
import { Link } from 'react-router-dom';

const FIBERTOOLS_POSTS = [
  { slug: 'yarn-calculator', title: 'How Much Yarn Do I Need? Free Calculator + Complete Yardage Guide', tag: 'Free Tool', description: 'Stop guessing. Stop over-buying. Stop running out on row 247.' },
  { slug: 'blanket-calculator', title: 'Crochet Blanket Size Calculator: Stitches, Rows & Yarn for Every Size', tag: 'Free Tool', description: 'From baby blankets to king-size afghans.' },
  { slug: 'gauge-calculator', title: 'Gauge Swatch Calculator: Stop Guessing, Start Measuring', tag: 'Free Tool', description: 'Your pattern says 18 stitches = 4 inches. You're getting 20.' },
  { slug: 'needle-converter', title: 'Crochet Hook & Knitting Needle Size Conversion Chart', tag: 'Free Tool', description: 'US, UK, metric, and Japanese sizes in one place.' },
  { slug: 'stitch-counter', title: 'Free Online Stitch Counter — No App Download Required', tag: 'Free Tool', description: 'Count rows in your browser. Multiple counters. Works offline.' },
  { slug: 'project-cost-calculator', title: 'How Much Does It Cost to Crochet a Blanket?', tag: 'Free Tool', description: 'The real cost of handmade — materials, time, and pricing.' },
  { slug: 'yarn-weight-chart', title: 'Yarn Weight Guide: What Weight Is My Yarn?', tag: 'Free Tool', description: 'CYC categories, WPI method, and substitution rules.' },
  { slug: 'increase-decrease-calculator', title: 'How to Evenly Space Increases and Decreases', tag: 'Free Tool', description: 'The math nobody wants to do — done for you.' },
  { slug: 'abbreviation-glossary', title: 'Crochet & Knitting Abbreviations: Complete Guide', tag: 'Free Tool', description: 'Every abbreviation decoded. US vs UK terms explained.' },
  { slug: 'stripe-generator', title: 'Random Stripe Pattern Generator for Stash-Busting', tag: 'Free Tool', description: 'Turn leftover yarn into beautiful stripe patterns.' },
  { slug: 'color-pooling-calculator', title: 'Color Pooling Calculator: Variegated Yarn Into Argyle', tag: 'Free Tool', description: 'Find the exact stitch count for perfect pooling.' },
  { slug: 'spinning-calculator', title: 'Handspinning Calculator: Drive Ratios, TPI & Plying', tag: 'Free Tool', description: 'The only free online tool for handspinners.' },
  { slug: 'cross-stitch-calculator', title: 'Cross Stitch Fabric Calculator: Finished Size & Thread', tag: 'Free Tool', description: 'Calculate finished dimensions for any fabric count.' },
  { slug: 'weaving-sett-calculator', title: 'Weaving Sett Calculator: Find the Perfect EPI', tag: 'Free Tool', description: 'WPI to EPI conversion and warp length formulas.' },
  { slug: 'thread-converter', title: 'Embroidery Thread Conversion: DMC to Anchor to Cosmo', tag: 'Free Tool', description: 'Instant conversion between thread brands.' },
];

export default function FiberToolsBlogIndex() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#2C1810] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Free Fiber Arts Tools & Guides
        </h1>
        <p className="text-[#8B7355] mb-8">
          Calculators, converters, and reference guides for knitters, crocheters, weavers, spinners, and embroiderers.
        </p>

        <div className="grid gap-4">
          {FIBERTOOLS_POSTS.map(post => (
            <Link
              key={post.slug}
              to={`/blog/tools/${post.slug}`}
              className="block bg-white border border-amber-200 rounded-xl p-5 hover:border-amber-400 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {post.tag}
                  </span>
                  <h2 className="text-lg font-bold text-[#2C1810] mt-2">{post.title}</h2>
                  <p className="text-sm text-[#8B7355] mt-1">{post.description}</p>
                </div>
                <span className="text-amber-600 text-xl shrink-0">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
COMPONENTEOF

echo "  ✅ FiberToolsBlogIndex.tsx created"

# ============================================================
# Step 6: Print route additions needed in App.tsx
# ============================================================
echo ""
echo "============================================================"
echo "🧶 Step 6: ADD THESE TO YOUR App.tsx (or router file)"
echo "============================================================"
echo ""
echo "Add these imports at the top:"
echo ""
echo '  import FiberToolsBlogPost from "./pages/blog/FiberToolsBlogPost";'
echo '  import FiberToolsBlogIndex from "./pages/blog/FiberToolsBlogIndex";'
echo ""
echo "Add these routes (inside your <Routes>):"
echo ""
echo '  <Route path="/blog/tools" element={<FiberToolsBlogIndex />} />'
echo '  <Route path="/blog/tools/:slug" element={<FiberToolsBlogPost />} />'
echo ""
echo "============================================================"

# ============================================================
# Step 7: Update sitemap
# ============================================================
echo ""
echo "🧶 Step 7: Updating sitemap..."

SITEMAP_FILE=""
if [ -f "public/sitemap.xml" ]; then
  SITEMAP_FILE="public/sitemap.xml"
elif [ -f "dist/sitemap.xml" ]; then
  SITEMAP_FILE="dist/sitemap.xml"
fi

if [ -n "$SITEMAP_FILE" ]; then
  # Add new URLs before </urlset>
  sed -i 's|</urlset>||' "$SITEMAP_FILE"
  cat >> "$SITEMAP_FILE" << 'SITEMAPEOF'
  <url><loc>https://mycrochetkit.com/blog/tools</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://mycrochetkit.com/blog/tools/yarn-calculator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://mycrochetkit.com/blog/tools/blanket-calculator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://mycrochetkit.com/blog/tools/gauge-calculator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://mycrochetkit.com/blog/tools/needle-converter</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://mycrochetkit.com/blog/tools/stitch-counter</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://mycrochetkit.com/blog/tools/project-cost-calculator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://mycrochetkit.com/blog/tools/yarn-weight-chart</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://mycrochetkit.com/blog/tools/increase-decrease-calculator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://mycrochetkit.com/blog/tools/abbreviation-glossary</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://mycrochetkit.com/blog/tools/stripe-generator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://mycrochetkit.com/blog/tools/color-pooling-calculator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://mycrochetkit.com/blog/tools/spinning-calculator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://mycrochetkit.com/blog/tools/cross-stitch-calculator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://mycrochetkit.com/blog/tools/weaving-sett-calculator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://mycrochetkit.com/blog/tools/thread-converter</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
</urlset>
SITEMAPEOF
  echo "  ✅ Sitemap updated"
else
  echo "  ⚠️  No sitemap.xml found — create one or skip for now"
fi

echo ""
echo "============================================================"
echo "🧶 DONE! Here's what to do next:"
echo "============================================================"
echo ""
echo "1. Add the routes to App.tsx (printed above)"
echo ""
echo "2. Build & test:"
echo "   npm run build"
echo ""
echo "3. Deploy:"
echo "   firebase deploy"
echo ""
echo "4. Test a blog post:"
echo "   https://mycrochetkit.com/blog/tools/yarn-calculator"
echo ""
echo "============================================================"
