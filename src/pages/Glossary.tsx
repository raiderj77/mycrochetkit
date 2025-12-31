import { useState } from 'react';
import { glossaryData, categories, GlossaryTerm } from '../data/glossaryData';
import { Search, BookOpen } from 'lucide-react';

export default function Glossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter terms based on search and category
  const filteredTerms = glossaryData.filter(term => {
    const matchesSearch = 
      term.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All' || term.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group terms by category
  const groupedTerms = categories.reduce((acc, category) => {
    acc[category] = filteredTerms.filter(term => term.category === category);
    return acc;
  }, {} as Record<string, GlossaryTerm[]>);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">Crochet Glossary</h1>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">Quick reference for crochet abbreviations and terms</p>
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search abbreviations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input md:w-48"
          >
            <option value="All">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
        {filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'} found
      </div>

      {/* Glossary Terms by Category */}
      {selectedCategory === 'All' ? (
        // Show all categories
        categories.map(category => {
          const terms = groupedTerms[category];
          if (terms.length === 0) return null;

          return (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-400">
                {category}
              </h2>
              <div className="grid gap-4">
                {terms.map(term => (
                  <TermCard key={term.abbreviation} term={term} />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        // Show selected category only
        <div className="grid gap-4">
          {filteredTerms.map(term => (
            <TermCard key={term.abbreviation} term={term} />
          ))}
        </div>
      )}

      {/* No Results */}
      {filteredTerms.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-neutral-600 dark:text-neutral-400">No terms found matching your search.</p>
        </div>
      )}
    </div>
  );
}

function TermCard({ term }: { term: GlossaryTerm }) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-mono font-bold px-3 py-1 rounded text-sm min-w-[60px] text-center shrink-0">
          {term.abbreviation}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-neutral-900 dark:text-neutral-50 mb-1">{term.name}</h3>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">{term.definition}</p>
          {term.usEquivalent && (
            <p className="mt-2 text-xs text-primary-600 dark:text-primary-400">
              <strong>US Equivalent:</strong> {term.usEquivalent}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
