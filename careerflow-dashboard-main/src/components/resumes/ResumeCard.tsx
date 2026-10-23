import { useState } from 'react';
import axios from 'axios';
import { FileText, Trash2, Calendar, FileCheck, Eye, Paperclip, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { ResumeVersion } from '@/types/application';
import { useApplications } from '@/contexts/ApplicationContext';
import { useToast } from '@/hooks/use-toast';
import { ResumePreviewModal } from './ResumePreviewModal';

interface ResumeCardProps {
  resume: ResumeVersion;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const { deleteResumeVersion } = useApplications();
  const { toast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteResumeVersion(resume.id);
      setIsConfirmDeleteOpen(false);
      toast({
        title: "Resume deleted",
        description: `"${resume.name}" has been deleted.`
      });
    } catch (err) {
      console.error("Failed to delete resume", err);
      const message = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data.message || err.message
        : err instanceof Error ? err.message : "Could not delete resume version";
      toast({
        title: "Delete failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="group transition-all hover:shadow-md relative overflow-hidden border">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <CardTitle className="text-lg truncate">{resume.name}</CardTitle>
              {resume.fileName && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 truncate">
                  <Paperclip className="h-3 w-3 shrink-0" />
                  <span className="truncate">{resume.fileName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons visible on hover (and always accessible on touch devices) */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
              title="Preview Resume"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              title="Delete Resume Version"
              onClick={() => setIsConfirmDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {resume.description && (
            <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
              {resume.description}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck className="h-4 w-4" />
              <span>
                {resume.applicationsCount} application{resume.applicationsCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog for Deletion */}
      <AlertDialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume Version?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{resume.name}</strong>?
              {resume.applicationsCount > 0 ? (
                <span className="block mt-2 text-amber-600 dark:text-amber-400 font-medium">
                  Note: This resume is currently linked to {resume.applicationsCount} application{resume.applicationsCount !== 1 ? 's' : ''}. Deleting it will unlink it from them.
                </span>
              ) : (
                <span className="block mt-1">This action cannot be undone.</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
              className="gap-2"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Separate preview pop-up modal */}
      <ResumePreviewModal
        resume={resume}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </>
  );
}
