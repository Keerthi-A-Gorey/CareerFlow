import { Badge } from '@/components/ui/badge';
import { ApplicationSource } from '@/types/application';

const sourceLabels: Record<ApplicationSource, string> = {
  linkedin: 'LinkedIn',
  referral: 'Referral',
  career_page: 'Career Page',
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
