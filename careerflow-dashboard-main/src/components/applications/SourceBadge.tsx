import { Badge } from '@/components/ui/badge';
import { ApplicationSource } from '@/types/application';

const sourceLabels: Record<ApplicationSource, string> = {
  linkedin: 'LinkedIn',
  indeed: 'Indeed',
  company_website: 'Company Site',
  referral: 'Referral',
  other: 'Other',
};

interface SourceBadgeProps {
  source: ApplicationSource;
}

export function SourceBadge({ source }: SourceBadgeProps) {
  return (
    <Badge variant="secondary" className="font-normal">
      {sourceLabels[source]}
    </Badge>
  );
}
