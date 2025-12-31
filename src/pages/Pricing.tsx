import PricingTable from '../components/PricingTable';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-indigo-950/30 py-12 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 transition-colors">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            30-Day Risk-Free Guarantee. Cancel anytime.
          </p>
        </div>

        <PricingTable showAnnualDefault={false} />

        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 sm:p-12 border border-slate-100 dark:border-slate-800 transition-colors mt-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <FAQItem
              question="Is there a money-back guarantee?"
              answer="Yes! We offer a 30-Day Risk-Free Guarantee. If you're not satisfied within the first month, we'll provide a full refund, no questions asked."
            />
            <FAQItem
              question="Can I upgrade or downgrade later?"
              answer="Yes! You can change your plan anytime from your account settings. Upgrades take effect immediately, downgrades at the end of your billing period."
            />
            <FAQItem
              question="Does Lifetime include future updates?"
              answer="Yes! Lifetime members get access to all current and future Pro features forever, plus exclusive perks like 0% commission selling."
            />
            <FAQItem
              question="Can I cancel anytime?"
              answer="Absolutely! No contracts, no commitments. Cancel from your account settings and you'll retain access until the end of your billing period."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0 transition-colors">
      <h3 className="font-bold text-slate-900 dark:text-white mb-2 transition-colors">{question}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">{answer}</p>
    </div>
  );
}
