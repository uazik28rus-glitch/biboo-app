import { DocumentsScreen } from "@/components/documents-screen";
import { Navigation } from "@/components/navigation";

export default function DocumentsPage() {
  return (
    <main className="min-h-screen bg-background">
      <DocumentsScreen />
      <Navigation />
    </main>
  );
}
