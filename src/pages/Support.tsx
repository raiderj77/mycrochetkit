import { HelpCircle, ShieldAlert, Trash2, Globe, ArrowLeft, ExternalLink, Mic, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Support() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-slate-950 transition-colors duration-500">
      <Helmet>
        <title>Technical Support & Troubleshooting | My Crochet Kit</title>
        <meta name="description" content="Facing loading issues or connection errors? Follow our simple guide to fix Chrome protocol errors, clear cache, and get back to your crochet projects." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-white shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-100 hover:text-white transition-colors mb-6 font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex justify-center mb-4">
            <HelpCircle className="h-12 w-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Support & Troubleshooting</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Technical issues shouldn't stop your creativity. Here's how to resolve common connection and loading problems.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        
        {/* Connection Issues Section */}
        <section className="mb-12 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-neutral-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert className="text-indigo-600 h-8 w-8" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Fixing Connection Errors (QUIC)</h2>
          </div>
          
          <div className="prose dark:prose-invert max-w-none text-neutral-600 dark:text-slate-400">
            <p className="mb-4">
              If you see a <strong>"Protocol Error"</strong> or <code>ERR_QUIC_PROTOCOL_ERROR</code>, it's often due to an experimental setting in Google Chrome that conflicts with some internet providers.
            </p>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-6 rounded-r-lg mb-6">
              <h3 className="text-amber-800 dark:text-amber-200 mt-0 font-bold mb-2 text-lg">The 60-Second Fix:</h3>
              <ol className="list-decimal pl-5 space-y-3 font-medium">
                <li>Type <code className="bg-white dark:bg-slate-800 px-2 py-1 rounded">chrome://flags</code> in your address bar and press Enter.</li>
                <li>In the search box at the top, type <strong>"quic"</strong>.</li>
                <li>Find <strong>Experimental QUIC protocol</strong> and change it to <strong>Disabled</strong>.</li>
                <li>Click the <strong>Relaunch</strong> button at the bottom of the screen.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Browser Extensions Section */}
        <section className="mb-12 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-neutral-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
              <Globe className="text-indigo-600 h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Extension Conflicts</h2>
          </div>
          
          <div className="text-neutral-600 dark:text-slate-400 space-y-4">
            <p>
              Ad-blockers, VPNs, or security extensions can sometimes block the real-time sync features of My Crochet Kit.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="border border-neutral-100 dark:border-slate-800 p-5 rounded-xl bg-neutral-50 dark:bg-slate-800/50">
                <h4 className="font-bold text-neutral-900 dark:text-white mb-2 underline decoration-indigo-500 underline-offset-4">Test with Incognito</h4>
                <p className="text-sm">Press <strong>Ctrl + Shift + N</strong> (Windows) or <strong>Cmd + Shift + N</strong> (Mac) to open an Incognito window. If the site works there, an extension is the culprit.</p>
              </div>
              <div className="border border-neutral-100 dark:border-slate-800 p-5 rounded-xl bg-neutral-50 dark:bg-slate-800/50">
                <h4 className="font-bold text-neutral-900 dark:text-white mb-2 underline decoration-indigo-500 underline-offset-4">Disable VPNs</h4>
                <p className="text-sm">If you're using a VPN, try disconnecting temporarily. Some VPNs block the specific traffic types required for voice-command sync.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Voice Control Section */}
        <section className="mb-12 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-neutral-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
              <Mic className="text-emerald-600 h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Voice Command Guide</h2>
          </div>
          
          <div className="text-neutral-600 dark:text-slate-400 space-y-4">
            <p>
              Having trouble with the app not hearing you or doubling your counts? We've created a dedicated guide to help you master hands-free tracking.
            </p>
            
            <Link 
              to="/voice-help"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md mt-2"
            >
              View Voice Guide & Troubleshooting <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Cache Clearing Section */}
        <section className="mb-12 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-neutral-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="text-rose-500 h-8 w-8" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Clear Stuck Browser Data</h2>
          </div>
          
          <div className="text-neutral-600 dark:text-slate-400 space-y-4">
            <p>
              Sometimes the browser holds onto an old version of a file. Clearing your cache is like a "deep clean" for your connection.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Press <strong>Ctrl + Shift + Delete</strong> on your keyboard.</li>
              <li>Select <strong>"Cached images and files"</strong> and <strong>"Cookies"</strong>.</li>
              <li>Click <strong>Clear Data</strong> and refresh My Crochet Kit.</li>
            </ul>
          </div>
        </section>

        {/* Site Status Section */}
        <section className="mb-12 text-center bg-indigo-50 dark:bg-slate-900 rounded-2xl p-8 border border-indigo-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Still having trouble?</h2>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a 
              href="https://downforeveryoneorjustme.com/mycrochetkit.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-full font-bold shadow-sm border border-indigo-100 dark:border-slate-700 hover:bg-indigo-50 transition-colors"
            >
              Check Site Status <ExternalLink className="h-4 w-4" />
            </a>
            <a 
              href="mailto:support@mycrochetkit.com"
              className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg"
            >
              Email Support
            </a>
          </div>
          <p className="mt-6 text-sm text-neutral-500 dark:text-slate-500 italic">
            Please include your browser version and a screenshot of any error codes if possible!
          </p>
        </section>

      </div>

      {/* Footer Minimal */}
      <footer className="py-12 text-center text-neutral-500 border-t border-neutral-200 dark:border-slate-800">
        <p>&copy; {new Date().getFullYear()} My Crochet Kit Troubleshooting Center</p>
      </footer>
    </div>
  );
}
