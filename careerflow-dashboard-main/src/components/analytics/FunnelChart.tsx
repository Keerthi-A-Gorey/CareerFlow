import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import api from "@/lib/api";

export function FunnelChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    api.get("/analytics/funnel").then((res) => {
      const stages = ["Applied", "OA", "Interview", "Offer"];

      const formatted = stages.map((stage, idx) => {
        const found = res.data.find((d: any) => d._id === stage);
        return {
          name: stage,
          value: found ? found.count : 0,
          fill: `hsl(var(--chart-${idx + 1}))`,
        };
      });

      setData(formatted);
    }).catch(err => {
      console.error("Funnel analytics failed", err);
    });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Funnel</CardTitle>
        <CardDescription>Track your progress through the hiring process</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
