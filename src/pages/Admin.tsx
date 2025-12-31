/**
 * Admin Dashboard
 * For reviewing reported posts and managing content
 * Protected route - only accessible to admins
 */

import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Flag, Trash2, Eye, CheckCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  getDoc
} from 'firebase/firestore';

interface Report {
  id: string;
  postId: string;
  postAuthorId: string;
  reportedBy: string;
  reporterEmail: string;
  reason: string;
  timestamp: { toDate: () => Date } | null;
  status: 'pending' | 'reviewed' | 'dismissed';
}

export default function Admin() {
  const { user, initialized } = useAuthStore();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [postContents, setPostContents] = useState<{ [key: string]: string }>({});

  const ADMIN_EMAILS = ['support@mycrochetkit.com']; // Sync with SecretAdminLogin.tsx
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');

  useEffect(() => {
    if (!initialized) return;
    
    if (!isAdmin) {
      navigate('/');
      return;
    }

    // Load reports
    const reportsQuery = query(
      collection(db, 'reports'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(reportsQuery, async (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Report[];
      
      setReports(reportsData);

      // Load post contents for each report
      const contents: { [key: string]: string } = {};
      for (const report of reportsData) {
        try {
          const postDoc = await getDoc(doc(db, 'posts', report.postId));
          if (postDoc.exists()) {
            contents[report.postId] = postDoc.data().content;
          } else {
            contents[report.postId] = '[Post deleted]';
          }
        } catch {
          contents[report.postId] = '[Error loading]';
        }
      }
      setPostContents(contents);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching reports:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, navigate, initialized]);

  const handleDeletePost = async (postId: string, reportId: string) => {
    const confirmed = confirm('Delete this post permanently?');
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'posts', postId));
      await updateDoc(doc(db, 'reports', reportId), { status: 'reviewed' });
      alert('Post deleted');
    } catch (err: unknown) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  const handleDismissReport = async (reportId: string) => {
    try {
      await updateDoc(doc(db, 'reports', reportId), { status: 'dismissed' });
      alert('Report dismissed');
    } catch (err: unknown) {
      console.error('Error dismissing report:', err);
      alert('Failed to dismiss report');
    }
  };

  if (!isAdmin) {
    return null; // Redirecting...
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          Admin Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Manage reported posts and moderate content
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-neutral-500">Loading reports...</div>
        </div>
      ) : reports.length === 0 ? (
        <div className="card text-center py-12">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            No Reports
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            All clear! No posts have been reported.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className={`card ${
                report.status === 'pending'
                  ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/10'
                  : 'opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Flag className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-600 uppercase">
                      {report.reason}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      report.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : report.status === 'reviewed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      Reported by: {report.reporterEmail} •{' '}
                      {report.timestamp?.toDate?.().toLocaleString() || 'Just now'}
                    </p>
                    <div className="p-3 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
                      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                        Reported Post:
                      </p>
                      <p className="text-neutral-900 dark:text-neutral-50 whitespace-pre-wrap">
                        {postContents[report.postId] || 'Loading...'}
                      </p>
                    </div>
                  </div>

                  {report.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeletePost(report.postId, report.id)}
                        className="btn-primary bg-red-600 hover:bg-red-700 flex items-center gap-2 text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Post
                      </button>
                      <button
                        onClick={() => handleDismissReport(report.id)}
                        className="btn-outline text-sm flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Dismiss Report
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-700">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Admin Access
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          This page is only accessible to admin users. Current admin emails are hardcoded in <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Admin.tsx</code>.
          In production, use Firebase custom claims for proper role management.
        </p>
      </div>
    </div>
  );
}
