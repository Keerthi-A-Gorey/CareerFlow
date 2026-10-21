import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ResumeVersion } from '@/types/application';
import {
  FileText,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import api from '@/lib/api';

interface ResumePreviewModalProps {
  resume: ResumeVersion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResumePreviewModal({
  resume,
  open,
  onOpenChange
}: ResumePreviewModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  if (!resume) return null;

  const rawFileUrl = resume.fileUrl || '';
  const fullFileUrl = rawFileUrl.startsWith('http://') || rawFileUrl.startsWith('https://')
    ? rawFileUrl
    : `http://localhost:5000${rawFileUrl.startsWith('/') ? '' : '/'}${rawFileUrl}`;

  const isPdf =
    rawFileUrl.toLowerCase().endsWith('.pdf') ||
    resume.fileType?.includes('pdf') ||
    resume.fileName?.toLowerCase().endsWith('.pdf');

  const isImage =
    rawFileUrl.toLowerCase().match(/\.(png|jpg|jpeg|webp|gif)$/) ||
    resume.fileType?.startsWith('image/');

  const isWordDoc =
    rawFileUrl.toLowerCase().match(/\.(doc|docx)$/) ||
    resume.fileType?.includes('word') ||
    resume.fileType?.includes('officedocument');

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await api.get(`/resumes/${resume.id}/download`, {
        responseType: 'blob'
      });

      const blob = new Blob([res.data], {
        type: resume.fileType || 'application/octet-stream'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resume.fileName || `${resume.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed, falling back to direct URL', err);
      // Fallback
      if (fullFileUrl) {
        window.open(fullFileUrl, '_blank');
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-4 sm:p-6 overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b space-y-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                {resume.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {resume.fileName ? (
                  <span>
                    File: <strong className="text-foreground">{resume.fileName}</strong>
                    {resume.fileSize ? ` • ${(resume.fileSize / 1024).toFixed(1)} KB` : ''}
                  </span>
                ) : (
                  'Resume Version Preview'
                )}
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 mr-6">
            {resume.fileUrl && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(fullFileUrl, '_blank')}
                  title="Open in new window"
                  className="hidden sm:flex items-center gap-1.5"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Tab</span>
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex items-center gap-1.5 shadow-sm"
                >
                  {downloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>{downloading ? 'Downloading...' : 'Download'}</span>
                </Button>
              </>
            )}
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="flex-1 w-full h-full min-h-0 bg-muted/20 rounded-lg border overflow-hidden mt-3 relative flex flex-col">
          {!resume.fileUrl ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
              <h4 className="text-lg font-semibold">No File Attached</h4>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                This resume version was created without an uploaded file.
              </p>
            </div>
          ) : isPdf ? (
            <div className="relative w-full h-full">
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-10">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>Loading document preview...</span>
                  </div>
                </div>
              )}
              <iframe
                src={`${fullFileUrl}#toolbar=1`}
                className="w-full h-full border-0 rounded-md"
                title={`Preview of ${resume.name}`}
                onLoad={() => setIframeLoaded(true)}
              />
            </div>
          ) : isImage ? (
            <div className="flex items-center justify-center h-full p-4 overflow-auto">
              <img
                src={fullFileUrl}
                alt={resume.name}
                className="max-h-full max-w-full object-contain rounded-md shadow-sm border"
              />
            </div>
          ) : isWordDoc ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <FileSpreadsheet className="h-14 w-14 text-primary mb-3" />
              <h4 className="text-lg font-semibold">Word Document Attached</h4>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mb-4">
                {resume.fileName || 'Document'} cannot be rendered directly in-browser. You can download and view it on your device.
              </p>
              <Button onClick={handleDownload} disabled={downloading} className="gap-2">
                <Download className="h-4 w-4" />
                Download Document
              </Button>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <iframe
                src={fullFileUrl}
                className="w-full h-full border-0"
                title={`Preview of ${resume.name}`}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
