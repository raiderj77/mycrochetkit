/**
 * useBilling Hook
 * 
 * React hook for accessing billing config from Firestore
 */

import { useEffect, useState } from "react";
import { BillingConfig, subscribeBilling } from "../lib/billing";

export function useBilling() {
  const [billing, setBilling] = useState<BillingConfig | null>(null);

  useEffect(() => {
    const unsub = subscribeBilling(setBilling);
    return () => unsub();
  }, []);

  return billing;
}
