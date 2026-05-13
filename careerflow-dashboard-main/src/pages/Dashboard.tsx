import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ApplicationsTable } from '@/components/applications/ApplicationsTable';
import { AddApplicationModal } from '@/components/applications/AddApplicationModal';
import { StatsCards } from '@/components/analytics/StatsCards';
import { ReminderBanner } from "@/components/reminders/ReminderBanner";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Applications</h1>
            <p className="text-muted-foreground">Track and manage your job applications</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </div>
         <ReminderBanner />
         
        <StatsCards />

        <ApplicationsTable />

        <AddApplicationModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    </DashboardLayout>
  );
}
