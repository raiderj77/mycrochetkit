/**
 * Settings Page
 * App configuration and accessibility settings
 */

import { useState, useRef, useEffect } from 'react';
import { Download, Upload, Trash2, AlertTriangle, CreditCard, Crown, ExternalLink, Loader2, Trophy } from 'lucide-react';
import { goToCheckout } from '@/lib/stripe-client';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { collection, query, where, onSnapshot, doc, DocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  downloadBackup,
  importBackup,
  clearAllData,
  getDataStats,
} from '@/utils/dataManagement';

export default function Settings() {
  const { settings, updateSettings, resetToDefaults } = useAccessibility();
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stats = getDataStats();
  
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const result = await importBackup(text);
      
      setImportStatus({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });
      
      if (result.success) {
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch {
      setImportStatus({
        type: 'error',
        message: 'Failed to read file',
      });
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleClearData = () => {
    const confirmed = confirm(
      '⚠️ WARNING: This will delete ALL your projects, patterns, yarn, counters, and photos. This cannot be undone!\n\nAre you absolutely sure?'
    );
    
    if (confirmed) {
      const doubleConfirm = confirm(
        'This is your last chance! All data will be permanently deleted.\n\nProceed with deletion?'
      );
      
      if (doubleConfirm) {
        clearAllData();
        alert('All data has been cleared.');
        window.location.reload();
      }
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold text-neutral-900 dark:text-neutral-50">
        Settings
      </h1>

      {/* Subscription Section */}
      <SubscriptionSection />
      
      {/* Data Management Section */}
      <div className="card mb-6">
        <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          Data Management
        </h2>
        
        {/* Data Statistics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-primary-50 p-4 dark:bg-primary-900/20">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Projects</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.projects}</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Patterns</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.patterns}</p>
          </div>
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Size</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalSize}</p>
          </div>
        </div>
        
        {/* Import Status */}
        {importStatus && (
          <div
            className={`mb-4 rounded-lg p-4 ${
              importStatus.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
            }`}
          >
            {importStatus.message}
          </div>
        )}
        
        {/* Actions */}
        <div className="space-y-4">
          {/* Export Backup */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
            <div className="flex-1">
              <p className="font-medium text-neutral-900 dark:text-neutral-50">
                Export Backup
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Download all your data as a JSON file
              </p>
            </div>
            <button
              onClick={downloadBackup}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              Export
            </button>
          </div>
          
          {/* Import Backup */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
            <div className="flex-1">
              <p className="font-medium text-neutral-900 dark:text-neutral-50">
                Import Backup
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Restore data from a backup file
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file" className="btn-outline flex cursor-pointer items-center gap-2">
                <Upload className="h-5 w-5" />
                Import
              </label>
            </div>
          </div>
          
          {/* Clear All Data */}
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
            <div className="flex-1">
              <p className="font-medium text-red-900 dark:text-red-200 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Clear All Data
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Permanently delete all projects, patterns, and yarn
              </p>
            </div>
            <button
              onClick={handleClearData}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
            >
              <Trash2 className="h-5 w-5" />
              Clear
            </button>
          </div>
        </div>
        
        <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Tip:</strong> Export your data regularly to protect your work! Backups are stored locally on your device.
          </p>
        </div>
      </div>
      
      {/* Accessibility Settings */}
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          Accessibility
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-50">
                Color Scheme
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Current: {settings.colorScheme}
              </p>
            </div>
            <select
              className="input w-40"
              value={settings.colorScheme}
              onChange={(e) =>
                updateSettings({
                  colorScheme: e.target.value as typeof settings.colorScheme,
                })
              }
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="sepia">Sepia</option>
              <option value="high-contrast">High Contrast</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-50">
                Font Size
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Current: {settings.fontSize}
              </p>
            </div>
            <select
              className="input w-40"
              value={settings.fontSize}
              onChange={(e) =>
                updateSettings({
                  fontSize: e.target.value as typeof settings.fontSize,
                })
              }
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="x-large">X-Large</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-50">
                Reduced Motion
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Prevents animations that could cause discomfort
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) =>
                updateSettings({ reducedMotion: e.target.checked })
              }
              className="h-6 w-6"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-50">
                Large Buttons
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Increase button size for easier tapping
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.largeButtons}
              onChange={(e) =>
                updateSettings({ largeButtons: e.target.checked })
              }
              className="h-6 w-6"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={resetToDefaults}
            className="btn-outline"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

function SubscriptionSection() {
  const { tier, status, openCustomerPortal } = useSubscriptionStore();
  const [portalLoading, setPortalLoading] = useState(false);

  const handleManage = async () => {
    setPortalLoading(true);
    try {
      await openCustomerPortal();
    } finally {
      setPortalLoading(false);
    }
  };

  const getTierIcon = () => {
    switch (tier) {
      case 'lifetime': return <Crown className="w-6 h-6 text-purple-500" />;
      case 'pro': return <CreditCard className="w-6 h-6 text-indigo-500" />;
      default: return <CreditCard className="w-6 h-6 text-slate-400" />;
    }
  };

  const getTierLabel = () => {
    if (tier === 'lifetime') return 'Founders Lifetime';
    if (tier === 'pro') return 'Pro Member';
    return 'Free Tier';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 mb-8 border border-slate-100 dark:border-slate-800 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
            {getTierIcon()}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {getTierLabel()}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {status === 'active' ? 'Full access enabled' : status === 'trial' ? 'Trial period active' : 'Limited feature access'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {tier === 'free' ? (
            <button
              onClick={() => goToCheckout('pro')}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/20"
            >
              Upgrade Now
            </button>
          ) : (
            <button
              onClick={handleManage}
              disabled={portalLoading}
              className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              {portalLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
              Manage Billing
            </button>
          )}

          {tier === 'lifetime' && (
            <a
              href="/referrals"
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-100 text-purple-700 font-bold rounded-full hover:bg-purple-200 transition-all"
            >
              <Trophy className="w-4 h-4" />
              Referral Rewards
            </a>
          )}
        </div>
      </div>

      {tier === 'lifetime' && (
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
          <ReferralStatsSection />
        </div>
      )}

      {tier !== 'free' && (
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Billing managed securely via Stripe
          </p>
        </div>
      )}
    </div>
  );
}

function ReferralStatsSection() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalSignups: 0,
    pending: 0,
    completed: 0,
    earnedRewards: 0,
    nextReward: 3
  });

  useEffect(() => {
    if (!user?.uid) return;

    // First get user's referral code
    const userRef = doc(db, "users", user.uid);
    const unsubUser = onSnapshot(userRef, (userSnap: DocumentSnapshot) => {
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const code = userData.referralCode || user.uid.slice(0, 8).toUpperCase();

        // Then watch for signups with that code
        const q = query(
          collection(db, 'users'),
          where('referredByCode', '==', code)
        );

        const unsubStats = onSnapshot(q, (snapshot: QuerySnapshot) => {
          const completed = snapshot.docs.filter((d) => d.data().referralStatus === 'completed').length;
          const pending = snapshot.docs.filter((d) => d.data().referralStatus === 'pending').length;
          const rewards = Math.floor(completed / 3) * 10;

          setStats({
            totalSignups: snapshot.size,
            completed,
            pending,
            earnedRewards: Math.min(100, rewards),
            nextReward: 3 - (completed % 3)
          });
        });

        return () => unsubStats();
      }
    });

    return () => unsubUser();
  }, [user?.uid]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Referral Program
        </h3>
        <a href="/referrals" className="text-sm font-bold text-indigo-600 dark:text-purple-400 hover:underline">
          View Detailed Dashboard &rarr;
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <StatCard label="Total Signups" value={stats.totalSignups} color="slate" />
        <StatCard label="Pending (30d)" value={stats.pending} color="amber" />
        <StatCard label="Completed" value={stats.completed} color="green" />
        <StatCard label="Earned" value={`$${stats.earnedRewards}`} color="indigo" />
        <StatCard label="Until Next" value={stats.nextReward} color="purple" />
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
        <p className="text-xs font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">How it works:</p>
        <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1 ml-4 list-decimal">
          <li>Share your unique referral link from the dashboard</li>
          <li>Friend signs up and purchases any paid plan (Pro or Lifetime)</li>
          <li>After 30 days of active membership, referral is verified</li>
          <li>Every 3 verified referrals = $10 Amazon card (max $100, US Only)</li>
        </ol>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    slate: 'text-slate-600 dark:text-slate-400',
    amber: 'text-amber-600 dark:text-amber-400',
    green: 'text-green-600 dark:text-green-400',
    indigo: 'text-indigo-600 dark:text-purple-400',
    purple: 'text-purple-600 dark:text-indigo-400',
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-sm">
      <div className={`text-xl font-black mb-0.5 ${colors[color]}`}>{value}</div>
      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">{label}</div>
    </div>
  );
}
