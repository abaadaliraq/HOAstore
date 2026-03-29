import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase";

type Customer = {
  name: string;
  email: string;
  phone?: string;
  address?: unknown;
};

type Body = {
  items: string[];
  customer: Customer;
};

type ProductRow = {
  id: string;
  product_code: string | null;
  price: number | string | null;
  status: string | null;
};

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;

  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  return 0;
}

function normalizeToken(v: unknown): string {
  return String(v ?? "").trim();
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Manual payment API ready. Use POST."
  });
}

export async function POST(req: Request) {
  const db = supabaseAdmin();

  let body: Body;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const name = body.customer?.name?.trim();
  const email = body.customer?.email?.trim();

  if (!name || !email) {
    return NextResponse.json(
      { error: "Missing customer.name or customer.email" },
      { status: 400 }
    );
  }

  const rawItems = body.items.map(normalizeToken).filter(Boolean);

  if (!rawItems.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  console.log("ITEMS RECEIVED IN API:", rawItems);

  const uniqueItems = [...new Set(rawItems)];
  const uuidItems = uniqueItems.filter(isUuid);
  const codeItems = uniqueItems.filter((x) => !isUuid(x));

  let byCode: ProductRow[] = [];
  let byId: ProductRow[] = [];

  if (codeItems.length) {
    const { data, error } = await db
      .from("products")
      .select("id, product_code, price, status")
      .in("product_code", codeItems);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    byCode = (data ?? []) as ProductRow[];
  }

  if (uuidItems.length) {
    const { data, error } = await db
      .from("products")
      .select("id, product_code, price, status")
      .in("id", uuidItems);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    byId = (data ?? []) as ProductRow[];
  }

  const merged = new Map<string, ProductRow>();

  for (const p of byCode) {
    merged.set(String(p.id), p);
  }

  for (const p of byId) {
    merged.set(String(p.id), p);
  }

  const products = [...merged.values()];

  const resolvedProducts: ProductRow[] = [];
  const missing: string[] = [];

  for (const token of rawItems) {
    const found =
      products.find((p) => normalizeToken(p.product_code) === token) ||
      products.find((p) => normalizeToken(p.id) === token);

    if (!found) {
      missing.push(token);
    } else {
      resolvedProducts.push(found);
    }
  }

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing items: ${[...new Set(missing)].join(", ")}` },
      { status: 400 }
    );
  }

  const notAvailable = [
    ...new Set(
      resolvedProducts
        .filter((p) => p.status !== "available")
        .map((p) => String(p.product_code || p.id))
    )
  ];

  if (notAvailable.length > 0) {
    return NextResponse.json(
      { error: `Not available: ${notAvailable.join(", ")}` },
      { status: 409 }
    );
  }

  const amountTotal = resolvedProducts.reduce((sum, p) => {
    return sum + toNumber(p.price);
  }, 0);

  if (!Number.isFinite(amountTotal) || amountTotal <= 0) {
    return NextResponse.json(
      { error: "Invalid total amount (check products.price)" },
      { status: 500 }
    );
  }

  const { data: order, error: oErr } = await db
    .from("orders")
    .insert({
      customer_name: name,
      customer_email: email,
      customer_phone: body.customer.phone ?? null,
      shipping_address: body.customer.address ?? null,
      amount_total: amountTotal,
      currency: "USD",
      status: "pending_manual_payment",
      payment_provider: "manual_iraq_transfer",
      payment_reference: null,
      paid_at: null
    })
    .select("id")
    .single();

  if (oErr) {
    return NextResponse.json({ error: oErr.message }, { status: 500 });
  }

  const orderId = order.id;

  const rows = resolvedProducts.map((p) => ({
    order_id: orderId,
    product_id: String(p.id),
    price_usd: toNumber(p.price)
  }));

  const { error: iErr } = await db.from("order_items").insert(rows);

  if (iErr) {
    await db.from("orders").delete().eq("id", orderId);

    return NextResponse.json({ error: iErr.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    orderId,
    amountTotal,
    currency: "USD",
    paymentMethod: "manual_iraq_transfer",
    paymentInstructions: {
      type: "mastercard_transfer",
      cardNumber: "7146148577",
      note: "Send the amount manually, then keep the transfer receipt and transaction reference."
    }
  });
}