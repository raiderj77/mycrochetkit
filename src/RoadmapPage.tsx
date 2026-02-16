import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Clock, Sparkles, ArrowRight } from 'lucide-react';

interface RoadmapItem {
  title: string;
  description: string;
  status: 'done' | 'in-progress' | 'planned';
  priority?: 'high' | 'medium' | 'low';
}

const roadmapItems: RoadmapItem[] = [
  // ============================================================================
  // COMPLETED FEATURES
  // ============================================================================
  {
    title: 'Voice-activated counting',
    description: 'Hands-free row counting with "next", "back", "reset" - no subscriptions required',
    status: 'done',
  },
  {
    title: 'Multiple counters per project',
    description: 'Track rows, stitches, repeats all in one place',
    status: 'done',
  },
  {
    title: 'Offline-first architecture',
    description: 'Full functionality without internet. Your data stays on your device.',
    status: 'done',
  },
  {
    title: 'Cloud sync & backup',
    description: 'Access your projects from any device with automatic cloud backup',
    status: 'done',
  },
  {
    title: 'Project notes & organization',
    description: 'Add notes and reminders to your projects',
    status: 'done',
  },
  {
    title: 'C2C Pattern Generator',
    description:
      'Mobile-first corner-to-corner pattern generator. Upload image, get written instructions. No competitor has this on mobile.',
    status: 'done',
  },
  {
    title: 'Stitch Glossary',
    description: '40+ crochet abbreviations with US & UK terms. Searchable, works offline.',
    status: 'done',
  },
  {
    title: 'Yarn Calculator',
    description: 'Calculate exactly how much yarn you need based on project dimensions and yarn weight',
    status: 'done',
  },
  {
    title: 'Hook Size Converter',
    description: 'Convert between US, UK, and metric hook sizes instantly',
    status: 'done',
  },
  {
    title: 'Free Tools Hub',
    description: 'Central hub for all free tools - no account required',
    status: 'done',
  },
  {
    title: 'SEO & Content Marketing',
    description: 'Blog posts, comparison pages, and optimized landing pages for organic growth',
    status: 'done',
  },

  // ============================================================================
  // IN PROGRESS - Current Development
  // ============================================================================
  {
    title: 'Pattern Import & Parsing',
    description:
      'Import PDF patterns and parse into trackable steps. Line-by-line progress tracking for mobile.',
    status: 'in-progress',
    priority: 'high',
  },

  // ============================================================================
  // HIGH PRIORITY - Research-Validated Critical Needs
  // ============================================================================
  {
    title: 'Pattern Annotation & Notes',
    description:
      'Highlight, mark up, and add inline notes to patterns. Mark rows complete as you work. Research shows this is a top-3 pain point.',
    status: 'planned',
    priority: 'high',
  },
  {
    title: 'Gauge Calculator',
    description:
      'Input your gauge swatch measurements, get adjusted stitch counts for any pattern. Makes gauge swatching actually useful.',
    status: 'planned',
    priority: 'high',
  },
  {
    title: 'Yarn Stash Manager',
    description:
      'Offline-first yarn inventory with barcode scanning. Match patterns to your existing stash. No data loss (unlike competitors).',
    status: 'planned',
    priority: 'high',
  },
  {
    title: 'Enhanced Yarn Calculator',
    description:
      'Add gauge integration, "yarn remaining" calculator, and yarn substitution recommendations',
    status: 'planned',
    priority: 'high',
  },
  {
    title: 'Left-Handed Mode',
    description:
      'Mirror patterns and charts for left-handed crocheters. Only Ribblr has this - huge underserved market (10% of crocheters).',
    status: 'planned',
    priority: 'high',
  },

  // ============================================================================
  // MEDIUM PRIORITY - Strong User Demand
  // ============================================================================
  {
    title: 'Inline Abbreviation Definitions',
    description:
      'Tap any abbreviation in a pattern to see definition. Makes glossary interactive within patterns.',
    status: 'planned',
    priority: 'medium',
  },
  {
    title: 'Progress Photo Timeline',
    description:
      'Document your journey with timestamped photos. Auto-links photos to project, pattern, and time spent.',
    status: 'planned',
    priority: 'medium',
  },
  {
    title: 'Smart Pattern Scaling',
    description:
      'Enter gauge difference, app suggests scaled stitch counts. You approve/skip each - no black-box AI.',
    status: 'planned',
    priority: 'medium',
  },
  {
    title: 'Chained/Linked Counters',
    description:
      'Nest counters together — e.g. 6-row repeat → 16 repeats → main counter. Auto-advance when target hit.',
    status: 'planned',
    priority: 'medium',
  },
  {
    title: 'Pattern Library Enhancements',
    description:
      'Tag, search, and organize patterns. Unified storage for PDFs, links, and manual entries.',
    status: 'planned',
    priority: 'medium',
  },
  {
    title: 'Custom Project Statuses',
    description:
      'Set statuses like "need supplies", "ready to start", "on the hook", "stuck". Filter WIPs by status.',
    status: 'planned',
    priority: 'medium',
  },

  // ============================================================================
  // LOWER PRIORITY - Nice to Have
  // ============================================================================
  {
    title: 'Standalone Quick Counter',
    description:
      'A counter not tied to any project — for foundation chains, quick counts, whatever you need',
    status: 'planned',
    priority: 'low',
  },
  {
    title: 'Dedicated Stitch Counter',
    description:
      'Separate from row counter. Custom increment amounts (1, 5, 10) for repeat sections',
    status: 'planned',
    priority: 'low',
  },
  {
    title: 'Counter Renaming',
    description: 'Give counters custom names instead of generic labels',
    status: 'planned',
    priority: 'low',
  },
  {
    title: 'Within-Round Stitch Tracking',
    description:
      'Track position within a round — know you\'re on stitch 4 of 18, not just which round',
    status: 'planned',
    priority: 'low',
  },
  {
    title: 'Project Templates',
    description: 'Quick-start templates for common projects (blankets, hats, scarves)',
    status: 'planned',
    priority: 'low',
  },
  {
    title: 'Planned Projects Section',
    description:
      'Separate section for "want to make next" projects, distinct from active WIPs',
    status: 'planned',
    priority: 'low',
  },
  {
    title: 'Visual Pattern Builder',
    description:
      'Drag-and-drop symbol-based pattern design with templates for granny squares and rounds',
    status: 'planned',
    priority: 'low',
  },
];

export function RoadmapPage() {
  const getStatusIcon = (status: RoadmapItem['status']) => {
    switch (status) {
      case 'done':
        return <Check className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'planned':
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getStatusStyles = (status: RoadmapItem['status']) => {
    switch (status) {
      case 'done':
        return 'bg-[#A8C1A8]/15 text-[#4A6F4A] border-[#A8C1A8]/30';
      case 'in-progress':
        return 'bg-[#8D7B6A]/15 text-[#5D5044] border-[#8D7B6A]/30';
      case 'planned':
        return 'bg-[#FAF0E4] text-[#3D352E]/75 border-[#3D352E]/10';
    }
  };

  const getPriorityBadge = (priority?: RoadmapItem['priority']) => {
    if (!priority) return null;
    
    const styles = {
      high: 'bg-[#5E8A5E]/10 text-[#5E8A5E] border-[#5E8A5E]/20',
      medium: 'bg-[#8D7B6A]/10 text-[#5D5044] border-[#8D7B6A]/20',
      low: 'bg-[#FAF0E4] text-[#746454] border-[#3D352E]/10',
    };

    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  const doneItems = roadmapItems.filter((item) => item.status === 'done');
  const inProgressItems = roadmapItems.filter((item) => item.status === 'in-progress');
  const plannedItems = roadmapItems.filter((item) => item.status === 'planned');

  return (
    <div className="dashboard-background min-h-screen">
      <header className="sticky top-0 z-50 bg-[#FEFDFB]/80 backdrop-blur-xl border-b border-[#3D352E]/5">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#3D352E] hover:text-[#3D352E] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5E8A5E] to-[#4A6F4A] flex items-center justify-center">
              <span className="text-sm">🧶</span>
            </div>
            <span className="font-semibold text-[#3D352E]">MyCrochetKit</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="display-font text-4xl md:text-5xl text-[#3D352E] mb-4">Feature Roadmap</h1>
          <p className="text-[#3D352E]/75 max-w-md mx-auto">
            See what we've built and what's coming next. Priorities based on real crocheter pain points.
          </p>
        </motion.div>

        {/* Status Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {(['done', 'in-progress', 'planned'] as const).map((status) => (
            <span key={status} className={`badge ${getStatusStyles(status)}`}>
              {getStatusIcon(status)}
              {status === 'done' ? 'Shipped' : status === 'in-progress' ? 'In Progress' : 'Planned'}
            </span>
          ))}
        </div>

        {/* Shipped Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#3D352E] mb-4">✅ Shipped ({doneItems.length})</h2>
          <div className="space-y-3">
            {doneItems.map((item, index) => (
              <motion.div
                key={index}
                className="feature-card flex items-start justify-between gap-4 !p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-[#3D352E] mb-1">{item.title}</h3>
                  <p className="text-[#3D352E] text-sm">{item.description}</p>
                </div>
                <span className={`badge text-xs whitespace-nowrap ${getStatusStyles(item.status)}`}>
                  {getStatusIcon(item.status)}
                  Shipped
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* In Progress */}
        {inProgressItems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#3D352E] mb-4">🚧 In Progress ({inProgressItems.length})</h2>
            <div className="space-y-3">
              {inProgressItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="feature-card flex items-start justify-between gap-4 !p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#3D352E]">{item.title}</h3>
                      {getPriorityBadge(item.priority)}
                    </div>
                    <p className="text-[#3D352E] text-sm">{item.description}</p>
                  </div>
                  <span className={`badge text-xs whitespace-nowrap ${getStatusStyles(item.status)}`}>
                    {getStatusIcon(item.status)}
                    Building
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Planned Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#3D352E] mb-4">📋 Planned ({plannedItems.length})</h2>
          <div className="space-y-3">
            {plannedItems.map((item, index) => (
              <motion.div
                key={index}
                className="feature-card flex items-start justify-between gap-4 !p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.03 }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[#3D352E]">{item.title}</h3>
                    {getPriorityBadge(item.priority)}
                  </div>
                  <p className="text-[#3D352E] text-sm">{item.description}</p>
                </div>
                <span className={`badge text-xs whitespace-nowrap ${getStatusStyles(item.status)}`}>
                  {getStatusIcon(item.status)}
                  Planned
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature Request CTA */}
        <motion.div
          className="mt-16 feature-card p-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="display-font text-2xl text-[#3D352E] mb-4">Have a feature request?</h2>
          <p className="text-[#3D352E]/75 mb-6">
            We'd love to hear what would make your crochet life easier.
          </p>
          <a
            href="mailto:support@mycrochetkit.com?subject=Feature%20Request"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Request a Feature
          </a>
        </motion.div>
      </main>

      <footer className="border-t border-[#3D352E]/5">
        <div className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center">
          <span className="text-[#3D352E]/65 text-sm">MyCrochetKit</span>
          <Link
            to="/"
            className="text-[#3D352E]/65 hover:text-[#5E8A5E] text-sm transition-colors flex items-center gap-1"
          >
            Home <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
