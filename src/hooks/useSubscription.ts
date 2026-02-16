import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { getSubscription, type SubscriptionData } from '../services/subscriptionService';

export function useSubscription(user: User | null) {
  const [sub, setSub] = useState<SubscriptionData>({
    isPro: false, plan: 'free', expiresAt: null, createdAt: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSub({ isPro: false, plan: 'free', expiresAt: null, createdAt: '' });
      setLoading(false);
      return;
    }
    let cancelled = false;
    getSubscription(user.uid).then((s) => {
      if (!cancelled) {
        setSub(s);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [user?.uid]);

  return { ...sub, loading };
}
