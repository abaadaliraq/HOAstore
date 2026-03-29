import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase";

export async function POST(req: Request) {
  const db = supabaseAdmin();
  const payload = await req.json();

  // Expected payload:
  // { order_id: string, status: "PAID"|"FAILED", transaction_id?: string, secret?: string }
  const orderId = payload.order_id as string;
  const status = payload.status as string;
  const tx = (payload.transaction_id as string) || "TX-UNKNOWN";
  const secret = payload.secret as string;

  const expected = process.env.PAYMENT_WEBHOOK_SECRET;
  if (expected && secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!orderId) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  if (status !== "PAID") {
    await db.from("orders").update({ status: "failed" }).eq("id", orderId);
    await db.rpc("release_order_reservations", { p_order_id: orderId });
    return NextResponse.json({ ok: true, status: "failed_released" });
  }

  const { error } = await db.rpc("mark_order_paid", {
    p_order_id: orderId,
    p_payment_ref: tx,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, status: "paid_sold" });
}