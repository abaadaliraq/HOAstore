import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase";

type Body = {
  name?: string;
  phone?: string;
  email?: string;
  payment_type?: string;
  notes?: string;
  items?: string[];
};

type ProductRow = {
  id: string;
  product_code: string | null;
  price: number | string | null;
  status: string | null;
};

function normalizeToken(v: unknown): string {
  return String(v ?? "").trim();
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;

  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  return 0;
}

export async function POST(req: Request) {
  const db = supabaseAdmin();

  let body: Body;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const name = normalizeToken(body.name);
  const phone = normalizeToken(body.phone);
  const email = normalizeToken(body.email);
  const paymentType = normalizeToken(body.payment_type) || "cod";
  const notes = normalizeToken(body.notes);
  const rawItems = Array.isArray(body.items)
    ? body.items.map(normalizeToken).filter(Boolean)
    : [];

  if (!name || !phone || !rawItems.length) {
    return NextResponse.json(
      { error: "Invalid data" },
      { status: 400 }
    );
  }

  const uniqueItems = [...new Set(rawItems)];

let byCode: ProductRow[] = [];
let byId: ProductRow[] = [];

// search by product_code
{
  const { data, error } = await db
    .from("products")
    .select("id, product_code, price, status")
    .in("product_code", uniqueItems);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  byCode = (data ?? []) as ProductRow[];
}

// search by id
{
  const { data, error } = await db
    .from("products")
    .select("id, product_code, price, status")
    .in("id", uniqueItems);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  byId = (data ?? []) as ProductRow[];
}
  const merged = new Map<string, ProductRow>();

  for (const p of byCode) merged.set(String(p.id), p);
  for (const p of byId) merged.set(String(p.id), p);

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

  if (missing.length) {
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
    ),
  ];

  if (notAvailable.length) {
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
      { error: "Invalid total amount" },
      { status: 500 }
    );
  }

  const paymentProvider =
    paymentType === "transfer"
      ? "manual_iraq_transfer"
      : "cash_on_delivery";

  const { data: order, error: orderError } = await db
    .from("orders")
    .insert({
      customer_name: name,
      customer_email: email || null,
      customer_phone: phone,
      shipping_address: notes ? { notes } : null,
      amount_total: amountTotal,
      currency: "USD",
      status: "pending_manual_payment",
      payment_provider: paymentProvider,
      payment_reference: null,
      paid_at: null,
    })
    .select("id")
    .single();

  if (orderError) {
    return NextResponse.json(
      { error: orderError.message },
      { status: 500 }
    );
  }

  const orderId = order.id;

  const rows = resolvedProducts.map((p) => ({
    order_id: orderId,
    product_id: String(p.id),
    price_usd: toNumber(p.price),
  }));

  const { error: itemsError } = await db
    .from("order_items")
    .insert(rows);

  if (itemsError) {
    await db.from("orders").delete().eq("id", orderId);

    return NextResponse.json(
      { error: itemsError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    orderId,
    amountTotal,
    currency: "USD",
    paymentInstructions:
      paymentType === "transfer"
        ? {
            type: "mastercard_transfer",
            cardNumber: "7146148577",
            note: "Send the amount manually, then keep the transfer receipt and transaction reference.",
          }
        : null,
  });
}