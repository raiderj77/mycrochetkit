import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Camera, Share2 } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { useCounterStore, loadCountersFromProjects } from '@/stores/counterStore';
import { Counter } from '@/components/Counter';
import { AddCounterDialog } from '@/components/AddCounterDialog';
import { VoiceControlButton } from '@/components/VoiceControlButton';
import { AddProgressPhotoDialog } from '@/components/AddProgressPhotoDialog';
import { ProgressTimeline } from '@/components/ProgressTimeline';
import ProjectTimer from '@/components/ProjectTimer';
import SellerControls from '@/components/SellerControls';
import { shareContent } from '@/lib/share';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const projects = useProjectStore((state) => state.projects);
  const updateProject = useProjectStore((state) => state.updateProject);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const undo = useCounterStore((state) => state.undo);
  const reset = useCounterStore((state) => state.reset);
  
  const [showAddCounterDialog, setShowAddCounterDialog] = useState(false);
  const [showAddPhotoDialog, setShowAddPhotoDialog] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState<string|null>(null);
  const [activeCounterId, setActiveCounterId] = useState<string|null>(null);
  const [activeTab, setActiveTab] = useState<'counters' | 'progress'>('counters');
  
  const project = projects.find((p) => p.id === id);
  
  useEffect(() => {
    loadCountersFromProjects();
  }, []);
  
  useEffect(() => {
    const firstCounterId = project?.counters?.[0]?.id;
    if (firstCounterId && !activeCounterId) {
      setActiveCounterId(firstCounterId);
    }
  }, [project?.counters, activeCounterId]);
  
  const projectCounters = project?.counters || [];
  
  const calculateProgress = () => {
    const countersWithTargets = projectCounters.filter((c) => c.target && c.target > 0);
    if (countersWithTargets.length === 0) return 0;
    const totalProgress = countersWithTargets.reduce((sum, counter) => {
      const progress = Math.min((counter.current / counter.target!) * 100, 100);
      return sum + progress;
    }, 0);
    return Math.round(totalProgress / countersWithTargets.length);
  };
  
  const progressPercentage = calculateProgress();
  
  const handleDeletePhoto = async (photoId: string) => {
    if (!project) return;
    const updatedPhotos = (project.progressPhotos || []).filter((p) => p.id !== photoId);
    await updateProject(project.id, { progressPhotos: updatedPhotos });
  };

  useEffect(() => {
    if (voiceCommand) {
      const timer = setTimeout(() => setVoiceCommand(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [voiceCommand]);
  
  const handleVoiceCommand = useCallback((command: { 
    command: string; 
    transcript: string;
    counterType?: 'row' | 'stitch' | 'repeat' | 'custom';
  }) => {
    if (!project || project.counters.length === 0) {
      setVoiceCommand('No counters available');
      return;
    }
    
    let targetCounter = project.counters.find((c) => c.id === activeCounterId) || project.counters[0];
    
    if (command.counterType) {
      const foundCounter = project.counters.find(
        (c) => c.type.toLowerCase() === command.counterType!.toLowerCase()
      );
      if (foundCounter) {
        targetCounter = foundCounter;
        setActiveCounterId(foundCounter.id);
      } else {
        setVoiceCommand(`No ${command.counterType} counter found`);
        return;
      }
    }
    
    switch (command.command) {
      case 'increment':
        increment(targetCounter.id);
        setVoiceCommand(`Increased ${targetCounter.name}`);
        break;
      case 'decrement':
        decrement(targetCounter.id);
        setVoiceCommand(`Decreased ${targetCounter.name}`);
        break;
      case 'undo':
        undo(targetCounter.id);
        setVoiceCommand(`Undo ${targetCounter.name}`);
        break;
      case 'reset':
        reset(targetCounter.id);
        setVoiceCommand(`Reset ${targetCounter.name}`);
        break;
    }
  }, [activeCounterId, project, increment, decrement, undo, reset]);

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <div className="card text-center">
          <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">Project Not Found</h2>
          <button onClick={() => navigate('/projects')} className="btn-primary">
            Back to Projects
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0b0e14] text-white p-6 home-page-theme">
      <div className="container mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="tap-target rounded-full p-3 bg-slate-800 hover:bg-slate-700 transition-all text-slate-400"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight text-white mb-1">{project.name}</h1>
              <button
                onClick={() => shareContent({
                  title: `🧶 ${project.name} - My Crochet Kit`,
                  text: `I've reached ${progressPercentage}% progress on my ${project.name} project! Tracking it all with My Crochet Kit.`,
                  url: window.location.href
                })}
                className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-white/5"
                title="Share Progress"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">STARTED {new Date(project.startDate).toLocaleDateString()}</p>
          </div>
          {activeTab === 'counters' ? (
            <button onClick={() => setShowAddCounterDialog(true)} className="btn-pill h-12 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 text-white border border-indigo-400/20">
              <Plus className="h-5 w-5" />NEW COUNTER
            </button>
          ) : (
            <button onClick={() => setShowAddPhotoDialog(true)} className="btn-pill h-12 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 text-white border border-indigo-400/20">
              <Camera className="h-5 w-5" />ADD PHOTO
            </button>
          )}
        </div>
        
        {voiceCommand && (
          <div className="mb-6 rounded-2xl bg-[#a8ffbc]/10 border border-[#a8ffbc]/20 p-4 text-center text-[#a8ffbc] font-black text-xs tracking-widest uppercase animate-pulse">
             {voiceCommand}
          </div>
        )}
        
        <div className="mb-8">
          <ProjectTimer 
            projectId={project.id} 
            initialTotalSeconds={project.totalSeconds || 0} 
            initialHourlyRate={project.hourlyRate || 0}
            initialMaterialCost={project.materialCost || 0}
          />
        </div>
        
        <SellerControls
          projectId={project.id}
          initialForSale={project.isForSale}
          initialPrice={project.price}
          initialLink={project.paymentLink}
        />
        
        {projectCounters.some((c) => c.target && c.target > 0) && (
          <div className="card-neumorphic mb-8 p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Overall Progress</span>
              <span className="text-lg font-black text-indigo-400">{progressPercentage}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-all shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
        )}
        
        <div className="card-neumorphic mb-8 p-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Category</p><p className="font-bold text-white capitalize">{project.category}</p></div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Hook Size</p><p className="font-bold text-white">{project.hookSize || 'Not specified'}</p></div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Status</p><p className="font-bold text-white capitalize">{project.status}</p></div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Difficulty</p><p className="font-bold">{'⭐'.repeat(project.difficulty)}</p></div>
        </div>
        
        <div className="mb-8 flex gap-8 border-b border-white/5">
          <button
            onClick={() => setActiveTab('counters')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'counters' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Counters ({projectCounters.length})
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'progress' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Timeline ({(project.progressPhotos || []).length})
          </button>
        </div>
        
        {activeTab === 'counters' ? (
          projectCounters.length === 0 ? (
            <div className="card-neumorphic text-center py-20">
              <div className="text-7xl mb-6 grayscale opacity-20">🔢</div>
              <h2 className="text-2xl font-black text-white mb-2">NO COUNTERS YET</h2>
              <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">Build your workbench. Track rows, stitches, or custom repeats with your voice.</p>
              <button onClick={() => setShowAddCounterDialog(true)} className="btn-pill h-14 bg-indigo-600 hover:bg-indigo-500 px-10 text-white font-black tracking-widest transition-all">START TRACKING</button>
            </div>
          ) : (
            <>
              <div className="mb-8 py-3 px-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/80">
                Tap counter to activate voice control
              </div>
              <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {projectCounters.map((counter) => (
                  <div
                    key={counter.id}
                    onClick={() => setActiveCounterId(counter.id)}
                    className={`relative cursor-pointer transition-all ${activeCounterId === counter.id ? 'scale-[1.03]' : 'opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'}`}
                  >
                    {activeCounterId === counter.id && (
                      <div className="absolute -right-2 -top-2 z-20 rounded-full bg-[#a8ffbc] px-4 py-1.5 text-[10px] font-black text-[#0b0e14] animate-pulse-soft shadow-[0_0_20px_rgba(168,255,188,0.5)] border border-white/20">
                        LISTENING...
                      </div>
                    )}
                    <Counter counter={counter} />
                  </div>
                ))}
              </div>
            </>
          )
        ) : (
          <ProgressTimeline photos={project.progressPhotos || []} onDelete={handleDeletePhoto} />
        )}
        
        <AddCounterDialog open={showAddCounterDialog} onOpenChange={setShowAddCounterDialog} projectId={project.id} />
        <AddProgressPhotoDialog open={showAddPhotoDialog} onOpenChange={setShowAddPhotoDialog} projectId={project.id} />
        
        {projectCounters.length > 0 && activeTab === 'counters' && (
          <VoiceControlButton onCommand={handleVoiceCommand} />
        )}
      </div>
    </div>
  );
}
