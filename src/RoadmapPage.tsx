import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Clock, Sparkles, ArrowRight } from 'lucide-react';

interface RoadmapItem {
  title: string;
  description: string;
  status: 'done' | 'in-progress' | 'planned';
}

const roadmapItems: RoadmapItem[] = [
  {
    title: 'Voice-activated counting',
    description: 'Hands-free row counting with "next", "back", "reset"',
    status: 'done',
  },
  {
    title: 'Multiple counters per project',
    description: 'Track rows, stitches, repeats all in one place',
    status: 'done',
  },
  { title: 'Offline support', description: 'Full functionality without internet', status: 'done' },
  {
    title: 'Project notes',
    description: 'Add notes and reminders to your projects',
    status: 'done',
  },
  { title: 'Cloud sync', description: 'Access your projects from any device', status: 'done' },
  {
    title: 'Pattern reader',
    description: 'Import patterns and track progress line-by-line',
    status: 'in-progress',
  },
  {
    title: 'Yarn stash manager',
    description: 'Catalog your yarn collection with photos',
    status: 'planned',
  },
  {
    title: 'Project templates',
    description: 'Quick-start templates for common projects',
    status: 'planned',
  },
  {
    title: 'Progress photos',
    description: 'Document your journey with timestamped photos',
    status: 'planned',
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
        return 'bg-[#7FBFA0]/15 text-[#2D7A4F] border-[#7FBFA0]/30';
      case 'in-progress':
        return 'bg-[#B8A9C9]/15 text-[#6B5B7A] border-[#B8A9C9]/30';
      case 'planned':
        return 'bg-[#2C1810]/5 text-[#2C1810]/75 border-[#2C1810]/10';
    }
  };

  return (
    <div className="dashboard-background min-h-screen">
      <header className="sticky top-0 z-50 bg-[#FFF8F0]/80 backdrop-blur-xl border-b border-[#2C1810]/5">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#2C1810]/70 hover:text-[#2C1810] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E86A58] to-[#D35A4A] flex items-center justify-center">
              <span className="text-sm">🧶</span>
            </div>
            <span className="font-semibold text-[#2C1810]">MyCrochetKit</span>
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
          <h1 className="display-font text-4xl md:text-5xl text-[#2C1810] mb-4">Feature Roadmap</h1>
          <p className="text-[#2C1810]/75 max-w-md mx-auto">
            See what we've built and what's coming next.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {(['done', 'in-progress', 'planned'] as const).map((status) => (
            <span key={status} className={`badge ${getStatusStyles(status)}`}>
              {getStatusIcon(status)}
              {status === 'done' ? 'Shipped' : status === 'in-progress' ? 'In Progress' : 'Planned'}
            </span>
          ))}
        </div>

        <div className="space-y-4">
          {roadmapItems.map((item, index) => (
            <motion.div
              key={index}
              className="feature-card flex items-start justify-between gap-4 !p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div>
                <h3 className="font-semibold text-[#2C1810] mb-1">{item.title}</h3>
                <p className="text-[#2C1810]/70 text-sm">{item.description}</p>
              </div>
              <span className={`badge text-xs whitespace-nowrap ${getStatusStyles(item.status)}`}>
                {getStatusIcon(item.status)}
                {item.status === 'done'
                  ? 'Shipped'
                  : item.status === 'in-progress'
                    ? 'Building'
                    : 'Planned'}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 feature-card p-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="display-font text-2xl text-[#2C1810] mb-4">Have a feature request?</h2>
          <p className="text-[#2C1810]/75 mb-6">
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

      <footer className="border-t border-[#2C1810]/5">
        <div className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center">
          <span className="text-[#2C1810]/65 text-sm">MyCrochetKit</span>
          <Link
            to="/"
            className="text-[#2C1810]/65 hover:text-[#E86A58] text-sm transition-colors flex items-center gap-1"
          >
            Home <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
