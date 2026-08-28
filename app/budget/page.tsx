import { BudgetScreen } from "@/components/budget-screen";
import { Navigation } from "@/components/navigation";

export default function BudgetPage() {
  return (
    <main className="min-h-screen bg-background">
      <BudgetScreen />
      <Navigation />
    </main>
  );
}
