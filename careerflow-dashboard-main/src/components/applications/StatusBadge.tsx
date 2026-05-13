import { Badge } from '@/components/ui/badge';
import { ApplicationStatus } from '@/types/application';
import { cn } from '@/lib/utils';

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  applied: { label: 'Applied', className: 'bg-chart-5/20 text-chart-5 border-chart-5/30' },
  oa: { label: 'OA', className: 'bg-chart-4/20 text-chart-4 border-chart-4/30' },
  interview: { label: 'Interview', className: 'bg-chart-1/20 text-chart-1 border-chart-1/30' },
  offer: { label: 'Offer', className: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30' },
  rejected: { label: 'Rejected', className: 'bg-destructive/20 text-destructive border-destructive/30' },
};

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}
