/**
 * Billing Configuration Library
 * 
 * Centralized billing config from Firestore appConfig/billing
 * Controls: payments, founders, subscriptions, trial days
 */

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export type BillingConfig = {
  paymentsEnabled: boolean;
  foundersOpen: boolean;
  lifetimeSpotsRemaining: number;
  subscriptionsEnabled: boolean;
  trialDays: number;
};

const DEFAULTS: BillingConfig = {
  paymentsEnabled: true,
  foundersOpen: true,
  lifetimeSpotsRemaining: 500,
  subscriptionsEnabled: true,
  trialDays: 14,
};

/**
 * Subscribe to billing config changes from Firestore
 * Returns unsubscribe function
 */
export function subscribeBilling(cb: (cfg: BillingConfig) => void) {
  const ref = doc(db, "appConfig", "billing");
  return onSnapshot(ref, (snap) => {
    const data = (snap.exists() ? snap.data() : {}) as Partial<BillingConfig>;
    cb({ ...DEFAULTS, ...data });
  });
}
