import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId, inviteCode } = await req.json();

    const { data: couple, error: findError } = await supabase
      .from("couples")
      .select("*")
      .eq("invite_code", inviteCode.toUpperCase())
      .is("user2_id", null)
      .single();

    if (findError || !couple) {
      return NextResponse.json({ error: "Invalid or used code" }, { status: 400 });
    }

    const { data: updated, error } = await supabase
      .from("couples")
      .update({ user2_id: userId })
      .eq("id", couple.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ couple: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
