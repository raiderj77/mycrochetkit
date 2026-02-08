import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Newspaper, Map, MessageCircle, Grid3X3 } from 'lucide-react';

const links = [
  { to: '/patterns', icon: BookOpen, label: 'Patterns', color: 'bg-[#E86A58]', emoji: '📚' },
  { to: '/blog', icon: Newspaper, label: 'Blog', color: 'bg-[#7FBFA0]', emoji: '📝' },
  { to: '/tools/c2c-generator', icon: Grid3X3, label: 'C2C Tool', color: 'bg-[#B8A9C9]', emoji: '🔲' },
  { to: '/roadmap', icon: Map, label: 'Roadmap', color: 'bg-[#E86A58]/70', emoji: '🗺️' },
  {
    href: 'https://www.reddit.com/r/crochetkitapp/',
    icon: MessageCircle,
    label: 'Community',
    color: 'bg-[#FF4500]',
    emoji: '💬',
  },
];

export function QuickLinks() {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-medium text-[#2C1810]/70 mb-3">Quick Links</h2>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
        {links.map((link, index) => {
          const content = (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm border border-[#2C1810]/5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div
                className={`w-10 h-10 ${link.color} rounded-xl flex items-center justify-center text-white text-lg`}
              >
                {link.emoji}
              </div>
              <span className="text-xs font-medium text-[#2C1810]/70">{link.label}</span>
            </motion.div>
          );

          if ('href' in link && link.href) {
            return (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            );
          }

          return (
            <Link key={link.label} to={link.to!}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
