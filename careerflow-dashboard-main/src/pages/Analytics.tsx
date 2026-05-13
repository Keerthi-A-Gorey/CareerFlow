import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCards } from '@/components/analytics/StatsCards';
import { FunnelChart } from '@/components/analytics/FunnelChart';
import { ResumePerformanceChart } from '@/components/analytics/ResumePerformanceChart';
import { SourcePerformanceChart } from '@/components/analytics/SourcePerformanceChart';

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Analytics</h1>
          <p className="text-muted-foreground">Insights into your job search performance</p>
        </div>

        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-2">
          <FunnelChart />
          <SourcePerformanceChart />
        </div>

        <ResumePerformanceChart />
      </div>
    </DashboardLayout>
  );
}
