import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId, startDate } = await req.json();

    // Генерируем код
    const { data: codeData, error: codeError } = await supabase.rpc("generate_invite_code");
    if (codeError) throw codeError;

    const { data: couple, error } = await supabase
      .from("couples")
      .insert({
        user1_id: userId,
        start_date: startDate || new Date().toISOString().split("T")[0],
        invite_code: codeData,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ couple });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
