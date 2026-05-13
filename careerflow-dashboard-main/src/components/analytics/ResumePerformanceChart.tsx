import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import api from "@/lib/api";

export function ResumePerformanceChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/analytics/resume-performance")
      .then((res) => {
        const formatted = res.data.map((d: any) => ({
          name: d.resumeLabel,
          applications: d.total,
          interviews: d.interviews,
          offers: d.offers,
        }));
        setData(formatted);
      })
      .catch((err) => {
        console.error("Resume analytics failed", err);
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Performance</CardTitle>
        <CardDescription>Compare how different resumes are performing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="applications" name="Applications" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="interviews" name="Interviews" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="offers" name="Offers" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
