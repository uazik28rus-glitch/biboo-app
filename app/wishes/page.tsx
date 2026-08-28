import { WishesScreen } from "@/components/wishes-screen";
import { Navigation } from "@/components/navigation";

export default function WishesPage() {
  return (
    <main className="min-h-screen bg-background">
      <WishesScreen />
      <Navigation />
    </main>
  );
}
