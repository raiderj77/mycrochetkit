/**
 * Admin Rewards Page
 * 
 * Lists pending referral rewards for manual fulfillment
 * Admin sends Amazon gift card, then marks as issued
 */

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../stores/useAuthStore';

type Reward = {
  id: string;
  referrerUid: string;
  rewardType: string;
  qualifiedReferralsAtCreation: number;
  eligibleAt?: { toDate: () => Date };
  issued: boolean;
  createdAt?: { toDate: () => Date };
};

export default function AdminRewards() {
  const { user } = useAuthStore();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'referralRewards'),
          where('issued', '==', false),
          where('eligibleAt', '<=', new Date()),
          orderBy('eligibleAt', 'asc')
        );
        const snap = await getDocs(q);
        setRewards(snap.docs.map(d => ({ id: d.id, ...d.data() } as Reward)));
      } catch (err) {
        console.error('Error loading rewards:', err);
      }
      setLoading(false);
    })();
  }, []);

  async function markIssued(id: string) {
    await updateDoc(doc(db, 'referralRewards', id), {
      issued: true,
      issuedAt: serverTimestamp(),
    });
    setRewards(prev => prev.filter(r => r.id !== id));
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <p className="text-neutral-600">Please log in to access admin panel.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-neutral-900 dark:text-neutral-50">
        🎁 Referral Rewards
      </h1>
      <p className="mb-6 text-neutral-600 dark:text-neutral-400">
        Manually send gift cards, then mark as issued.
      </p>

      {loading && <p>Loading…</p>}

      {rewards.length === 0 && !loading && (
        <div className="rounded-xl border border-green-500/30 bg-green-900/20 p-6 text-center">
          <p className="text-green-300">✅ No pending rewards!</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {rewards.map(r => (
          <div 
            key={r.id} 
            className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <div className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-50">
              {r.rewardType === 'AMAZON_10' ? '$10 Amazon Gift Card' : r.rewardType}
            </div>
            <div className="mb-1 text-sm text-neutral-600 dark:text-neutral-400">
              Referrer UID: <code className="text-xs">{r.referrerUid}</code>
            </div>
            <div className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Qualified at: {r.qualifiedReferralsAtCreation} referrals · 
              Eligible since: {r.eligibleAt?.toDate().toLocaleDateString()}
            </div>
            <button 
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              onClick={() => markIssued(r.id)}
            >
              ✓ Mark Issued
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
