"use client";

import { HomeScreen } from "@/components/home-screen";
import { Navigation } from "@/components/navigation";
import { AuthScreen } from "@/components/auth-screen";
import { CoupleSetup } from "@/components/couple-setup";
import { useAuth } from "@/lib/use-auth";

export default function Home() {
  const { isLoading, isAuthenticated, needsCouple } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-pink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  if (needsCouple) {
    return <CoupleSetup />;
  }

  return (
    <main className="min-h-screen bg-background">
      <HomeScreen />
      <Navigation />
    </main>
  );
}
