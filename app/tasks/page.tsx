import { TasksScreen } from "@/components/tasks-screen";
import { Navigation } from "@/components/navigation";

export default function TasksPage() {
  return (
    <main className="min-h-screen bg-background">
      <TasksScreen />
      <Navigation />
    </main>
  );
}
