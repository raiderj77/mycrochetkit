import { useAuthStore } from '@/stores/useAuthStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { Trophy, Users, Gift, Copy, Check, Clock, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';



interface ReferralRecord {
  id: string;
  status: 'qualified' | 'flagged' | 'pending';
  qualifiedAt?: Timestamp;
}

interface RewardRecord {
  id: string;
  rewardType: string;
  issued: boolean;
  eligibleAt: Timestamp;
  createdAt: Timestamp;
}

export default function ReferralDashboard() {
  const { user } = useAuthStore();
  const { tier } = useSubscriptionStore();
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [rewards, setRewards] = useState<RewardRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || tier !== 'lifetime') return;



    const referralsQuery = query(
      collection(db, 'referrals'),
      where('referrerUid', '==', user.uid),
      where('status', '==', 'qualified')
    );

    const rewardsQuery = query(
      collection(db, 'referralRewards'),
      where('referrerUid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubReferrals = onSnapshot(referralsQuery, (snap) => {
      setReferrals(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReferralRecord)));
    });

    const unsubRewards = onSnapshot(rewardsQuery, (snap) => {
      setRewards(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as RewardRecord)));
      setLoading(false);
    });

    return () => {
      unsubReferrals();
      unsubRewards();
    };
  }, [user, tier]);

  if (tier !== 'lifetime') {
    return (
      <div className="container mx-auto p-6 max-w-4xl text-center min-h-[60vh] flex items-center justify-center">
        <div className="card bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-12 transition-colors">
          <Trophy className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h1 className="text-3xl font-black mb-4 text-slate-900 dark:text-white">Referral Rewards</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto italic">
            The Referral Rewards program is exclusive to our Lifetime community. 
            Upgrade today to start earning $10 Amazon cards for every 3 friends you invite.
          </p>
          <button 
            className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 dark:bg-purple-600 px-8 py-4 text-lg font-bold text-white hover:bg-indigo-700 dark:hover:bg-purple-700 shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
            onClick={() => window.location.href = '/pricing'}
          >
            Upgrade to Lifetime
          </button>
        </div>
      </div>
    );
  }

  const referralCode = user?.uid?.slice(0, 8).toUpperCase() || 'INVITE';
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qualifiedCount = referrals.length;
  const progressToNext = qualifiedCount % 3;
  const progressPercent = (progressToNext / 3) * 100;

  return (
    <div className="container mx-auto p-6 max-w-5xl transition-colors">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 transition-colors">Referral Rewards 🎁</h1>
        <p className="text-slate-600 dark:text-slate-400">Give $5 off, get $10 Amazon rewards. Simple.</p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
        {/* Referral Link Card */}
        <div className="md:col-span-2 lg:col-span-2 card border-primary-100 dark:border-purple-900/40 bg-primary-50/30 dark:bg-purple-900/10 transition-colors">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary-700 dark:text-purple-300">
            <Gift className="text-primary-600 dark:text-purple-400 w-5 h-5" />
            Your Referral Link
          </h2>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-primary-200 dark:border-purple-800 shadow-sm transition-colors">
            <code className="text-sm md:text-base font-mono font-bold flex-1 truncate text-slate-700 dark:text-slate-200">{referralLink}</code>
            <button 
              onClick={copyToClipboard}
              className="p-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl transition-colors shrink-0"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Friends get <span className="font-bold text-slate-700">$5 off</span> their first purchase. 
            You get a <span className="font-bold text-slate-700">$10 Amazon card</span> for every 3 friends who join Lifetime Pro.
          </p>
        </div>

        {/* Progress Card */}
        <div className="card flex flex-col justify-between border-slate-200 dark:border-slate-800 transition-colors">
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Trophy className="text-amber-500 w-5 h-5" />
              Progress
            </h2>
            <div className="flex justify-between items-end mb-2">
              <div className="text-4xl font-black text-slate-900 dark:text-white transition-colors">{qualifiedCount}</div>
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Confirmed Joins</div>
            </div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3 border border-slate-200 dark:border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.4)]" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center uppercase tracking-wide transition-colors">
            {progressToNext === 0 && qualifiedCount > 0 
              ? "All caught up! Next join starts your next reward."
              : `${3 - progressToNext} more to earn your next reward`}
          </p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3 mt-4">
        {/* Rewards History */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2 text-slate-900 dark:text-white transition-colors">
            <Award className="text-indigo-600 dark:text-purple-400 w-6 h-6" />
            Reward History
          </h2>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-20 bg-slate-100 rounded-2xl w-full"></div>
              <div className="h-20 bg-slate-100 rounded-2xl w-full"></div>
            </div>
          ) : rewards.length === 0 ? (
            <div className="card border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-10 text-center transition-colors">
              <Clock className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No rewards earned yet. Share your link to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rewards.map(reward => {
                const eligibleDate = reward.eligibleAt?.toDate();
                const isEligible = eligibleDate && new Date() >= eligibleDate;
                const dateLabel = isEligible ? "Verified" : `Verifying (Eligible ${eligibleDate?.toLocaleDateString()})`;

                return (
                  <div key={reward.id} className="card flex items-center justify-between p-5 group border-slate-200 dark:border-slate-800 dark:bg-slate-900/50 hover:border-indigo-400 dark:hover:border-purple-500 transition-all">
                    <div className="flex gap-4 items-center">
                      <div className={`p-3 rounded-2xl ${reward.issued ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'} transition-colors`}>
                        <Gift className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white transition-colors">$10 Amazon Gift Card</div>
                        <div className="text-xs flex items-center gap-1 mt-1 text-slate-500 font-medium">
                          {reward.issued ? (
                            <span className="flex items-center gap-1 text-green-600 font-bold">
                              <Check className="w-3 h-3" /> Sent to your email
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {dateLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2 text-slate-900 dark:text-white transition-colors">
              <Users className="text-blue-500 dark:text-blue-400 w-5 h-5" />
              How it Works
            </h2>
            <div className="space-y-6">
              <Step num={1} title="Invite Friends" desc="Send your unique link to fellow crocheters." color="blue" />
              <Step num={2} title="They Join Lifetime" desc="Your friend gets $5 off and joins the Lifetime community." color="green" />
              <Step num={3} title="Verification" desc="Rewards are locked for 30 days to ensure non-canceled orders." color="amber" />
              <Step num={4} title="Get Rewarded" desc="Once verified, we email your $10 Amazon card automatically." color="indigo" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ num, title, desc, color }: { num: number; title: string; desc: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    indigo: 'bg-indigo-100 text-indigo-700',
  };

  return (
    <div className="flex gap-4">
      <div className={`w-8 h-8 rounded-full ${colors[color]} flex-shrink-0 flex items-center justify-center font-bold text-sm`}>
        {num}
      </div>
      <div>
        <p className="font-bold text-slate-900 text-sm">{title}</p>
        <p className="text-xs text-slate-500 leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}
