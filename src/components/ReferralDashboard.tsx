import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Gift, Users, DollarSign } from 'lucide-react';
import { useReferral } from '../hooks/useReferral';

interface ReferralDashboardProps {
  userId: string;
}

export function ReferralDashboard({ userId }: ReferralDashboardProps) {
  const { referralData, loading, getReferralLink, copyReferralLink, rewards } = useReferral(userId);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyReferralLink();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!referralData) {
    return null;
  }

  const referralLink = getReferralLink();
  const progress = ((referralData.referrals % 3) / 3) * 100;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Referrals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#7FBFA0] to-[#6AA88A] rounded-2xl p-6 text-white"
        >
          <Users className="w-8 h-8 mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">{referralData.referrals}</div>
          <div className="text-sm opacity-90">Total Referrals</div>
        </motion.div>

        {/* Rewards Earned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#E86A58] to-[#D35A4A] rounded-2xl p-6 text-white"
        >
          <DollarSign className="w-8 h-8 mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">${rewards.rewardsEarned}</div>
          <div className="text-sm opacity-90">Rewards Earned</div>
        </motion.div>

        {/* Next Reward */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#B8A9C9] to-[#9B8AAC] rounded-2xl p-6 text-white"
        >
          <Gift className="w-8 h-8 mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">
            {rewards.maxedOut ? '🎉' : `${rewards.nextRewardAt - referralData.referrals}`}
          </div>
          <div className="text-sm opacity-90">
            {rewards.maxedOut ? 'Max Rewards!' : 'Until Next $10'}
          </div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      {!rewards.maxedOut && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#2C1810]">
              Progress to next reward
            </span>
            <span className="text-sm text-[#2C1810]/60">
              {referralData.referrals % 3}/3 referrals
            </span>
          </div>
          <div className="w-full h-3 bg-[#2C1810]/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#7FBFA0] to-[#6AA88A] rounded-full"
            />
          </div>
        </motion.div>
      )}

      {/* Referral Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6"
      >
        <h3 className="font-semibold text-[#2C1810] mb-3">Your Referral Link</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink || ''}
            readOnly
            className="flex-1 px-4 py-3 bg-[#FFF8F0] border border-[#2C1810]/10 rounded-xl text-sm text-[#2C1810] font-mono"
          />
          <button
            onClick={handleCopy}
            className="px-6 py-3 bg-[#E86A58] hover:bg-[#D35A4A] text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
        <p className="text-sm text-[#2C1810]/60 mt-3">
          Share this link with friends. When they sign up and create their first project, you both
          earn rewards!
        </p>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-[#FFF8F0] rounded-2xl p-6 border border-[#2C1810]/5"
      >
        <h3 className="font-semibold text-[#2C1810] mb-4">How Referral Rewards Work</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#7FBFA0]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#7FBFA0] text-sm font-semibold">1</span>
            </div>
            <div className="text-sm text-[#2C1810]/70">
              Share your referral link with friends who love crochet
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#7FBFA0]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#7FBFA0] text-sm font-semibold">2</span>
            </div>
            <div className="text-sm text-[#2C1810]/70">
              When they sign up and create their first project, it counts as a referral
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#7FBFA0]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#7FBFA0] text-sm font-semibold">3</span>
            </div>
            <div className="text-sm text-[#2C1810]/70">
              Earn <strong>$10 Amazon gift card</strong> for every 3 successful referrals (max
              $100)
            </div>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
