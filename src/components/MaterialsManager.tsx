/**
 * Materials Manager Component
 * 
 * Manage yarn allocations and materials for a project.
 * Integrates with the stash for automatic cost calculation.
 */

import { useState } from 'react';
import { Package, Plus, Trash2, Calculator, Info } from 'lucide-react';
import { useStashStore } from '@/stores/stashStore';
import { useProjectStore } from '@/stores/projectStore';
import type { Project, YarnAllocation } from '@/types/models';

interface MaterialsManagerProps {
  project: Project;
}

export function MaterialsManager({ project }: MaterialsManagerProps) {
  const stash = useStashStore((state) => state.stash);
  const updateProject = useProjectStore((state) => state.updateProject);
  
  const [isAddingYarn, setIsAddingYarn] = useState(false);
  const [selectedYarnId, setSelectedYarnId] = useState('');
  const [skeinsUsed, setSkeinsUsed] = useState(1);
  const [yardageUsed, setYardageUsed] = useState(0);

  const handleAddYarn = async () => {
    if (!selectedYarnId) return;
    
    const yarn = stash.find(y => y.id === selectedYarnId);
    const newAllocation: YarnAllocation = {
      yarnId: selectedYarnId,
      skeinsUsed: skeinsUsed,
      yardageUsed: yardageUsed || (yarn ? yarn.yardagePerSkein * skeinsUsed : 0),
    };

    const updatedYarns = [...(project.yarnsUsed || []), newAllocation];
    
    // Use the component's calculation logic for consistency
    const calculateCostForYarns = (yarns: YarnAllocation[]) => {
      return yarns.reduce((total, acc) => {
        const y = stash.find(item => item.id === acc.yarnId);
        return total + (acc.skeinsUsed * (y?.purchasePrice || 0));
      }, 0);
    };

    await updateProject(project.id, { 
      yarnsUsed: updatedYarns,
      materialCost: calculateCostForYarns(updatedYarns)
    });

    setIsAddingYarn(false);
    setSelectedYarnId('');
    setSkeinsUsed(1);
    setYardageUsed(0);
  };

  const handleRemoveYarn = async (index: number) => {
    const updatedYarns = (project.yarnsUsed || []).filter((_, i) => i !== index);
    
    const newMaterialCost = updatedYarns.reduce((total, acc) => {
      const y = stash.find(item => item.id === acc.yarnId);
      return total + (acc.skeinsUsed * (y?.purchasePrice || 0));
    }, 0);

    await updateProject(project.id, { 
      yarnsUsed: updatedYarns, 
      materialCost: newMaterialCost 
    });
  };

  return (
    <div className="card-neumorphic p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">Project Materials</h3>
        </div>
        <button
          onClick={() => setIsAddingYarn(true)}
          className="btn-pill px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30 flex items-center gap-2 transition-all"
        >
          <Plus className="h-4 w-4" /> ALLOCATE YARN
        </button>
      </div>

      {/* Allocated Yarn List */}
      <div className="space-y-4 mb-6">
        {(project.yarnsUsed || []).length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-2xl">
            <p className="text-slate-500 text-sm">No yarn allocated to this project yet.</p>
          </div>
        ) : (
          project.yarnsUsed.map((allocation, index) => {
            const yarn = stash.find((y) => y.id === allocation.yarnId);
            return (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4">
                  {yarn?.photo ? (
                    <img src={yarn.photo} alt={yarn.colorway} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-xl">🧶</div>
                  )}
                  <div>
                    <h4 className="font-bold text-white">{yarn?.brand} {yarn?.line}</h4>
                    <p className="text-xs text-slate-400">{yarn?.colorway} • {allocation.skeinsUsed} skeins ({allocation.yardageUsed} yds)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-400">
                      ${((yarn?.purchasePrice || 0) * allocation.skeinsUsed).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase font-black">Cost</p>
                  </div>
                  <button
                    onClick={() => handleRemoveYarn(index)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cost Summary Integration */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Integrated Material Cost</p>
            <p className="text-slate-400 text-[10px]">Automatically synced from allocated stash items.</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-white">${(project.materialCost || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Add Yarn Dialog (Inline for simplicity or use a real Dialog) */}
      {isAddingYarn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#161b22] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-6">Allocate from Stash</h3>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Select Yarn</label>
                <select
                  value={selectedYarnId}
                  onChange={(e) => setSelectedYarnId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Choose from your stash...</option>
                  {stash.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.brand} {y.line} - {y.colorway} ({y.yardageRemaining} yds left)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Skeins Used</label>
                  <input
                    type="number"
                    step="0.1"
                    value={skeinsUsed}
                    onChange={(e) => setSkeinsUsed(parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Yardage Used</label>
                  <input
                    type="number"
                    value={yardageUsed}
                    onChange={(e) => setYardageUsed(parseInt(e.target.value))}
                    placeholder="Auto-calculated"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              
              {selectedYarnId && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                  <Info className="h-4 w-4 text-green-400" />
                  <p className="text-xs text-green-300">
                    Estimated cost: <span className="font-bold">${((stash.find(y => y.id === selectedYarnId)?.purchasePrice || 0) * skeinsUsed).toFixed(2)}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsAddingYarn(false)}
                className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all"
              >
                CANCEL
              </button>
              <button
                onClick={handleAddYarn}
                disabled={!selectedYarnId}
                className="flex-1 px-6 py-4 rounded-2xl bg-indigo-600 text-white font-black tracking-widest hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ALLOCATE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
