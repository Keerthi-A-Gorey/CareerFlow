import { FileText, Trash2, Calendar, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResumeVersion } from '@/types/application';
import { useApplications } from '@/contexts/ApplicationContext';

interface ResumeCardProps {
  resume: ResumeVersion;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const { deleteResumeVersion } = useApplications();

  return (
    <Card className="group transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">{resume.name}</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => deleteResumeVersion(resume.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent>
        {resume.description && (
          <p className="mb-4 text-sm text-muted-foreground">{resume.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileCheck className="h-4 w-4" />
            <span>{resume.applicationsCount} application{resume.applicationsCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
