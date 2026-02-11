// Create this as src/components/ToolsBanner.tsx
// Then add it to each tool page (StitchGlossaryPage, YarnCalculatorPage, etc.)

import { Link } from 'react-router-dom';
import { Mic, BookOpen, Calculator, Ruler, Grid, ArrowRight } from 'lucide-react';

interface Tool {
  name: string;
  path: string;
  icon: typeof Mic;
  color: string;
}

const ALL_TOOLS: Tool[] = [
  { name: 'Voice Counter', path: '/quick-counter', icon: Mic, color: 'text-[#E86A58]' },
  { name: 'Stitch Glossary', path: '/stitch-glossary', icon: BookOpen, color: 'text-[#B8A9C9]' },
  { name: 'Yarn Calculator', path: '/yarn-calculator', icon: Calculator, color: 'text-[#7FBFA0]' },
  { name: 'Hook Converter', path: '/hook-converter', icon: Ruler, color: 'text-[#E8B86A]' },
  { name: 'C2C Generator', path: '/tools/c2c-generator', icon: Grid, color: 'text-[#6AB8E8]' },
];

interface ToolsBannerProps {
  currentPath: string;
}

export function ToolsBanner({ currentPath }: ToolsBannerProps) {
  const otherTools = ALL_TOOLS.filter(tool => tool.path !== currentPath).slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-[#FFF8F0] to-white border-t border-[#2C1810]/5 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#2C1810]">More Free Tools</h3>
          <Link
            to="/tools"
            className="text-sm font-semibold text-[#E86A58] hover:text-[#D35A4A] flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {otherTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-[#2C1810]/10 hover:border-[#E86A58]/30 hover:shadow-md transition-all"
              >
                <Icon className={`w-5 h-5 ${tool.color}`} />
                <span className="text-sm font-medium text-[#2C1810] group-hover:text-[#E86A58] transition-colors">
                  {tool.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Usage example in StitchGlossaryPage.tsx:
// Add at the bottom, before the footer:
/*
import { ToolsBanner } from '../components/ToolsBanner';

// Inside your component return, add before </div>:
<ToolsBanner currentPath="/stitch-glossary" />
*/
