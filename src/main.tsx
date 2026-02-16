import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import App from './App.tsx';
import { initGA } from './analytics';
import { ErrorBoundary } from './components/ErrorBoundary';
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
const BlogPostOfflineApps = lazy(() =>
  import('./pages/BlogPostOfflineApps.tsx').then((m) => ({ default: m.BlogPostOfflineApps }))
);
const BlogPostWhyILeftRavelry = lazy(() =>
  import('./pages/BlogPostWhyILeftRavelry.tsx').then((m) => ({ default: m.BlogPostWhyILeftRavelry }))
);
const BlogPostVoiceCounter = lazy(() =>
  import('./pages/BlogPostVoiceCounter.tsx').then((m) => ({ default: m.BlogPostVoiceCounter }))
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
const BlogPostYarnCalculator = lazy(() => import('./pages/BlogPostYarnCalculator').then(m => ({ default: m.BlogPostYarnCalculator })));
const BlogPostBlanketCalculator = lazy(() => import('./pages/BlogPostBlanketCalculator').then(m => ({ default: m.BlogPostBlanketCalculator })));
const BlogPostGaugeCalculator = lazy(() => import('./pages/BlogPostGaugeCalculator').then(m => ({ default: m.BlogPostGaugeCalculator })));
const BlogPostHookConverter = lazy(() => import('./pages/BlogPostHookConverter').then(m => ({ default: m.BlogPostHookConverter })));
const BlogPostYarnWeightChart = lazy(() => import('./pages/BlogPostYarnWeightChart').then(m => ({ default: m.BlogPostYarnWeightChart })));
const BlogPostAbbreviations = lazy(() => import('./pages/BlogPostAbbreviations').then(m => ({ default: m.BlogPostAbbreviations })));
const BlogPostStitchCounter = lazy(() => import('./pages/BlogPostStitchCounter').then(m => ({ default: m.BlogPostStitchCounter })));
const BlogPostCostCalculator = lazy(() => import('./pages/BlogPostCostCalculator').then(m => ({ default: m.BlogPostCostCalculator })));
const BlogPostIncDecCalculator = lazy(() => import('./pages/BlogPostIncDecCalculator').then(m => ({ default: m.BlogPostIncDecCalculator })));
const BlogPostStripeGenerator = lazy(() => import('./pages/BlogPostStripeGenerator').then(m => ({ default: m.BlogPostStripeGenerator })));
const BlogPostColorPooling = lazy(() => import('./pages/BlogPostColorPooling').then(m => ({ default: m.BlogPostColorPooling })));
const BlogPostSpinningCalculator = lazy(() => import('./pages/BlogPostSpinningCalculator').then(m => ({ default: m.BlogPostSpinningCalculator })));
const BlogPostCrossStitchCalculator = lazy(() => import('./pages/BlogPostCrossStitchCalculator').then(m => ({ default: m.BlogPostCrossStitchCalculator })));
const BlogPostWeavingSett = lazy(() => import('./pages/BlogPostWeavingSett').then(m => ({ default: m.BlogPostWeavingSett })));
const BlogPostThreadConverter = lazy(() => import('./pages/BlogPostThreadConverter').then(m => ({ default: m.BlogPostThreadConverter })));
const FeedbackButton = lazy(() =>
  import('./components/FeedbackButton.tsx').then((m) => ({ default: m.FeedbackButton }))
);

initGA();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block w-12 h-12 border-4 border-[#E86A58] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-[#2C1810]/60">Loading...</p>
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/counter" element={<CounterPage />} />
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
              <Route
                path="/blog/best-crochet-apps-offline"
                element={<BlogPostOfflineApps />}
              />
              <Route
                path="/blog/why-i-left-ravelry"
                element={<BlogPostWhyILeftRavelry />}
              />
              <Route
                path="/blog/free-voice-activated-row-counter-crochet"
                element={<BlogPostVoiceCounter />}
              />
              <Route path="/tools/c2c-generator" element={<C2CGeneratorPage />} />
              <Route path="/tools" element={<FreeToolsPage />} />
              <Route path="/yarn-calculator" element={<YarnCalculatorPage />} />
              <Route path="/hook-converter" element={<HookConverterPage />} />
              <Route path="/stitch-glossary" element={<StitchGlossaryPage />} />
              <Route path="/quick-counter" element={<QuickCounterPage />} />
              <Route path="/blog/how-much-yarn-do-i-need" element={<BlogPostYarnCalculator />} />
              <Route path="/blog/crochet-blanket-size-chart" element={<BlogPostBlanketCalculator />} />
              <Route path="/blog/crochet-gauge-calculator-guide" element={<BlogPostGaugeCalculator />} />
              <Route path="/blog/crochet-hook-size-conversion-chart" element={<BlogPostHookConverter />} />
              <Route path="/blog/yarn-weight-chart-guide" element={<BlogPostYarnWeightChart />} />
              <Route path="/blog/crochet-abbreviations-glossary" element={<BlogPostAbbreviations />} />
              <Route path="/blog/free-crochet-stitch-counter" element={<BlogPostStitchCounter />} />
              <Route path="/blog/crochet-project-cost-calculator" element={<BlogPostCostCalculator />} />
              <Route path="/blog/crochet-increase-decrease-calculator" element={<BlogPostIncDecCalculator />} />
              <Route path="/blog/crochet-stripe-pattern-generator" element={<BlogPostStripeGenerator />} />
              <Route path="/blog/planned-pooling-crochet-guide" element={<BlogPostColorPooling />} />
              <Route path="/blog/spinning-wheel-ratio-calculator" element={<BlogPostSpinningCalculator />} />
              <Route path="/blog/cross-stitch-fabric-calculator" element={<BlogPostCrossStitchCalculator />} />
              <Route path="/blog/weaving-sett-calculator-guide" element={<BlogPostWeavingSett />} />
              <Route path="/blog/embroidery-thread-conversion-chart" element={<BlogPostThreadConverter />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <FeedbackButton />
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
