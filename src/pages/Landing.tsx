/**
 * Landing Page
 * 
 * Original design with Firebase billing config integration,
 * ethical spots remaining logic, and counter demo mockup
 */

import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import Hero from "../components/Hero";
import { goToLifetimeCheckout, goToCheckout } from "../lib/stripe-client";
import PricingTable from "../components/PricingTable";

type BillingConfig = {
  foundersOpen?: boolean;
  lifetimeSpotsRemaining?: number;
};

import { Helmet } from 'react-helmet-async';

export default function Landing() {
  const foundersTotal = 500;
  const [billing, setBilling] = useState<BillingConfig | null>(null);
  const lifetimePrice = 79.99;

  useEffect(() => {
    const ref = doc(db, "appConfig", "billing");
    const unsub = onSnapshot(ref, (snap) => {
      setBilling(snap.exists() ? (snap.data() as BillingConfig) : null);
    });
    return () => unsub();
  }, []);

  const foundersOpen = billing?.foundersOpen === true;

  // Ethical display logic:
  // - Only show "X of 500 remaining" if we actually have a number.
  // - Otherwise show "Up to 500 founder spots" (no fake remaining).
  const remainingText = useMemo(() => {
    const remaining = billing?.lifetimeSpotsRemaining;
    if (typeof remaining === "number" && remaining >= 0) {
      return `🟢 ${remaining} of ${foundersTotal} spots remaining`;
    }
    return `🟢 Up to ${foundersTotal} founder spots`;
  }, [billing?.lifetimeSpotsRemaining]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <Helmet>
        <title>My Crochet Kit | The Hands-Free Voice Row Counter for Crocheters</title>
        <meta name="description" content="Stop losing your place. My Crochet Kit is the first voice-activated row counter that lets you keep your hands on your work while tracking every stitch." />
        <meta property="og:title" content="My Crochet Kit | Hands-Free Crochet Tracking" />
        <meta property="og:description" content="Never lose your place again. The ultimate digital toolkit for smart crocheters." />
        <meta property="og:image" content="https://mycrochetkit.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* Launch Offer Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-800 dark:via-purple-800 dark:to-indigo-800 py-2 px-4 shadow-lg relative z-[60] transition-colors">
        <div className="mx-auto max-w-6xl flex items-center justify-center gap-3 text-center">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white animate-pulse">🎁</span>
          <p className="text-sm font-bold text-white">
            <span className="bg-emerald-500 text-[10px] px-1.5 py-0.5 rounded mr-2 align-middle">NEW</span>
            Launch Offer: Get a <span className="text-emerald-300">$10 Amazon Gift Card</span> for every friend you refer!
            <button 
              onClick={() => goToLifetimeCheckout()}
              className="ml-3 underline hover:text-emerald-200 decoration-emerald-400 font-bold"
            >
              Claim Now &rarr;
            </button>
          </p>
        </div>
      </div>

      {/* Fixed Founders Banner (only if foundersOpen is true) */}
      {foundersOpen && (
        <div className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur transition-colors">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-semibold">
                🎉 <span className="text-slate-900 dark:text-slate-100">Founders Offer:</span>{" "}
                <span className="text-slate-600 dark:text-slate-300">Lifetime Pro access —</span>{" "}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">${lifetimePrice.toFixed(2)} one-time</span>
              </div>
              <div className="text-xs text-slate-400">{remainingText}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToLifetimeCheckout()}
                className="rounded-xl bg-slate-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-slate-900 hover:opacity-90 transition-all"
              >
                Join Now →
              </button>
               <button
                onClick={() => goToLifetimeCheckout()}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-950 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Get Lifetime
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <Hero foundersOpen={foundersOpen} />

      {/* Pricing */}
      <section id="pricing" className="border-t border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Simple pricing.</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">Choose what fits. Upgrade only when you need it.</p>
          <PricingTable />
        </div>
      </section>

      {/* Founders Offer (only if foundersOpen true) */}
      {foundersOpen && (
        <section id="founders" className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950/60 transition-colors">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="rounded-3xl border border-purple-100 dark:border-slate-800 bg-purple-50/50 dark:bg-slate-900/40 p-8 sm:p-12 transition-colors">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white">🎉 Founders Offer</h2>
                  <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">Lifetime Pro. One payment. Forever.</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400 line-through">$99</div>
                  <div className="text-5xl font-black text-purple-600 dark:text-emerald-400">${lifetimePrice.toFixed(2)}</div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Lifetime Pro Access</div>
                </div>
              </div>

              <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                We're offering <span className="font-bold text-slate-900 dark:text-white">500 lifetime memberships</span> to early supporters
                at a founders-only price. When they're gone, they're gone — no fake timers.
              </p>

              <div className="mt-4 text-sm text-slate-400">{remainingText}</div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => goToLifetimeCheckout()}
                  className="inline-flex items-center justify-center rounded-2xl bg-purple-600 px-8 py-4 text-lg font-bold text-white hover:bg-purple-700 shadow-xl shadow-purple-500/20 transition-all active:scale-95"
                >
                  Get Lifetime Access →
                </button>
                <button
                  onClick={() => goToLifetimeCheckout()}
                  className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 py-4 text-lg font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Join Now
                </button>
              </div>

              <div className="mt-5 text-xs text-slate-500">
                Includes all current and future Pro features. No recurring payments. Ever. <br />
                Cloud photo storage limited to <span className="font-semibold text-slate-300">1GB for Lifetime</span>.
                Additional storage may be offered later as optional add-ons.
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="border-t border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Ready to stop losing count?</h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => goToCheckout('pro')}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 dark:bg-white px-8 py-4 text-lg font-bold text-white dark:text-slate-900 hover:opacity-90 shadow-2xl transition-all active:scale-95"
            >
              Get Started — 30-Day Money-Back Guarantee
            </button>
            {foundersOpen && (
              <span className="text-sm text-slate-400">
                Or grab{" "}
                <button 
                  onClick={() => goToLifetimeCheckout()}
                  className="underline hover:text-purple-700 font-bold text-purple-600 dark:text-emerald-400"
                >
                  lifetime access for ${lifetimePrice.toFixed(2)}
                </button>{" "}
                while spots remain.
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
