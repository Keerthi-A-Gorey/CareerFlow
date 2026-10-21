import { useState } from 'react';
import { FileText, Trash2, Calendar, FileCheck, Eye, Paperclip } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResumeVersion } from '@/types/application';
import { useApplications } from '@/contexts/ApplicationContext';
import { ResumePreviewModal } from './ResumePreviewModal';

interface ResumeCardProps {
  resume: ResumeVersion;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const { deleteResumeVersion } = useApplications();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

          {/* Action buttons visible on hover */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-foreground"
              title="Preview Resume"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-destructive"
              title="Delete Resume Version"
              onClick={() => deleteResumeVersion(resume.id)}
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

      {/* Separate preview pop-up modal */}
      <ResumePreviewModal
        resume={resume}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </>
  );
}
