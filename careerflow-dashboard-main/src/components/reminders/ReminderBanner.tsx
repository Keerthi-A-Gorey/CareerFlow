import { useEffect, useState } from "react";
import { Bell, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import api from "@/lib/api";

type Reminder = {
  _id: string;
  message: string;
};

export function ReminderBanner() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    try {
      const res = await api.get("/reminders");
      setReminders(res.data);
    } catch (err) {
      console.error("Failed to load reminders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const markDone = async (id: string) => {
    try {
      await api.patch(`/reminders/${id}/done`);
      fetchReminders();
    } catch (err) {
      console.error("Failed to update reminder", err);
    }
  };

  if (loading || reminders.length === 0) return null;

  const reminder = reminders[0]; // show only top priority

  return (
    <Card className="border-primary/40 bg-primary/5 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/20 p-2">
          <Bell className="h-5 w-5 text-primary" />
        </div>

        <div>
          <p className="font-semibold text-sm">Follow-up Reminder</p>
          <p className="text-sm text-muted-foreground">{reminder.message}</p>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => markDone(reminder._id)}
        >
          <CheckCircle className="mr-1 h-4 w-4" />
          Done
        </Button>

        <Button size="sm">
          View
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
