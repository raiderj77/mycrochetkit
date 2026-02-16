import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, Check, Zap } from 'lucide-react';
import { useState } from 'react';

interface ProGateProps {
  isPro: boolean;
  children: React.ReactNode;
  featureName: string;
}

export function ProGate({ isPro, children, featureName }: ProGateProps) {
  const [showModal, setShowModal] = useState(false);
  if (isPro) return <>{children}</>;
  return (
    <>
      <div className="relative" onClick={() => setShowModal(true)}>
        <div className="pointer-events-none opacity-40 blur-[1px] select-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
          <motion.div className="flex flex-col items-center gap-3 px-6 py-5 rounded-2xl bg-gradient-to-br from-[#E86A58]/90 to-[#D35A4A]/90 backdrop-blur-md shadow-xl" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Crown className="w-8 h-8 text-[#3D352E]" />
            <span className="text-[#3D352E] font-bold text-lg">{featureName}</span>
            <span className="text-[#3D352E]/80 text-sm">Tap to unlock with Pro</span>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {showModal && <ProUpgradeModal onClose={() => setShowModal(false)} featureName={featureName} />}
      </AnimatePresence>
    </>
  );
}

function ProUpgradeModal({ onClose, featureName }: { onClose: () => void; featureName: string }) {
  const features = [
    'Unlimited projects (free: 3)',
    'Project timer & seller pricing calculator',
    'Temperature blanket planner',
    'Granny square layout designer',
    'Cloud sync & backup across devices',
    'Priority support',
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 z-[200] flex items-end sm:items-center justify-center sm:p-4">
      <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="w-full sm:max-w-md bg-[#1a1215] rounded-t-3xl sm:rounded-2xl overflow-hidden">
        <div className="relative px-6 pt-8 pb-6 bg-gradient-to-b from-[#E86A58]/20 to-transparent">
          <button onClick={onClose} className="absolute top-4 right-4 text-[#8D7B6A] hover:text-[#3D352E]"><X className="w-5 h-5" /></button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E86A58] to-[#D35A4A] flex items-center justify-center shadow-lg"><Crown className="w-6 h-6 text-[#3D352E]" /></div>
            <div>
              <h2 className="text-[#3D352E] text-xl font-bold">Upgrade to Pro</h2>
              <p className="text-[#746454] text-sm">Unlock {featureName}</p>
            </div>
          </div>
        </div>
        <div className="px-6 pb-4">
          <div className="space-y-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#7FBFA0]/15 flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-[#7FBFA0]" /></div>
                <span className="text-[#3D352E]/80 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 pb-4">
          <div className="p-3 rounded-xl bg-[#7FBFA0]/5 border border-[#7FBFA0]/10">
            <p className="text-[#7FBFA0]/70 text-xs">
              <strong className="text-[#7FBFA0]">Already free:</strong> Voice counter, stitch glossary, yarn calculator, hook converter, C2C generator, pattern notes, yarn substitution, hat calculator, stitch multiples
            </p>
          </div>
        </div>
        <div className="px-6 pb-8 space-y-3">
          <button className="w-full py-4 bg-gradient-to-r from-[#E86A58] to-[#D35A4A] text-[#3D352E] font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow">
            <Zap className="w-5 h-5" /> Lifetime Pro — $59.99
          </button>
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-[#FAF0E4] text-[#3D352E]/80 rounded-xl text-sm font-medium hover:bg-[#FAF0E4] transition-colors">$4.99/mo</button>
            <button className="flex-1 py-3 bg-[#FAF0E4] text-[#3D352E]/80 rounded-xl text-sm font-medium hover:bg-[#FAF0E4] transition-colors">$49.99/yr</button>
          </div>
          <p className="text-[#3D352E]/30 text-xs text-center">Payment coming soon. Join the founders waitlist to lock in pricing.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#E86A58]/20 to-[#D35A4A]/20 text-[#E86A58] text-[10px] font-bold uppercase tracking-wider">
      <Crown className="w-2.5 h-2.5" /> Pro
    </span>
  );
}
