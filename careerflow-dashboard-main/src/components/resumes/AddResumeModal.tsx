import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApplications } from '@/contexts/ApplicationContext';
import { UploadCloud, FileText, X, Loader2 } from 'lucide-react';

interface AddResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddResumeModal({ open, onOpenChange }: AddResumeModalProps) {
  const { addResumeVersion } = useApplications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    // If the name is empty, auto-fill it with file name without extension
    if (!formData.name) {
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setFormData(prev => ({ ...prev, name: baseName }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name && !file) return;

    try {
      setIsSubmitting(true);
      await addResumeVersion({
        name: formData.name || file?.name || 'Untitled Resume',
        description: formData.description,
        file: file
      });
      setFormData({ name: '', description: '' });
      setFile(null);
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to create resume version', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setFormData({ name: '', description: '' });
      setFile(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Resume Version</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>Resume Document (PDF, Word, or Image)</Label>
            {!file ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
                }`}
              >
                <UploadCloud className="h-9 w-9 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Click to upload or drag & drop</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOCX, or PNG (up to 15MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/40">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Version Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Tech Focus v3"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this resume version..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleClose(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Add Resume'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
