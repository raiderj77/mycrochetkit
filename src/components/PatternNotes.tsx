import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, AlertCircle, Star, Bookmark } from 'lucide-react';

interface RowNote {
  id: string;
  row: number;
  text: string;
  type: 'note' | 'warning' | 'highlight' | 'modification';
  createdAt: string;
}

interface PatternNotesProps {
  projectId: string;
  currentRow: number;
  onSave: (notes: RowNote[]) => void;
  initialNotes?: RowNote[];
}

const NOTE_TYPES = [
  { value: 'note', label: 'Note', icon: FileText, color: '#7FBFA0' },
  { value: 'warning', label: 'Warning', icon: AlertCircle, color: '#E86A58' },
  { value: 'highlight', label: 'Important', icon: Star, color: '#eab308' },
  { value: 'modification', label: 'Modified', icon: Bookmark, color: '#B8A9C9' },
] as const;

export function PatternNotes({ projectId: _projectId, currentRow, onSave, initialNotes = [] }: PatternNotesProps) {
  const [notes, setNotes] = useState<RowNote[]>(initialNotes);
  const [showForm, setShowForm] = useState(false);
  const [newRow, setNewRow] = useState(currentRow.toString());
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState<RowNote['type']>('note');

  const addNote = () => {
    if (!newText.trim()) return;
    const note: RowNote = {
      id: Date.now().toString(),
      row: parseInt(newRow) || currentRow,
      text: newText.trim(),
      type: newType,
      createdAt: new Date().toISOString(),
    };
    const next = [...notes, note].sort((a, b) => a.row - b.row);
    setNotes(next);
    onSave(next);
    setNewText('');
    setShowForm(false);
  };

  const deleteNote = (id: string) => {
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    onSave(next);
  };

  const nearbyNotes = notes.filter((n) => Math.abs(n.row - currentRow) <= 2);
  const allOtherNotes = notes.filter((n) => Math.abs(n.row - currentRow) > 2);

  const getTypeConfig = (type: RowNote['type']) =>
    NOTE_TYPES.find((t) => t.value === type) || NOTE_TYPES[0];

  return (
    <div className="space-y-4">
      {nearbyNotes.length > 0 && (
        <div className="space-y-2">
          {nearbyNotes.map((note) => {
            const cfg = getTypeConfig(note.type);
            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-4 border-l-4"
                style={{ borderLeftColor: cfg.color }}
              >
                <div className="flex items-start gap-3">
                  <cfg.icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: cfg.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.color + '20', color: cfg.color }}>
                        Row {note.row}
                      </span>
                      {note.row === currentRow && (
                        <span className="text-[10px] text-[#8D7B6A] uppercase">{'\u2190'} current row</span>
                      )}
                    </div>
                    <p className="text-[#3D352E]/80 text-sm">{note.text}</p>
                  </div>
                  <button onClick={() => deleteNote(note.id)} className="text-[#3D352E]/20 hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="glass-card p-4">
        {!showForm ? (
          <motion.button
            onClick={() => { setShowForm(true); setNewRow(currentRow.toString()); }}
            className="w-full flex items-center justify-center gap-2 py-3 text-[#746454] hover:text-[#3D352E] transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Note at Row {currentRow}</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            <div className="flex gap-2">
              <div className="w-20">
                <label className="text-[#746454] text-xs mb-1 block">Row #</label>
                <input
                  type="number"
                  value={newRow}
                  onChange={(e) => setNewRow(e.target.value)}
                  className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-2 py-2 text-[#3D352E] text-sm text-center focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="text-[#746454] text-xs mb-1 block">Type</label>
                <div className="flex gap-1">
                  {NOTE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setNewType(t.value)}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-colors ${
                        newType === t.value ? 'text-[#3D352E]' : 'text-[#8D7B6A] bg-[#FAF0E4]'
                      }`}
                      style={newType === t.value ? { backgroundColor: t.color + '30', color: t.color } : {}}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="e.g. Switch to color B here, increase 2 stitches evenly..."
              className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2 text-[#3D352E] text-sm focus:outline-none resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 bg-[#FAF0E4] text-[#746454] rounded-lg text-sm">
                Cancel
              </button>
              <motion.button onClick={addNote} className="flex-1 py-2 bg-[#7FBFA0] text-[#3D352E] rounded-lg text-sm font-medium" whileTap={{ scale: 0.95 }}>
                Save Note
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {allOtherNotes.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="p-4">
            <span className="text-[#746454] text-xs uppercase tracking-wider">All Notes ({notes.length})</span>
          </div>
          <div className="border-t border-[#EDE8E3] divide-y divide-white/5 max-h-64 overflow-y-auto">
            {notes.map((note) => {
              const cfg = getTypeConfig(note.type);
              return (
                <div key={note.id} className="px-4 py-3 flex items-start gap-3">
                  <cfg.icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: cfg.color }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold mr-2" style={{ color: cfg.color }}>R{note.row}</span>
                    <span className="text-[#746454] text-xs">{note.text}</span>
                  </div>
                  <button onClick={() => deleteNote(note.id)} className="text-[#3D352E]/15 hover:text-red-400 flex-shrink-0">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
