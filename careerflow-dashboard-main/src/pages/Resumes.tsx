import { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ResumeCard } from '@/components/resumes/ResumeCard';
import { AddResumeModal } from '@/components/resumes/AddResumeModal';
import { useApplications } from '@/contexts/ApplicationContext';

export default function Resumes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { resumeVersions } = useApplications();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Resume Versions</h1>
            <p className="text-muted-foreground">Manage different versions of your resume</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Resume
          </Button>
        </div>

        {resumeVersions.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resumeVersions.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No resume versions yet</h3>
            <p className="text-muted-foreground mb-4">Create your first resume version to start tracking performance</p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Resume
            </Button>
          </div>
        )}

        <AddResumeModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    </DashboardLayout>
  );
}
