import { Briefcase, TrendingUp, Award, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApplications } from '@/contexts/ApplicationContext';

export function StatsCards() {
  const { applications } = useApplications();

  const stats = {
    total: applications.length,
    interviews: applications.filter(a => a.status === 'interview').length,
    offers: applications.filter(a => a.status === 'offer').length,
    responseRate: applications.length > 0 
      ? Math.round((applications.filter(a => a.status !== 'applied' && a.status !== 'rejected').length / applications.length) * 100)
      : 0,
  };

  const cards = [
    { title: 'Total Applications', value: stats.total, icon: Briefcase, color: 'text-chart-5' },
    { title: 'Interviews', value: stats.interviews, icon: TrendingUp, color: 'text-chart-1' },
    { title: 'Offers', value: stats.offers, icon: Award, color: 'text-chart-2' },
    { title: 'Response Rate', value: `${stats.responseRate}%`, icon: Target, color: 'text-chart-4' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
