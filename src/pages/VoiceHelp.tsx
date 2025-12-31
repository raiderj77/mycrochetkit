import { Mic, MicOff, Volume2, Radio, Zap, Settings, ArrowLeft, CheckCircle2, AlertCircle, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function VoiceHelp() {
  const commands = [
    {
      action: 'Next / Increase',
      triggers: ['"Next"', '"Increase"', '"Plus"', '"Up"', '"Add one"', '"One more"'],
      description: 'Increments the active counter by 1.',
      icon: <Zap className="h-5 w-5 text-emerald-500" />
    },
    {
      action: 'Back / Decrease',
      triggers: ['"Back"', '"Decrease"', '"Minus"', '"Down"', '"Subtract"', '"Reduce"'],
      description: 'Decrements the active counter by 1.',
      icon: <ArrowLeft className="h-5 w-5 text-rose-500" />
    },
    {
      action: 'Undo / Mistake',
      triggers: ['"Undo"', '"Oops"', '"Mistake"', '"Go back"', '"Revert"'],
      description: 'Reverts the last action taken on the counter.',
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />
    },
    {
      action: 'Reset / Restart',
      triggers: ['"Reset"', '"Restart"', '"Clear"', '"Start over"', '"Zero"'],
      description: 'Resets the counter to zero.',
      icon: <Settings className="h-5 w-5 text-slate-500" />
    },
    {
      action: 'Stop Listening',
      triggers: ['"Stop"', '"Stop listening"', '"Pause"', '"Off"'],
      description: 'Turns off the microphone and stops voice recognition.',
      icon: <MicOff className="h-5 w-5 text-red-500" />
    }
  ];

  const targets = [
    { name: 'Row', triggers: ['"Row"', '"Rows"'] },
    { name: 'Stitch', triggers: ['"Stitch"', '"Stitches"'] },
    { name: 'Repeat', triggers: ['"Repeat"', '"Repeats"'] },
    { name: 'Custom', triggers: ['"Custom"', '"Counter"'] }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0e14] transition-colors duration-500 pb-20">
      <Helmet>
        <title>Voice Command Guide | My Crochet Kit</title>
        <meta name="description" content="Master hands-free crochet tracking with our voice command guide. Learn trigger words and troubleshooting tips for the ultimate crochet experience." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Link to="/support" className="inline-flex items-center gap-2 text-indigo-300 hover:text-white transition-colors mb-8 font-bold uppercase text-xs tracking-widest">
            <ArrowLeft className="h-4 w-4" />
            Back to Support
          </Link>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Mic className="h-16 w-16 text-indigo-400" />
              <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/20" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Voice Command Guide</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto font-medium text-slate-300 leading-relaxed">
            Hands-free tracking is the "magic" of My Crochet Kit. Here is how to master it and solve common microphone issues.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20 max-w-5xl">
        {/* Core Commands */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
              <CheckCircle2 className="text-indigo-500 h-6 w-6" />
              Action Commands
            </h2>
            <div className="space-y-6">
              {commands.map((cmd, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="mt-1 h-10 w-10 shrink-0 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                    {cmd.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{cmd.action}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {cmd.triggers.map((t, ti) => (
                        <code key={ti} className="text-[10px] font-black uppercase tracking-tighter bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400">
                          {t}
                        </code>
                      ))}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">{cmd.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                <Target className="text-purple-500 h-6 w-6" />
                Target Specific Counters
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                If you have multiple counters (Row and Stitch), you can target them specifically:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {targets.map((t, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{t.name}</p>
                    <div className="flex flex-wrap gap-1">
                      {t.triggers.map((tr, tri) => (
                        <span key={tri} className="text-xs font-bold text-slate-900 dark:text-white">{tr}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30">
                <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  Example: Say <span className="underline">"Next Row"</span> or <span className="underline">"Stitch Plus"</span>
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 shadow-xl text-white">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                <Zap className="h-6 w-6" />
                Quick Pro Tip
              </h2>
              <p className="font-medium opacity-90 leading-relaxed">
                The click of your crochet hooks can sometimes be heard as a syllable! If you experience phantom "Next" commands, try moving your device a few inches further away from your hands.
              </p>
            </div>
          </div>
        </div>

        {/* Troubleshooting Section */}
        <h2 className="text-3xl font-black text-center mb-10 text-slate-900 dark:text-white">Troubleshooting Matrix</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* WebRTC Fix */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="h-12 w-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6">
              <Volume2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Microphone "Dying"</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Chrome's "Auto-Gain" can lower your mic volume until the app can't hear you.
            </p>
            <ol className="list-decimal pl-5 text-xs space-y-3 font-bold text-slate-700 dark:text-slate-300">
              <li>Type <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">chrome://flags</code></li>
              <li>Search "Allow WebRTC to adjust the input volume"</li>
              <li>Set to <span className="text-rose-500">Disabled</span></li>
              <li>Relaunch Chrome</li>
            </ol>
          </div>

          {/* Echo Fix */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
              <Radio className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">The "Echo" Double</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              If using speakers, the app might hear its own confirmation beep as a second command.
            </p>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="mt-1 flex-shrink-0"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Use Headphones: Stops acoustic feedback immediately.</p>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 flex-shrink-0"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Windows Setting: Right-click Speaker &gt; Sounds &gt; Recording &gt; Mic Properties &gt; Enhancements &gt; Check "Echo Cancellation".</p>
              </li>
            </ul>
          </div>

          {/* Pacing Fix */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Change Your Pacing</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Web Speech APIs look for "Final" results. Rapid-fire commands can confuse the processor.
            </p>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="mt-1 flex-shrink-0"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Wait for the beep: Allow 1 second between rows for the browser to finalize the transcript.</p>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 flex-shrink-0"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Be Distinct: "Next Row" is easier for the AI to parse than a short "Next".</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
