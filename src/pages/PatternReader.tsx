/**
 * Pattern Reader Page
 * View and interact with individual patterns
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { usePatternStore } from '@/stores/patternStore';
import { PDFViewer } from '@/components/PDFViewer';

export default function PatternReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patterns = usePatternStore((state) => state.patterns);
  
  const pattern = patterns.find((p) => p.id === id);
  
  if (!pattern) {
    return (
      <div className="container mx-auto p-6">
        <div className="card text-center">
          <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            Pattern Not Found
          </h2>
          <p className="mb-4 text-neutral-600 dark:text-neutral-400">
            The pattern you're looking for doesn't exist.
          </p>
          <button onClick={() => navigate('/patterns')} className="btn-primary">
            Back to Library
          </button>
        </div>
      </div>
    );
  }
  
  const handleDownloadPDF = () => {
    if (!pattern.pdfFile) return;
    
    const link = document.createElement('a');
    link.href = pattern.pdfFile;
    link.download = `${pattern.title}.pdf`;
    link.click();
  };
  
  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/patterns')}
          className="tap-target rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          aria-label="Back to patterns"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            {pattern.title}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            by {pattern.author}
          </p>
        </div>
        {pattern.pdfFile && (
          <button
            onClick={handleDownloadPDF}
            className="btn-outline flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Download PDF
          </button>
        )}
      </div>
      
      {/* Pattern Info Card */}
      <div className="card mb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pattern.skillLevel && (
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Skill Level</p>
              <p className="font-medium capitalize text-neutral-900 dark:text-neutral-50">
                {pattern.skillLevel}
              </p>
            </div>
          )}
          {pattern.category && (
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Category</p>
              <p className="font-medium text-neutral-900 dark:text-neutral-50">
                {pattern.category}
              </p>
            </div>
          )}
          {pattern.hookSize && (
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Hook Size</p>
              <p className="font-medium text-neutral-900 dark:text-neutral-50">
                {pattern.hookSize}
              </p>
            </div>
          )}
          {pattern.yarnWeight && (
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Yarn Weight</p>
              <p className="font-medium text-neutral-900 dark:text-neutral-50">
                {pattern.yarnWeight}
              </p>
            </div>
          )}
        </div>
        
        {pattern.source && (
          <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-700">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Source</p>
            <a
              href={pattern.source}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary-600 hover:underline dark:text-primary-400"
            >
              {pattern.source}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
        
        {pattern.notes && (
          <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-700">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Notes</p>
            <p className="mt-1 whitespace-pre-wrap text-neutral-900 dark:text-neutral-50">
              {pattern.notes}
            </p>
          </div>
        )}
      </div>
      
      {/* PDF Viewer or Cover Image */}
      {pattern.pdfFile ? (
        <PDFViewer
          pdfBase64={pattern.pdfFile.replace(/^data:application\/pdf;base64,/, '')}
          onError={(err) => console.error('PDF Error:', err)}
        />
      ) : pattern.coverImage ? (
        <div className="card">
          <img
            src={pattern.coverImage}
            alt={pattern.title}
            className="mx-auto max-w-full rounded-lg"
          />
        </div>
      ) : (
        <div className="card text-center">
          <div className="py-12">
            <div className="mb-4 text-6xl">📄</div>
            <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
              No PDF or Image Available
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              This pattern doesn't have a PDF file or cover image attached.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
