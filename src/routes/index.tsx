/**
 * Application Routes Configuration
 * 
 * Centralized routing with lazy loading for optimal performance
 */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Layout
const MarketingLayout = lazy(() => import('@/layout/MarketingLayout'));
const AppLayout = lazy(() => import('@/layout/AppLayout'));

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ProjectList = lazy(() => import('@/pages/ProjectList'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const PatternLibrary = lazy(() => import('@/pages/PatternLibrary'));
const PatternReader = lazy(() => import('@/pages/PatternReader'));
const Settings = lazy(() => import('@/pages/Settings'));
const FinishedObjects = lazy(() => import('@/pages/FinishedObjects'));
const SharedProject = lazy(() => import('@/pages/SharedProject'));
const YarnCalculator = lazy(() => import('@/pages/YarnCalculator'));
const QuickStartWizard = lazy(() => import('@/pages/QuickStartWizard'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const Community = lazy(() => import('@/pages/Community'));
const Landing = lazy(() => import('@/pages/Landing'));
const Glossary = lazy(() => import('@/pages/Glossary'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const Marketplace = lazy(() => import('@/pages/Marketplace'));
const Blog = lazy(() => import('@/pages/Blog'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const CookiePolicy = lazy(() => import('@/pages/CookiePolicy'));
const BillingTerms = lazy(() => import('@/pages/BillingTerms'));
const Admin = lazy(() => import('@/pages/Admin'));
const SecretAdminLogin = lazy(() => import('@/pages/SecretAdminLogin'));
const AdminRewards = lazy(() => import('@/pages/AdminRewards'));
const ReferralDashboard = lazy(() => import('@/pages/ReferralDashboard'));
const Welcome = lazy(() => import('@/pages/Welcome'));
const Roadmap = lazy(() => import('@/pages/Roadmap'));
const Support = lazy(() => import('@/pages/Support'));
const VoiceHelp = lazy(() => import('@/pages/VoiceHelp'));

// SEO Content Pages
const CrochetAbbreviations = lazy(() => import('@/pages/CrochetAbbreviations'));
const CrochetPricingGuide = lazy(() => import('@/pages/CrochetPricingGuide'));
const YarnWeightChart = lazy(() => import('@/pages/YarnWeightChart'));
const HookSizeChart = lazy(() => import('@/pages/HookSizeChart'));

export const routes: RouteObject[] = [
  // Marketing pages (Header only, no sidebar)
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/landing', element: <Landing /> },
      { path: '/pricing', element: <Pricing /> },
      { path: '/signup', element: <Signup /> },
      { path: '/login', element: <Login /> },
      { path: '/privacy', element: <Privacy /> },
      { path: '/terms', element: <Terms /> },
      { path: '/cookies', element: <CookiePolicy /> },
      { path: '/billing', element: <BillingTerms /> },
      { path: '/welcome', element: <Welcome /> },
      { path: '/secret-login-77', element: <SecretAdminLogin /> },
      // SEO Content Pages
      { path: '/crochet-abbreviations', element: <CrochetAbbreviations /> },
      { path: '/crochet-pricing-guide', element: <CrochetPricingGuide /> },
      { path: '/yarn-weight-chart', element: <YarnWeightChart /> },
      { path: '/hook-size-chart', element: <HookSizeChart /> },
      { path: '/support', element: <Support /> },
      { path: '/voice-help', element: <VoiceHelp /> },
      { path: '/calculator', element: <YarnCalculator /> },
    ],
  },
  // Content & App pages (Sidebar layout)
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/projects', element: <ProjectList /> },
      { path: '/projects/:id', element: <ProjectDetail /> },
      { path: '/patterns', element: <PatternLibrary /> },
      { path: '/patterns/:id', element: <PatternReader /> },
      { path: '/quick-start', element: <QuickStartWizard /> },
      { path: '/finished', element: <FinishedObjects /> },
      { path: '/settings', element: <Settings /> },
      { path: '/shared/project/:id', element: <SharedProject /> },
      { path: '/manage-kit-77', element: <Admin /> },
      { path: '/admin/rewards', element: <AdminRewards /> },
      { path: '/blog', element: <Blog /> },
      { path: '/glossary', element: <Glossary /> },
      { path: '/community', element: <Community /> },
      { path: '/marketplace', element: <Marketplace /> },
      { path: '/referrals', element: <ReferralDashboard /> },
      { path: '/roadmap', element: <Roadmap /> },
    ],
  },
];
