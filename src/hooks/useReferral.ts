/**
 * useReferral Hook
 * Manages referral code generation, tracking, and rewards
 */

import { useState, useEffect, useCallback } from 'react';
import {
  createReferralCode,
  getReferralData,
  trackReferral,
  getReferralCodeFromUrl,
  storeReferralCode,
  getStoredReferralCode,
  clearStoredReferralCode,
  calculateRewards,
  type ReferralData,
} from '../services/referralService';

export function useReferral(userId: string | null) {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for referral code in URL on mount
  useEffect(() => {
    const codeFromUrl = getReferralCodeFromUrl();
    if (codeFromUrl) {
      storeReferralCode(codeFromUrl);
    }
  }, []);

  // Load user's referral data
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadReferralData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data = await getReferralData(userId);
        
        // If user doesn't have a code yet, create one
        if (!data) {
          await createReferralCode(userId);
          data = await getReferralData(userId);
        }
        
        setReferralData(data);
      } catch (err) {
        console.error('Error loading referral data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load referral data');
      } finally {
        setLoading(false);
      }
    };

    loadReferralData();
  }, [userId]);

  // Track referral when user completes key action (e.g., creates first project)
  const trackUserReferral = useCallback(async () => {
    if (!userId) return;

    const storedCode = getStoredReferralCode();
    if (!storedCode) return;

    try {
      const result = await trackReferral(storedCode, userId);
      if (result.success) {
        clearStoredReferralCode();
        console.log('Referral tracked successfully');
      }
    } catch (err) {
      console.error('Error tracking referral:', err);
    }
  }, [userId]);

  // Get referral link
  const getReferralLink = useCallback(() => {
    if (!referralData?.code) return null;
    
    const baseUrl = window.location.origin;
    return `${baseUrl}/?ref=${referralData.code}`;
  }, [referralData]);

  // Copy referral link to clipboard
  const copyReferralLink = useCallback(async () => {
    const link = getReferralLink();
    if (!link) return false;

    try {
      await navigator.clipboard.writeText(link);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  }, [getReferralLink]);

  // Calculate current rewards
  const rewards = referralData 
    ? calculateRewards(referralData.referrals)
    : { rewardsEarned: 0, nextRewardAt: 3, maxedOut: false };

  return {
    referralData,
    loading,
    error,
    trackUserReferral,
    getReferralLink,
    copyReferralLink,
    rewards,
  };
}
