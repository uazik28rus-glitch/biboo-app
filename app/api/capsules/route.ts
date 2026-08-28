import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET — список по couple_id
export async function GET(req: NextRequest) {
  try {
    const coupleId = req.nextUrl.searchParams.get("coupleId");
    if (!coupleId) return NextResponse.json({ error: "Missing coupleId" }, { status: 400 });

    const { data, error } = await supabase
      .from("capsules")
      .select("*")
      .eq("couple_id", coupleId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — создать
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from("capsules")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — обновить
export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    const { data, error } = await supabase
      .from("capsules")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — удалить
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const { error } = await supabase
      .from("capsules")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
