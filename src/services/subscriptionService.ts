import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface SubscriptionData {
  isPro: boolean;
  plan: 'free' | 'monthly' | 'yearly' | 'lifetime';
  expiresAt: string | null;
  createdAt: string;
}

const DEFAULT_SUB: SubscriptionData = {
  isPro: false,
  plan: 'free',
  expiresAt: null,
  createdAt: new Date().toISOString(),
};

export async function getSubscription(uid: string): Promise<SubscriptionData> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data();
      if (data.subscription) return data.subscription as SubscriptionData;
    }
    return DEFAULT_SUB;
  } catch {
    return DEFAULT_SUB;
  }
}

export async function setProStatus(uid: string, plan: SubscriptionData['plan'] = 'lifetime'): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    subscription: {
      isPro: true,
      plan,
      expiresAt: plan === 'lifetime' ? null : new Date(Date.now() + 365 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    },
  }, { merge: true });
}
