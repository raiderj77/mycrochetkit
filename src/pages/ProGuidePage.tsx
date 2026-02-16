import { Link } from 'react-router-dom';
import { SEOHead } from '../seo/components/SEOHead';
import {
  Crown,
  Clock,
  Repeat,
  CircleDot,
  Hash,
  Thermometer,
  Grid3X3,
  ArrowLeft,
  Zap,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

const QUICK_STEPS = [
  { step: '1', title: 'Open a project', desc: 'Tap any project from your home screen to open the counter.' },
  { step: '2', title: 'Expand Project Tools', desc: 'Tap the sparkle bar below the header. Your 6 Pro tools appear as pills.' },
  { step: '3', title: 'Tap any tool', desc: 'Each tool opens inline \u2014 no page loads, no popups. Use it right alongside your counter.' },
  { step: '4', title: 'Keep crafting', desc: 'Tools save automatically. Switch between tools or collapse the bar anytime.' },
];

const PRO_TOOLS = [
  {
    key: 'timer',
    icon: Clock,
    name: 'Project Timer',
    tagline: 'Track time spent and calculate your hourly rate',
    details: [
      'Start/stop timer tracks cumulative hours across sessions',
      'Enter your yarn cost and selling price to see your effective hourly rate',
      'Pause and resume \u2014 timer state saves automatically',
      'Great for pricing handmade items or tracking project duration',
    ],
    tip: 'Start the timer every time you sit down to craft. Over a week you will get a realistic picture of how long projects actually take.',
  },
  {
    key: 'yarnsub',
    icon: Repeat,
    name: 'Yarn Substitution Calculator',
    tagline: 'Swap yarn weights without math headaches',
    details: [
      'Select your pattern\u2019s original yarn weight and the weight you want to use',
      'Enter the pattern yardage to get the adjusted amount needed',
      'Shows conversion ratio and recommended hook/needle size',
      'Quick reference chart for all standard yarn weights',
    ],
    tip: 'Always buy one extra skein when substituting. The conversion ratio is a guide, not gospel \u2014 your tension may differ.',
  },
  {
    key: 'hat',
    icon: CircleDot,
    name: 'Hat Sizing Calculator',
    tagline: 'Nail the fit on every hat project',
    details: [
      'Enter head circumference or select a standard size (preemie through adult XL)',
      'Calculates starting chain/cast-on count based on your gauge',
      'Suggests crown decrease schedule',
      'Works for both crochet and knit hats',
    ],
    tip: 'Measure the actual head if you can. "Adult medium" varies wildly between pattern designers.',
  },
  {
    key: 'multiples',
    icon: Hash,
    name: 'Stitch Multiples Helper',
    tagline: 'Get your foundation chain right the first time',
    details: [
      'Enter your stitch pattern repeat (e.g. multiple of 4 + 1)',
      'Enter your desired width and gauge',
      'Calculates the exact chain count that fits your pattern repeat',
      'No more frogging because you were off by one stitch',
    ],
    tip: 'Check your pattern instructions for the repeat. It is usually written as "multiple of X + Y" in the materials section.',
  },
  {
    key: 'temperature',
    icon: Thermometer,
    name: 'Temperature Blanket Planner',
    tagline: 'Map daily temps to yarn colors all year',
    details: [
      'Set your temperature ranges and assign a color to each range',
      'Log daily temperatures as you go',
      'Visual preview shows your blanket\u2019s color progression',
      'Supports both Fahrenheit and Celsius',
    ],
    tip: 'Choose your color palette before you start buying yarn. Lay out all the skeins together to make sure they look good side by side.',
  },
  {
    key: 'granny',
    icon: Grid3X3,
    name: 'Granny Square Layout Designer',
    tagline: 'Plan multi-square projects visually',
    details: [
      'Set your grid dimensions (e.g. 5x7 for a blanket)',
      'Assign colors to squares with tap-to-paint',
      'Rearrange squares until the layout looks balanced',
      'Shows total square count per color for yarn planning',
    ],
    tip: 'Make all your squares first, then lay them out on the floor before joining. The layout designer helps, but seeing them in person is even better.',
  },
];

export function ProGuidePage() {
  return (
    <>
      <SEOHead
        title="Pro Guide \u2014 MyCrochetKit"
        description="Everything you need to know about MyCrochetKit Pro tools. Quick-start guide and detailed feature walkthroughs."
        canonicalUrl="/pro-guide"
      />
      <div className="min-h-screen bg-[#FEFDFB]">
        {/* Header */}
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#746454] hover:text-[#3D352E] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5E8A5E] to-[#4A6F4A] flex items-center justify-center shadow-md">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="display-font text-2xl text-[#3D352E]">Pro Guide</h1>
              <p className="text-sm text-[#746454]">Get the most out of your Pro tools</p>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="max-w-2xl mx-auto px-4 mb-8">
          <div className="bg-gradient-to-r from-[#5E8A5E]/5 to-[#FAF0E4] border border-[#5E8A5E]/15 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#5E8A5E]" />
              <h2 className="text-lg font-bold text-[#3D352E]">Quick Start</h2>
            </div>
            <div className="space-y-4">
              {QUICK_STEPS.map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#5E8A5E] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {s.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#3D352E]">{s.title}</p>
                    <p className="text-sm text-[#746454]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="max-w-2xl mx-auto px-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#5E8A5E]" />
            <h2 className="text-lg font-bold text-[#3D352E]">Your Pro Tools</h2>
          </div>
          <p className="text-sm text-[#746454] mb-6">
            All tools live inside every project. Open a project, expand the toolbar, and tap to use.
          </p>
        </div>

        {/* Tool Sections */}
        <div className="max-w-2xl mx-auto px-4 pb-12">
          <div className="space-y-4">
            {PRO_TOOLS.map((tool) => (
              <div
                key={tool.key}
                className="bg-white border border-[#EDE8E3] rounded-2xl overflow-hidden"
              >
                {/* Tool header */}
                <div className="px-5 pt-5 pb-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5E8A5E]/10 flex items-center justify-center flex-shrink-0">
                    <tool.icon className="w-5 h-5 text-[#5E8A5E]" />
                  </div>
                  <div>
                    <h3 className="text-[#3D352E] font-bold">{tool.name}</h3>
                    <p className="text-xs text-[#746454]">{tool.tagline}</p>
                  </div>
                </div>

                {/* What it does */}
                <div className="px-5 pb-3">
                  <div className="space-y-2">
                    {tool.details.map((d, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#5E8A5E] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-[#3D352E]">{d}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro tip */}
                <div className="mx-5 mb-5 p-3 rounded-xl bg-[#FAF0E4] border border-[#EDE8E3]">
                  <p className="text-xs text-[#3D352E]">
                    <span className="font-bold text-[#5E8A5E]">Pro tip:</span>{' '}
                    <span className="text-[#746454]">{tool.tip}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Also included */}
          <div className="mt-8 bg-white border border-[#EDE8E3] rounded-2xl p-5">
            <h3 className="text-[#3D352E] font-bold mb-3">Also included with Pro</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#5E8A5E] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#3D352E]">
                  <span className="font-semibold">Unlimited projects</span>
                  <span className="text-[#746454]"> \u2014 free users are limited to 5</span>
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#5E8A5E] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#3D352E]">
                  <span className="font-semibold">Cloud sync across devices</span>
                  <span className="text-[#746454]"> \u2014 your projects, counters, and tool data stay in sync everywhere</span>
                </p>
              </div>
            </div>
          </div>

          {/* Free tools reminder */}
          <div className="mt-4 p-4 rounded-2xl bg-[#FAF0E4] border border-[#EDE8E3]">
            <p className="text-xs text-[#746454]">
              <span className="font-semibold text-[#3D352E]">Always free:</span> Voice-activated counter, stitch glossary, yarn calculator, hook converter, C2C generator, pattern notes, Ravelry link, and quick counter.
            </p>
          </div>

          {/* CTA to go use it */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5E8A5E] to-[#4A6F4A] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              Open a Project <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
