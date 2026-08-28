"use client";

import { useEffect } from "react";
import { supabase } from "./supabase";

export function useRealtime(coupleId: string | null, onUpdate: () => void) {
  useEffect(() => {
    if (!coupleId) return;

    const channels = [
      "tasks", "events", "budget_goals", "transactions", "wishes", "capsules"
    ].map((table) =>
      supabase
        .channel(`${table}:${coupleId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table, filter: `couple_id=eq.${coupleId}` },
          onUpdate
        )
        .subscribe()
    );

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [coupleId, onUpdate]);
}
