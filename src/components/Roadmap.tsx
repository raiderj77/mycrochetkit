import { useState, useEffect } from 'react';
import { collection, doc, addDoc, updateDoc, onSnapshot, query, orderBy, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import type { User } from 'firebase/auth';

interface Idea {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'planned' | 'in-progress' | 'done';
  votes: string[]; // Array of user IDs who voted
  authorId: string;
  authorName: string;
  createdAt: string;
}

interface RoadmapProps {
  user: User | null;
}

export function Roadmap({ user }: RoadmapProps) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'planned' | 'in-progress' | 'done'>('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load ideas from Firestore
  useEffect(() => {
    const q = query(collection(db, 'roadmap'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedIdeas: Idea[] = [];
      snapshot.forEach((doc) => {
        loadedIdeas.push({ id: doc.id, ...doc.data() } as Idea);
      });
      // Sort by votes (most votes first)
      loadedIdeas.sort((a, b) => b.votes.length - a.votes.length);
      setIdeas(loadedIdeas);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Submit new idea
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'roadmap'), {
        title: title.trim(),
        description: description.trim(),
        status: 'new',
        votes: [user.uid], // Creator auto-votes
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        createdAt: new Date().toISOString()
      });
      setTitle('');
      setDescription('');
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting idea:', error);
      alert('Failed to submit idea. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle vote
  const handleVote = async (idea: Idea) => {
    if (!user) {
      alert('Please sign in to vote!');
      return;
    }

    const ideaRef = doc(db, 'roadmap', idea.id);
    const hasVoted = idea.votes.includes(user.uid);

    try {
      await updateDoc(ideaRef, {
        votes: hasVoted ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const statusColors = {
    'new': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'planned': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'in-progress': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'done': 'bg-green-500/20 text-green-300 border-green-500/30'
  };

  const statusLabels = {
    'new': 'New',
    'planned': 'Planned',
    'in-progress': 'In Progress',
    'done': 'Done'
  };

  const filteredIdeas = filter === 'all' 
    ? ideas 
    : ideas.filter(idea => idea.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f0f1a]/80 border-b border-white/5">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-4 py-3">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#4ade80] to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-lg">🧶</span>
            </div>
            <span className="font-bold text-white">MyCrochetKit</span>
          </a>
          <a href="/" className="text-white/50 hover:text-white text-sm transition-colors">
            ← Back to App
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Product Roadmap</h1>
          <p className="text-white/60">Vote on features you want to see next!</p>
        </div>

        {/* Submit Idea Button */}
        <div className="flex justify-center mb-8">
          {user ? (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-[#4ade80] text-[#0f0f1a] font-semibold rounded-full hover:scale-105 transition-transform"
            >
              {showForm ? 'Cancel' : '+ Submit an Idea'}
            </button>
          ) : (
            <div className="text-center">
              <p className="text-white/50 mb-3">Sign in to submit and vote on ideas</p>
              <a 
                href="/"
                className="inline-block px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors"
              >
                Sign In
              </a>
            </div>
          )}
        </div>

        {/* Submit Form */}
        {showForm && user && (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Submit Your Idea</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Pattern PDF import"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#4ade80]/50"
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your idea in more detail..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#4ade80]/50 resize-none"
                  maxLength={500}
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !title.trim()}
                className="w-full py-3 bg-[#4ade80] text-[#0f0f1a] font-semibold rounded-xl hover:bg-[#22c55e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Idea'}
              </button>
            </div>
          </form>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'new', 'planned', 'in-progress', 'done'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-[#4ade80] text-[#0f0f1a]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {status === 'all' ? 'All' : statusLabels[status]}
            </button>
          ))}
        </div>

        {/* Ideas List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#4ade80]/30 border-t-[#4ade80] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/50">Loading ideas...</p>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-white mb-2">No ideas yet</h3>
            <p className="text-white/50">Be the first to submit an idea!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl p-5 transition-all"
              >
                <div className="flex gap-4">
                  {/* Vote Button */}
                  <button
                    onClick={() => handleVote(idea)}
                    className={`flex flex-col items-center justify-center min-w-[60px] py-2 rounded-xl transition-all ${
                      user && idea.votes.includes(user.uid)
                        ? 'bg-[#4ade80]/20 border-2 border-[#4ade80]'
                        : 'bg-white/5 border-2 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <svg 
                      className={`w-5 h-5 ${user && idea.votes.includes(user.uid) ? 'text-[#4ade80]' : 'text-white/50'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-lg font-bold ${user && idea.votes.includes(user.uid) ? 'text-[#4ade80]' : 'text-white'}`}>
                      {idea.votes.length}
                    </span>
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{idea.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${statusColors[idea.status]}`}>
                        {statusLabels[idea.status]}
                      </span>
                    </div>
                    {idea.description && (
                      <p className="text-white/60 text-sm mb-3">{idea.description}</p>
                    )}
                    <p className="text-white/30 text-xs">
                      by {idea.authorName} • {new Date(idea.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-white/20 text-xs">Made with 💚 for crocheters</p>
      </footer>
    </div>
  );
}
