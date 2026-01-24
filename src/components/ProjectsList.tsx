import { useState, useEffect } from 'react';
import { collection, doc, addDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import type { User } from 'firebase/auth';
import { saveProjectsListLocal, getProjectsListLocal, isOnline } from '../lib/offlineDb';

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
            updatedAt: data.updatedAt || '' 
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
        name: newName.trim(), notes: '', counters: [{ id: '1', name: 'Row', count: 0 }], activeId: '1',
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      });
      setNewName('');
      setShowForm(false);
    } catch (err) { console.error(err); }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'users', user.uid, 'projects', id));
  };

  if (loading) return <div className="text-white text-center py-12">Loading...</div>;

  return (
    <div>
      {!online && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3 mb-4 text-center text-sm text-yellow-200">
          Offline mode - showing cached projects
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Your Projects ({projects.length}/3)</h2>
        {projects.length < 3 && online && <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-[#4ade80] text-black rounded-full text-sm font-semibold">+ New</button>}
      </div>
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Project name" className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white mb-3" />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 py-2 bg-[#4ade80] text-black rounded-lg font-semibold">{creating ? '...' : 'Create'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-white/10 text-white rounded-lg">Cancel</button>
          </div>
        </form>
      )}
      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-dashed border-white/20 rounded-xl">
          <p className="text-4xl mb-4">🧶</p>
          <p className="text-white mb-4">{online ? 'No projects yet' : 'No cached projects'}</p>
          {online && <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-[#4ade80] text-black rounded-full font-semibold">Create First Project</button>}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold text-white">{p.name}</h3>
                {online && <button onClick={() => handleDelete(p.id)} className="text-red-400 text-sm">Delete</button>}
              </div>
              <p className="text-white/40 text-xs mb-3">Updated {new Date(p.updatedAt).toLocaleDateString()}</p>
              <a href={"/counter/" + p.id} className="block text-center py-2 bg-[#4ade80]/20 text-[#4ade80] rounded-lg">Open</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
