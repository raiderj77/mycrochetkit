/**
 * PDF Viewer Component
 * 
 * Renders PDF files using PDF.js with zoom and page navigation
 */

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use local worker from node_modules
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface PDFViewerProps {
  pdfBase64: string;
  onError?: (error: Error) => void;
}

export function PDFViewer({ pdfBase64, onError }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showHighlighter, setShowHighlighter] = useState(false);
  const [highlighterTop, setHighlighterTop] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
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
        
        await page.render(renderContext).promise;
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
        className="relative overflow-auto rounded-lg border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-900"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseUp={() => setIsDragging(false)}
        onTouchEnd={() => setIsDragging(false)}
      >
        <canvas ref={canvasRef} className="mx-auto shadow-2xl" />

        {/* Chart Highlighter Bar */}
        {showHighlighter && (
          <div
            style={{ 
              top: `${highlighterTop}px`,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            className="absolute left-0 right-0 z-10 flex h-10 items-center justify-center bg-primary-500/30 backdrop-blur-[2px] border-y-2 border-primary-500 transition-shadow duration-150 select-none shadow-[0_0_15px_rgba(124,58,237,0.3)]"
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
          Tip: Drag the purple bar to follow along with your pattern rows.
        </p>
      )}
    </div>
  );
}
