/**
 * Share Project Dialog Component
 * 
 * Share finished projects via social media, links, QR codes, and exports
 */

import { useState, useRef, useEffect } from 'react';
import { Copy, Download, Check, Instagram, Facebook, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import type { Project } from '@/types/models';

interface ShareProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
}

export function ShareProjectDialog({
  open,
  onOpenChange,
  project,
}: ShareProjectDialogProps) {
  const [activeTab, setActiveTab] = useState<'social' | 'link' | 'qr' | 'export'>('social');
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const shareCardRef = useRef<HTMLDivElement>(null);
  
  // Generate public link
  const publicLink = `${window.location.origin}/shared/project/${project.id}`;
  
  // Generate QR code
  useEffect(() => {
    if (activeTab === 'qr' && !qrDataUrl) {
      QRCode.toDataURL(publicLink, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).then(setQrDataUrl);
    }
  }, [activeTab, publicLink, qrDataUrl]);
  
  // Get project photo
  const projectPhoto = project.progressPhotos && project.progressPhotos.length > 0
    ? project.progressPhotos[project.progressPhotos.length - 1].url
    : null;
  
  // Generate social media caption
  const socialCaption = `Check out my latest crochet project: ${project.name}! 🧶✨
${project.hookSize ? `Hook: ${project.hookSize}` : ''}
Category: ${project.category}

#crochet #handmade #yarn #fiberart #crochetlove #crochetersofinstagram #crochetaddict #crochetproject`;
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const downloadShareCard = async () => {
    if (!shareCardRef.current) return;
    
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = `${project.name.replace(/\s+/g, '-')}-share-card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate share card:', err);
    }
  };
  
  const downloadQRCode = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `${project.name.replace(/\s+/g, '-')}-qr-code.png`;
    link.href = qrDataUrl;
    link.click();
  };
  
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-neutral-800">
          <Dialog.Title className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Share: {project.name}
          </Dialog.Title>
          
          {/* Tabs */}
          <div className="mb-6 flex gap-2 border-b border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setActiveTab('social')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'social'
                  ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
              }`}
            >
              Social Media
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'link'
                  ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
              }`}
            >
              Public Link
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'qr'
                  ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
              }`}
            >
              QR Code
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'export'
                  ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
              }`}
            >
              Export
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'social' && (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Ready-to-post caption
                  </label>
                  <textarea
                    readOnly
                    value={socialCaption}
                    className="input-field min-h-[200px]"
                  />
                  <button
                    onClick={() => copyToClipboard(socialCaption)}
                    className="btn-primary mt-2 flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-5 w-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5" />
                        Copy Caption
                      </>
                    )}
                  </button>
                </div>
                
                <div>
                  <p className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Share to:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="btn-outline flex items-center gap-2">
                      <Instagram className="h-5 w-5" />
                      Instagram
                    </button>
                    <button className="btn-outline flex items-center gap-2">
                      <Facebook className="h-5 w-5" />
                      Facebook
                    </button>
                    <button className="btn-outline flex items-center gap-2">
                      <X className="h-5 w-5" />
                      Twitter
                    </button>
                    <button className="btn-outline flex items-center gap-2">
                      <span className="text-lg">📌</span>
                      Pinterest
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">
                    Opens your social app with the caption ready to paste
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'link' && (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Public Project Link
                  </label>
                  <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
                    Anyone with this link can view your project details, even without an account!
                  </p>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={publicLink}
                      className="input-field flex-1"
                    />
                    <button
                      onClick={() => copyToClipboard(publicLink)}
                      className="btn-primary flex items-center gap-2"
                    >
                      {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 <strong>Tip:</strong> Share this link in Facebook groups, Ravelry, or send to friends!
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'qr' && (
              <div className="space-y-4 text-center">
                <div>
                  <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                    Scan this QR code to view the project on any device
                  </p>
                  {qrDataUrl && (
                    <div className="flex justify-center">
                      <img
                        src={qrDataUrl}
                        alt="QR Code"
                        className="rounded-lg border-4 border-neutral-200 dark:border-neutral-700"
                      />
                    </div>
                  )}
                  <button
                    onClick={downloadQRCode}
                    className="btn-primary mt-4 flex items-center gap-2 mx-auto"
                  >
                    <Download className="h-5 w-5" />
                    Download QR Code
                  </button>
                </div>
                
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    📱 Perfect for craft fairs, business cards, or sharing in person!
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'export' && (
              <div className="space-y-4">
                {/* Share Card Preview */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Share Card
                  </label>
                  <div ref={shareCardRef} className="mx-auto max-w-md overflow-hidden rounded-lg border-4 border-neutral-200 dark:border-neutral-700">
                    {projectPhoto ? (
                      <div className="relative">
                        <img src={projectPhoto} alt={project.name} className="w-full" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                          <h3 className="text-2xl font-bold text-white">{project.name}</h3>
                          <p className="text-sm text-white/90">{project.category} • {project.hookSize}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-64 items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600">
                        <div className="text-center text-white">
                          <span className="text-6xl">🧶</span>
                          <h3 className="mt-4 text-2xl font-bold">{project.name}</h3>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={downloadShareCard}
                    className="btn-primary mt-4 flex items-center gap-2 mx-auto"
                  >
                    <Download className="h-5 w-5" />
                    Download Share Card
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Close Button */}
          <div className="mt-6">
            <button
              onClick={() => onOpenChange(false)}
              className="btn-outline w-full"
            >
              Close
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
