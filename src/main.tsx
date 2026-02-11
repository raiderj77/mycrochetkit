import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { initGA } from './analytics';
import './index.css';

// Lazy-load route-level components to reduce initial bundle
const CounterPage = lazy(() =>
  import('./CounterPage.tsx').then((m) => ({ default: m.CounterPage }))
);
const RoadmapPage = lazy(() =>
  import('./RoadmapPage.tsx').then((m) => ({ default: m.RoadmapPage }))
);
const PatternsPage = lazy(() =>
  import('./pages/PatternsPage.tsx').then((m) => ({ default: m.PatternsPage }))
);
const StepEditorPage = lazy(() =>
  import('./pages/StepEditorPage.tsx').then((m) => ({ default: m.StepEditorPage }))
);
const PatternTrackerPage = lazy(() =>
  import('./pages/PatternTrackerPage.tsx').then((m) => ({ default: m.PatternTrackerPage }))
);
const VsRavelry = lazy(() =>
  import('./pages/VsRavelry.tsx').then((m) => ({ default: m.VsRavelry }))
);
const Blog = lazy(() => import('./pages/Blog.tsx').then((m) => ({ default: m.Blog })));
const BlogPost2026Trends = lazy(() =>
  import('./pages/BlogPost2026Trends.tsx').then((m) => ({ default: m.BlogPost2026Trends }))
);
const BlogPostRowCounting = lazy(() =>
  import('./pages/BlogPostRowCounting.tsx').then((m) => ({ default: m.BlogPostRowCounting }))
);
const BlogPostTrueCost = lazy(() =>
  import('./pages/BlogPostTrueCost.tsx').then((m) => ({ default: m.BlogPostTrueCost }))
);
const BlogPostC2CPatterns = lazy(() =>
  import('./pages/BlogPostC2CPatterns.tsx').then((m) => ({ default: m.BlogPostC2CPatterns }))
);
const C2CGeneratorPage = lazy(() =>
  import('./pages/C2CGeneratorPage.tsx').then((m) => ({ default: m.C2CGeneratorPage }))
);
const QuickCounterPage = lazy(() =>
  import('./pages/QuickCounterPage.tsx').then((m) => ({ default: m.QuickCounterPage }))
);
const FreeToolsPage = lazy(() =>
  import('./pages/FreeTools.tsx').then((m) => ({ default: m.FreeToolsPage }))
);
const YarnCalculatorPage = lazy(() =>
  import('./pages/YarnCalculatorPage.tsx').then((m) => ({ default: m.YarnCalculatorPage }))
);
const HookConverterPage = lazy(() =>
  import('./pages/HookConverterPage.tsx').then((m) => ({ default: m.HookConverterPage }))
);
const StitchGlossaryPage = lazy(() =>
  import('./pages/StitchGlossaryPage.tsx').then((m) => ({ default: m.StitchGlossaryPage }))
);
const NotFound = lazy(() => import('./pages/NotFound.tsx').then((m) => ({ default: m.NotFound })));
const FeedbackButton = lazy(() =>
  import('./components/FeedbackButton.tsx').then((m) => ({ default: m.FeedbackButton }))
);

initGA();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full border-3 border-[#E86A58]/20 border-t-[#E86A58] animate-spin" />
                <p className="text-[#2C1810]/70">Loading...</p>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/counter" element={<QuickCounterPage />} />
            <Route path="/counter/:projectId" element={<CounterPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/patterns" element={<PatternsPage />} />
            <Route path="/patterns/:patternId/edit" element={<StepEditorPage />} />
            <Route path="/patterns/:patternId/track" element={<PatternTrackerPage />} />
            <Route path="/vs/ravelry" element={<VsRavelry />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/crochet-trends-2026" element={<BlogPost2026Trends />} />
            <Route
              path="/blog/how-to-never-lose-row-count-crochet"
              element={<BlogPostRowCounting />}
            />
            <Route path="/blog/real-cost-handmade-crochet-blanket" element={<BlogPostTrueCost />} />
            <Route
              path="/blog/c2c-crochet-patterns-complete-guide"
              element={<BlogPostC2CPatterns />}
            />
            <Route path="/tools/c2c-generator" element={<C2CGeneratorPage />} />
            <Route path="/tools" element={<FreeToolsPage />} />
            <Route path="/yarn-calculator" element={<YarnCalculatorPage />} />
            <Route path="/hook-converter" element={<HookConverterPage />} />
            <Route path="/stitch-glossary" element={<StitchGlossaryPage />} />
            <Route path="/quick-counter" element={<QuickCounterPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FeedbackButton />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
