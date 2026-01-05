/**
 * PDF Viewer Component
 * 
 * Renders PDF files using PDF.js with zoom and page navigation
 */

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, X, Plus, Minus, RotateCcw } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';

// Set worker source for better performance and thread management
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

import { StickyNote, Trash2, Edit3 } from 'lucide-react';

interface PDFNote {
  id: string;
  page: number;
  x: number;
  y: number;
  text: string;
}

interface PDFViewerProps {
  pdfBase64: string;
  onError?: (error: Error) => void;
}

export function PDFViewer({ pdfBase64, onError }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showHighlighter, setShowHighlighter] = useState(false);
  const [highlighterTop, setHighlighterTop] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [notes, setNotes] = useState<PDFNote[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [highlightColor, setHighlightColor] = useState('rgba(255, 255, 0, 0.4)'); // Default yellow
  const [showQuickRef, setShowQuickRef] = useState(false);
  const [repeatCounter, setRepeatCounter] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load PDF document
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let base64Data = pdfBase64;
        if (base64Data.includes('base64,')) {
          base64Data = base64Data.split('base64,')[1];
        }
        
        try {
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          const loadingTask = pdfjsLib.getDocument({ data: bytes });
          const pdfDoc = await loadingTask.promise;
          
          setPdf(pdfDoc);
          setNumPages(pdfDoc.numPages);
          setIsLoading(false);
        } catch (decodeErr) {
          console.error('Error decoding base64:', decodeErr);
          throw new Error('Invalid PDF data format');
        }
      } catch (err) {
        console.error('Error loading PDF:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to load PDF file';
        setError(errorMsg);
        setIsLoading(false);
        if (onError) {
          onError(err instanceof Error ? err : new Error(errorMsg));
        }
      }
    };
    
    if (pdfBase64) {
      loadPDF();
    }
  }, [pdfBase64, onError]);
  
  // Render current page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdf || !canvasRef.current) return;
      
      try {
        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (!context) return;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (page as any).render(renderContext).promise;
      } catch (err) {
        console.error('Error rendering page:', err);
      }
    };
    
    renderPage();
  }, [pdf, currentPage, scale]);

  // Handle highlighter dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const top = e.clientY - rect.top;
    setHighlighterTop(Math.max(0, Math.min(top, rect.height - 40)));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const top = e.touches[0].clientY - rect.top;
    setHighlighterTop(Math.max(0, Math.min(top, rect.height - 40)));
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const zoomIn = () => {
    setScale(Math.min(scale + 0.25, 3));
  };
  
  const zoomOut = () => {
    setScale(Math.max(scale - 0.25, 0.5));
  };
  
  const fitToWidth = () => {
    setScale(1.5);
  };

  const addNote = (e: React.MouseEvent) => {
    if (!isAddingNote || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newNote: PDFNote = {
      id: Math.random().toString(36).substr(2, 9),
      page: currentPage,
      x,
      y,
      text: 'New Note'
    };
    
    setNotes([...notes, newNote]);
    setIsAddingNote(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const updateNoteText = (id: string, text: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, text } : n));
  };
  
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">📄</div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading PDF...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="tap-target rounded-lg p-2 hover:bg-neutral-200 disabled:opacity-50 dark:hover:bg-neutral-700"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium">
            {currentPage} / {numPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === numPages}
            className="tap-target rounded-lg p-2 hover:bg-neutral-200 disabled:opacity-50 dark:hover:bg-neutral-700"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-2 border-l border-neutral-300 pl-4 dark:border-neutral-600">
          <button
            onClick={() => setIsAddingNote(!isAddingNote)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isAddingNote 
                ? 'bg-amber-500 text-white' 
                : 'bg-white text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-200'
            }`}
          >
            <StickyNote className="h-4 w-4" />
            {isAddingNote ? 'Cancel Note' : 'Add Note'}
          </button>
          
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 dark:bg-neutral-700">
            {['rgba(255, 255, 0, 0.4)', 'rgba(0, 255, 0, 0.4)', 'rgba(0, 200, 255, 0.4)', 'rgba(255, 0, 255, 0.4)'].map(color => (
              <button 
                key={color}
                onClick={() => {
                  setHighlightColor(color);
                  setShowHighlighter(true);
                }}
                className={`w-6 h-6 rounded-full border-2 transition-all ${highlightColor === color ? 'border-neutral-900 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: color.replace('0.4', '1') }}
              />
            ))}
          </div>

          <button
            onClick={() => setShowHighlighter(!showHighlighter)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              showHighlighter 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-200'
            }`}
          >
            <Maximize2 className="h-4 w-4 rotate-45" />
            {showHighlighter ? 'Hide Highlighter' : 'Show Highlighter'}
          </button>
          
          <button
            onClick={() => setShowQuickRef(!showQuickRef)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              showQuickRef 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-200'
            }`}
          >
            <Edit3 className="h-4 w-4" />
            Quick Ref
          </button>
        </div>

        {/* Repeat Counters (Advanced Tool) */}
        <div className="flex items-center gap-4 bg-white dark:bg-neutral-700 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-600">
          <span className="text-xs font-bold text-neutral-500 uppercase">Repeat Counter</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setRepeatCounter(Math.max(0, repeatCounter - 1))}
              className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-200"
              aria-label="Decrease repeat"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-black w-8 text-center">{repeatCounter}</span>
            <button 
              onClick={() => setRepeatCounter(repeatCounter + 1)}
              className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-200"
              aria-label="Increase repeat"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setRepeatCounter(0)}
              className="ml-2 w-8 h-8 rounded-lg text-neutral-400 hover:text-red-500"
              aria-label="Reset repeat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-2 border-l border-neutral-300 pl-4 dark:border-neutral-600">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="tap-target rounded-lg p-2 hover:bg-neutral-200 disabled:opacity-50 dark:hover:bg-neutral-700"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            disabled={scale >= 3}
            className="tap-target rounded-lg p-2 hover:bg-neutral-200 disabled:opacity-50 dark:hover:bg-neutral-700"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            onClick={fitToWidth}
            className="tap-target rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            aria-label="Fit to width"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* PDF Canvas Container */}
      <div 
        ref={containerRef}
        className={`relative overflow-auto rounded-lg border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-900 ${isAddingNote ? 'cursor-crosshair' : ''}`}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseUp={() => setIsDragging(false)}
        onTouchEnd={() => setIsDragging(false)}
        onClick={addNote}
      >
        <canvas ref={canvasRef} className="mx-auto shadow-2xl" />

        {/* Notes */}
        {notes.filter(n => n.page === currentPage).map(note => (
          <div 
            key={note.id}
            style={{ left: note.x, top: note.y }}
            className="absolute z-20 group"
          >
            <div className="relative bg-amber-100 dark:bg-amber-900/80 p-2 rounded shadow-lg border border-amber-300 dark:border-amber-700 min-w-[120px]">
              <div className="flex justify-between items-center mb-1 border-b border-amber-200 dark:border-amber-800 pb-1">
                <Edit3 className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}>
                  <Trash2 className="w-3 h-3 text-red-500 hover:text-red-700" />
                </button>
              </div>
              <textarea 
                value={note.text}
                onChange={(e) => updateNoteText(note.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent text-xs w-full focus:outline-none resize-none overflow-hidden"
                rows={2}
              />
            </div>
          </div>
        ))}

        {/* Chart Highlighter Bar */}
        {showHighlighter && (
          <div
            style={{ 
              top: `${highlighterTop}px`,
              cursor: isDragging ? 'grabbing' : 'grab',
              backgroundColor: highlightColor
            }}
            className="absolute left-0 right-0 z-10 flex h-10 items-center justify-center backdrop-blur-[2px] border-y-2 border-primary-500 transition-all duration-150 select-none shadow-[0_0_15px_rgba(124,58,237,0.3)]"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onTouchStart={() => {
              setIsDragging(true);
            }}
          >
            <div className="flex h-1.5 w-12 items-center justify-between gap-1 rounded-full bg-primary-600/50">
              <div className="h-1 w-1 rounded-full bg-white/80" />
              <div className="h-1 w-1 rounded-full bg-white/80" />
              <div className="h-1 w-1 rounded-full bg-white/80" />
            </div>
          </div>
        )}
      </div>

      {showHighlighter && (
        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
          Tip: Drag the highlighter bar to follow along. Switch colors above for different section types.
        </p>
      )}

      {/* Quick Ref Overlay */}
      {showQuickRef && (
        <div className="fixed bottom-24 right-8 z-40 w-64 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 p-4 animate-in slide-in-from-right-4">
          <div className="flex items-center justify-between mb-3 border-b border-neutral-100 dark:border-neutral-700 pb-2">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-indigo-500" />
              Quick Reference
            </h4>
            <button onClick={() => setShowQuickRef(false)}>
              <X className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {notes.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">No notes added yet. Use 'Add Note' to pin details to the pattern.</p>
            ) : (
              notes.map(note => (
                <div key={note.id} className="text-xs p-2 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-100 dark:border-neutral-700">
                  <div className="flex justify-between items-center mb-1 opacity-60">
                    <span>Page {note.page}</span>
                  </div>
                  {note.text}
                </div>
              ))
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-700">
            <p className="text-[10px] text-neutral-400">Keep your most important row counts and color changes here.</p>
          </div>
        </div>
      )}
    </div>
  );
}
