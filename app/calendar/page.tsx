import { CalendarScreen } from "@/components/calendar-screen";
import { Navigation } from "@/components/navigation";

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-background">
      <CalendarScreen />
      <Navigation />
    </main>
  );
}
