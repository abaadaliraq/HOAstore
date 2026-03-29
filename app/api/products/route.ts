import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasService = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  const client = supabaseAdmin();

  const { data, error, count } = await client
    .from("products")
    .select("id, product_code, name, price, status", { count: "exact" })
    .limit(10);

  return NextResponse.json({
    env: {
      url,
      hasAnon,
      hasService
    },
    ok: !error,
    error: error ? error.message : null,
    count,
    sample: data || []
  });
}