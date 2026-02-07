import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, doc, addDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { events } from '../analytics';
import type { User } from 'firebase/auth';
import { saveProjectsListLocal, getProjectsListLocal, isOnline } from '../lib/offlineDb';
import { Plus, Trash2, ArrowRight, WifiOff, Clock, Sparkles } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export function ProjectsList({ user }: { user: User }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      const cached = await getProjectsListLocal(user.uid);
      if (cached && cached.length > 0) {
        setProjects(cached);
        setLoading(false);
      }

      if (!isOnline()) {
        setLoading(false);
        return;
      }

      const q = query(collection(db, 'users', user.uid, 'projects'), orderBy('updatedAt', 'desc'));
      const unsub = onSnapshot(q, async (snap) => {
        const list: Project[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            name: data.name || 'Untitled',
            notes: data.notes || '',
            createdAt: data.createdAt || '',
            updatedAt: data.updatedAt || '',
          });
        });
        setProjects(list);
        setLoading(false);
        await saveProjectsListLocal(user.uid, list);
      });
      return () => unsub();
    };

    loadProjects();
  }, [user.uid]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || creating || projects.length >= 3) return;
    setCreating(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'projects'), {
        name: newName.trim(),
        notes: '',
        counters: [{ id: '1', name: 'Row', count: 0 }],
        activeId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setNewName('');
      events.createProject();
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'users', user.uid, 'projects', id));
    setDeleteConfirm(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#E86A58]/20 to-[#B8A9C9]/20 flex items-center justify-center">
            <motion.span
              className="text-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              🧶
            </motion.span>
          </div>
          <p className="text-[#2C1810]/70">Loading projects...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      {/* Offline Banner */}
      <AnimatePresence>
        {!online && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#F5E6E0] border border-[#B8A9C9]/30 rounded-2xl p-4 mb-8 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#B8A9C9]/20 flex items-center justify-center">
              <WifiOff className="w-5 h-5 text-[#B8A9C9]" />
            </div>
            <div>
              <p className="text-[#2C1810] font-medium">Offline mode</p>
              <p className="text-[#2C1810]/70 text-sm">
                Showing cached projects. Changes sync when reconnected.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-[#2C1810] mb-1">Your Projects</h2>
          <p className="text-[#2C1810]/70">{projects.length} of 3 free projects</p>
        </div>
        {projects.length < 3 && online && (
          <motion.button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2 !py-2.5 !px-5 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            New Project
          </motion.button>
        )}
      </div>

      {/* New Project Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleCreate}
            className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-[#2C1810]/5"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            <label className="block text-[#2C1810]/70 text-sm mb-2 font-medium">Project name</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Baby Blanket, Cozy Sweater..."
              className="w-full p-4 bg-[#FFF8F0] border border-[#2C1810]/10 rounded-xl text-[#2C1810] placeholder-[#2C1810]/50 focus:outline-none focus:border-[#E86A58]/50 focus:ring-2 focus:ring-[#E86A58]/10 transition-all mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <motion.button
                type="submit"
                disabled={creating || !newName.trim()}
                className="btn-primary flex-1 !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.98 }}
              >
                {creating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Create Project
                  </span>
                )}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary !py-3"
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {projects.length === 0 ? (
        <motion.div
          className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[#2C1810]/5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#F5E6E0] to-[#FFECD2] flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span className="text-5xl">🧶</span>
          </motion.div>
          <h3 className="text-[#2C1810] text-xl font-semibold mb-2">
            {online ? 'No projects yet' : 'No cached projects'}
          </h3>
          <p className="text-[#2C1810]/70 mb-8 max-w-sm mx-auto">
            {online
              ? 'Create your first project and start counting those rows!'
              : 'Connect to the internet to load your projects.'}
          </p>
          {online && (
            <motion.button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              Create First Project
            </motion.button>
          )}
        </motion.div>
      ) : (
        /* Projects Grid */
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <AnimatePresence mode="popLayout">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className="project-card relative group"
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                layout
              >
                {/* Delete Confirmation */}
                <AnimatePresence>
                  {deleteConfirm === project.id && (
                    <motion.div
                      className="absolute inset-0 bg-white rounded-[20px] flex flex-col items-center justify-center z-20 shadow-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="text-[#2C1810] text-center mb-4 px-4">
                        Delete "{project.name}"?
                      </p>
                      <div className="flex gap-3">
                        <motion.button
                          onClick={() => handleDelete(project.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium"
                          whileTap={{ scale: 0.95 }}
                        >
                          Yes, delete
                        </motion.button>
                        <motion.button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-4 py-2 bg-[#F5E6E0] rounded-xl text-[#2C1810]/70 text-sm"
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Card Content */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F5E6E0] to-[#FFECD2] flex items-center justify-center">
                      <span className="text-xl">🧶</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2C1810] text-lg">{project.name}</h3>
                      <p className="text-[#2C1810]/65 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(project.updatedAt)}
                      </p>
                    </div>
                  </div>
                  {online && (
                    <motion.button
                      onClick={() => setDeleteConfirm(project.id)}
                      className="p-2 text-[#2C1810]/40 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>

                {project.notes && (
                  <p className="text-[#2C1810]/70 text-sm mb-4 line-clamp-2">{project.notes}</p>
                )}

                <Link
                  to={`/counter/${project.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#E86A58]/10 to-[#B8A9C9]/10 hover:from-[#E86A58]/20 hover:to-[#B8A9C9]/20 border border-[#E86A58]/20 text-[#E86A58] rounded-xl font-medium transition-all"
                >
                  Open Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Upgrade hint */}
      {projects.length >= 3 && online && (
        <motion.div
          className="mt-8 bg-[#F5E6E0] rounded-2xl p-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-[#2C1810]/70">
            You've reached the free tier limit.
            <span className="text-[#E86A58] font-medium ml-1 cursor-pointer hover:underline">
              Upgrade to Pro
            </span>{' '}
            for unlimited projects.
          </p>
        </motion.div>
      )}
    </div>
  );
}
