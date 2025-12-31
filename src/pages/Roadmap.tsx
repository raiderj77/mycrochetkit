import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';

interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  votes: number;
}

const Roadmap = () => {
  const [features, setFeatures] = useState<RoadmapFeature[]>([]);

  useEffect(() => {
    const q = query(collection(db, "roadmap"), orderBy("votes", "desc"));
    return onSnapshot(q, (snapshot) => {
      setFeatures(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RoadmapFeature)));
    });
  }, []);

  const handleVote = async (id: string) => {
    const featureRef = doc(db, "roadmap", id);
    await updateDoc(featureRef, { votes: increment(1) });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 sm:p-12 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl mt-12 transition-colors">
      <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 text-center">Community Roadmap 🧶</h2>
      <p className="text-center text-slate-600 dark:text-slate-400 mb-10 text-lg">Vote on what we build next for My Crochet Kit!</p>
      
      <div className="space-y-4">
        {features.length === 0 ? (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500 italic">
            Fetching upcoming features...
          </div>
        ) : (
          features.map((feature) => (
            <div key={feature.id} className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center group hover:border-purple-600 dark:hover:border-purple-500/50 transition-all duration-300">
              <div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{feature.description}</p>
              </div>
              <button 
                onClick={() => handleVote(feature.id)}
                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-6 py-3 rounded-full flex flex-col items-center transition-all hover:scale-105 shadow-xl shadow-purple-500/20"
              >
                <span className="text-xs font-bold uppercase tracking-wider mb-0.5">Vote</span>
                <span className="text-xl font-black">{feature.votes}</span>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-purple-50 dark:bg-purple-600/10 border border-purple-100 dark:border-purple-500/20 text-center transition-colors">
        <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">
          Note: This roadmap is publicly viewable, but only Lifetime Founders can vote! 
          (Actually, currently open to all. We'll add auth gating next.)
        </p>
      </div>
    </div>
  );
};

export default Roadmap;
