import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';

export const VsRavelry = () => {
  return (
    <>
      <SEOHead
        title="MyCrochetKit vs Ravelry: Which Should You Use? | Comparison Guide"
        description="MyCrochetKit and Ravelry serve different needs. Use both together for the complete workflow."
        canonicalUrl="https://mycrochetkit.com/vs/ravelry"
      />

      <div className="min-h-screen bg-[#FFF8F0]">
        <header className="sticky top-0 z-50 bg-[#FFF8F0]/80 backdrop-blur-xl border-b border-[#2C1810]/5">
          <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E86A58] to-[#D35A4A] flex items-center justify-center shadow-md">
                <span className="text-xl">🧶</span>
              </div>
              <span className="font-semibold text-[#2C1810] text-lg">MyCrochetKit</span>
            </Link>
          </div>
        </header>

        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-6">
              MyCrochetKit vs Ravelry: Which Should You Use?
            </h1>
            <p className="text-xl text-[#2C1810]/70 mb-8">
              The short answer: <strong>Use both together.</strong>
            </p>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-4">TL;DR</h2>
            <p className="mb-4">
              <strong>Ravelry:</strong> Pattern discovery, yarn database, community forums
            </p>
            <p className="mb-4">
              <strong>MyCrochetKit:</strong> Voice-activated tracking, hands-free counting, offline
              work
            </p>
            <p className="text-[#E86A58] font-semibold">
              Use Ravelry for discovery. Use MyCrochetKit while crocheting.
            </p>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#E86A58] text-white rounded-2xl font-semibold"
            >
              Try MyCrochetKit Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};
