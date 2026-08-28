import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data: couple, error } = await supabase
      .from("couples")
      .select("*, user1:users!couples_user1_id_fkey(*), user2:users!couples_user2_id_fkey(*)")
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return NextResponse.json({ couple: couple || null });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
