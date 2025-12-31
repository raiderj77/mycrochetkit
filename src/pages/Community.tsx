import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { MessageSquare, Heart, Share2, Flag, Ban } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreatePost from '../components/CreatePost';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  getDoc
} from 'firebase/firestore';

interface Post {
  id: string;
  content: string;
  yarn?: string; // Materials used (for affiliate links)
  authorId: string;
  authorEmail: string;
  createdAt: any;
  likes: number;
}

export default function Community() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  useEffect(() => {
    // Real-time listener for posts
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching posts:', error);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Load blocked users
  useEffect(() => {
    if (!user) return;
    
    const loadBlockedUsers = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setBlockedUsers(data.blockedUsers || []);
      }
    };
    
    loadBlockedUsers();
  }, [user]);

  // Report Post
  const handleReportPost = async (postId: string, postAuthorId: string) => {
    if (!user) {
      alert('You must be logged in to report posts.');
      return;
    }

    const reason = prompt('Why are you reporting this post?\n\nOptions:\n1. Spam\n2. Harassment\n3. Copyright Violation\n4. Other\n\nEnter 1, 2, 3, or 4:');
    
    if (!reason) return;

    const reasonMap: { [key: string]: string } = {
      '1': 'spam',
      '2': 'harassment',
      '3': 'copyright',
      '4': 'other'
    };

    try {
      await addDoc(collection(db, 'reports'), {
        postId,
        postAuthorId,
        reportedBy: user.uid,
        reporterEmail: user.email,
        reason: reasonMap[reason] || 'other',
        timestamp: serverTimestamp(),
        status: 'pending'
      });
      
      alert('Post reported. Our team will review it shortly.');
    } catch (error) {
      console.error('Error reporting post:', error);
      alert('Failed to report post. Please try again.');
    }
  };

  // Block User
  const handleBlockUser = async (userId: string, userEmail: string) => {
    if (!user) {
      alert('You must be logged in to block users.');
      return;
    }

    const confirmed = confirm(`Block ${userEmail}? You won't see their posts anymore.`);
    if (!confirmed) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        blockedUsers: arrayUnion(userId)
      });
      
      setBlockedUsers([...blockedUsers, userId]);
      alert(`Blocked ${userEmail}`);
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('Failed to block user. Please try again.');
    }
  };

  // Helper to format timestamp
  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Filter out posts from blocked users
  const visiblePosts = posts.filter(post => !blockedUsers.includes(post.authorId));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Community</h1>
        <p className="text-gray-600 mt-1">Connect with other crocheters</p>
      </div>

      {/* Create Post Component - Only show if user is logged in */}
      {user ? (
        <CreatePost />
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-center">
          <p className="text-blue-900 mb-3">Join the conversation!</p>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Log in to Post
          </Link>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading posts...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {visiblePosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {post.authorEmail?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.authorEmail}</p>
                      <p className="text-xs text-gray-500">{formatTime(post.createdAt)}</p>
                    </div>
                    
                    {/* Report & Block Menu */}
                    {user && post.authorId !== user.uid && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReportPost(post.id, post.authorId)}
                          className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                          title="Report this post"
                        >
                          <Flag className="h-3 w-3" />
                          Report
                        </button>
                        <button
                          onClick={() => handleBlockUser(post.authorId, post.authorEmail)}
                          className="text-xs text-gray-600 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                          title="Block this user"
                        >
                          <Ban className="h-3 w-3" />
                          Block
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="mt-3 text-gray-800 whitespace-pre-wrap">{post.content}</p>
                  
                  {/* Amazon Affiliate Button - "Shop This Project" */}
                  {post.yarn && (
                    <div className="mt-3 bg-yellow-50 p-3 rounded-md border border-yellow-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Materials Used</p>
                        <p className="text-sm font-medium text-gray-800">🧶 {post.yarn}</p>
                      </div>
                      
                      <a 
                        href={`https://www.amazon.com/s?k=${encodeURIComponent(post.yarn + " yarn")}&tag=your-tag-20`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-3 py-2 rounded-full shadow-sm transition-colors flex items-center gap-1 whitespace-nowrap"
                      >
                        🛒 Buy this Yarn
                      </a>
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-center space-x-6">
                    <button 
                      onClick={async () => {
                        if (!user) {
                          alert('Please log in to like posts');
                          return;
                        }
                        try {
                          await updateDoc(doc(db, 'posts', post.id), {
                            likes: (post.likes || 0) + 1
                          });
                        } catch (error) {
                          console.error('Error liking post:', error);
                        }
                      }}
                      className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Heart className="h-5 w-5 mr-1" />
                      <span className="text-sm">{post.likes || 0}</span>
                    </button>
                    <button 
                      onClick={() => {
                        alert('Reply feature coming soon! For now, create a new post to respond.');
                      }}
                      className="flex items-center text-gray-500 hover:text-indigo-500 transition-colors"
                    >
                      <MessageSquare className="h-5 w-5 mr-1" />
                      <span className="text-sm">Reply</span>
                    </button>
                    <button 
                      onClick={async () => {
                        const shareData = {
                          title: `Post by ${post.authorEmail}`,
                          text: post.content,
                          url: window.location.href
                        };
                        
                        // Try native share API (mobile)
                        if (navigator.share) {
                          try {
                            await navigator.share(shareData);
                          } catch (error) {
                            if ((error as Error).name !== 'AbortError') {
                              console.error('Share error:', error);
                            }
                          }
                        } else {
                          // Fallback: copy to clipboard
                          try {
                            await navigator.clipboard.writeText(`${post.content}\n\nShared from My Crochet Kit`);
                            alert('Post copied to clipboard!');
                          } catch (error) {
                            console.error('Copy error:', error);
                            alert('Unable to share. Please try again.');
                          }
                        }
                      }}
                      className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
