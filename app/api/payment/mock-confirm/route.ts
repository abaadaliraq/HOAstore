import { NextResponse } from "next/server";

type Body = {
  order_id: string;
  status?: "PAID" | "FAILED";
};

export async function POST(req: Request) {
  let body: Body;

  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const orderId = body?.order_id?.trim();
  const status = (body?.status || "PAID") as "PAID" | "FAILED";

  if (!orderId) return NextResponse.json({ error: "Missing order_id" }, { status: 400 });

  const site = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Missing PAYMENT_WEBHOOK_SECRET in env" },
      { status: 500 }
    );
  }

  const res = await fetch(`${site}/api/payment/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order_id: orderId,
      status,
      transaction_id: `MOCK-TX-${Date.now()}`,
      secret,
    }),
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = { error: "Webhook did not return JSON" };
  }

  return NextResponse.json(
    { ok: res.ok, status: res.status, webhook: json },
    { status: res.ok ? 200 : 500 }
  );
}