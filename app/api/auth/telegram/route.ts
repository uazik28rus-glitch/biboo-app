import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifyTelegramAuth(initData: string): { valid: boolean; user?: any } {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");
  urlParams.delete("hash");

  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(process.env.TELEGRAM_BOT_TOKEN!)
    .digest();

  const checkHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (checkHash !== hash) {
    return { valid: false };
  }

  const user = JSON.parse(urlParams.get("user") || "{}");
  return { valid: true, user };
}

export async function POST(req: NextRequest) {
  try {
    const { initData } = await req.json();
    const { valid, user } = verifyTelegramAuth(initData);

    if (!valid || !user) {
      return NextResponse.json({ error: "Invalid auth" }, { status: 401 });
    }

    // Ищем или создаём пользователя
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", user.id)
      .single();

    if (findError && findError.code !== "PGRST116") {
      throw findError;
    }

    let dbUser = existingUser;

    if (!dbUser) {
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          telegram_id: user.id,
          first_name: user.first_name,
          last_name: user.last_name || null,
          username: user.username || null,
          avatar_url: user.photo_url || null,
        })
        .select()
        .single();

      if (createError) throw createError;
      dbUser = newUser;
    }

    // Ищем пару
    const { data: couple } = await supabase
      .from("couples")
      .select("*")
      .or(`user1_id.eq.${dbUser.id},user2_id.eq.${dbUser.id}`)
      .single();

    return NextResponse.json({
      user: dbUser,
      couple: couple || null,
      isNewUser: !existingUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
