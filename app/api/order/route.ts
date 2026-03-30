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
  id?: string;
  product_code?: string | null;
  code?: string | null;
  price?: number | string | null;
  priceNumber?: number | string | null;
  status?: string | null;
  [key: string]: unknown;
};

function text(v: unknown): string {
  return String(v ?? "").trim();
}

function toNumber(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

async function findProductByToken(db: ReturnType<typeof supabaseAdmin>, token: string): Promise<ProductRow | null> {
  const clean = text(token);
  if (!clean) return null;

  // أول محاولة: product_code
  {
    const { data, error } = await db
      .from("products")
      .select("*")
      .eq("product_code", clean)
      .limit(1);

    if (!error && Array.isArray(data) && data.length) {
      return data[0] as ProductRow;
    }
  }

  // ثاني محاولة: id
  {
    const { data, error } = await db
      .from("products")
      .select("*")
      .eq("id", clean)
      .limit(1);

    if (!error && Array.isArray(data) && data.length) {
      return data[0] as ProductRow;
    }
  }

  // ثالث محاولة: code لو موجود
  {
    const { data, error } = await db
      .from("products")
      .select("*")
      .eq("code", clean)
      .limit(1);

    if (!error && Array.isArray(data) && data.length) {
      return data[0] as ProductRow;
    }
  }

  return null;
}

async function createOrderWithFallbacks(
  db: ReturnType<typeof supabaseAdmin>,
  payload: {
    name: string;
    email: string;
    phone: string;
    notes: string;
    amountTotal: number;
    paymentProvider: string;
  }
) {
  const attempts = [
    {
      customer_name: payload.name,
      customer_email: payload.email || null,
      customer_phone: payload.phone,
      shipping_address: payload.notes ? { notes: payload.notes } : null,
      amount_total: payload.amountTotal,
      currency: "USD",
      status: "pending_manual_payment",
      payment_provider: payload.paymentProvider,
      payment_reference: null,
      paid_at: null,
    },
    {
      customer_name: payload.name,
      customer_email: payload.email || null,
      customer_phone: payload.phone,
      amount_total: payload.amountTotal,
      currency: "USD",
      status: "pending_manual_payment",
      payment_provider: payload.paymentProvider,
    },
    {
      customer_name: payload.name,
      customer_phone: payload.phone,
      amount_total: payload.amountTotal,
      currency: "USD",
      status: "pending_manual_payment",
    },
  ];

  let lastError: { message?: string } | null = null;

  for (const attempt of attempts) {
    const { data, error } = await db
      .from("orders")
      .insert(attempt)
      .select("id")
      .single();

    if (!error && data?.id) {
      return { orderId: data.id as string, error: null };
    }

    lastError = error;
  }

  return { orderId: null, error: lastError };
}

async function insertOrderItemsWithFallbacks(
  db: ReturnType<typeof supabaseAdmin>,
  rows: Array<{ order_id: string; product_id: string; price_usd: number }>
) {
  const attempts = [
    rows,
    rows.map((row) => ({
      order_id: row.order_id,
      product_id: row.product_id,
    })),
  ];

  let lastError: { message?: string } | null = null;

  for (const attempt of attempts) {
    const { error } = await db.from("order_items").insert(attempt);

    if (!error) return { error: null };
    lastError = error;
  }

  return { error: lastError };
}

export async function POST(req: Request) {
  const db = supabaseAdmin();

  let body: Body;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = text(body.name);
  const phone = text(body.phone);
  const email = text(body.email);
  const paymentType = text(body.payment_type) || "cod";
  const notes = text(body.notes);
  const rawItems = Array.isArray(body.items) ? body.items.map(text).filter(Boolean) : [];

  if (!name || !phone || !rawItems.length) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const resolvedProducts: ProductRow[] = [];
  const missing: string[] = [];

  for (const token of rawItems) {
    const found = await findProductByToken(db, token);

    if (!found) {
      missing.push(token);
    } else {
      resolvedProducts.push(found);
    }
  }

  if (missing.length) {
    return NextResponse.json(
      { error: `Missing items: ${unique(missing).join(", ")}` },
      { status: 400 }
    );
  }

  const notAvailable = unique(
    resolvedProducts
      .filter((p) => text(p.status).toLowerCase() !== "available")
      .map((p) => text(p.product_code) || text(p.id))
      .filter(Boolean)
  );

  if (notAvailable.length) {
    return NextResponse.json(
      { error: `Not available: ${notAvailable.join(", ")}` },
      { status: 409 }
    );
  }

  const amountTotal = resolvedProducts.reduce((sum, p) => {
    return sum + toNumber(p.priceNumber ?? p.price ?? 0);
  }, 0);

  if (!Number.isFinite(amountTotal) || amountTotal <= 0) {
    return NextResponse.json({ error: "Invalid total amount" }, { status: 500 });
  }

  const paymentProvider =
    paymentType === "transfer"
      ? "manual_iraq_transfer"
      : "cash_on_delivery";

  const created = await createOrderWithFallbacks(db, {
    name,
    email,
    phone,
    notes,
    amountTotal,
    paymentProvider,
  });

  if (!created.orderId) {
    return NextResponse.json(
      { error: created.error?.message || "Failed to create order" },
      { status: 500 }
    );
  }

  const orderId = created.orderId;

  const itemRows = resolvedProducts.map((p) => ({
    order_id: orderId,
    product_id: text(p.product_code) || text(p.code) || text(p.id),
    price_usd: toNumber(p.priceNumber ?? p.price ?? 0),
  }));

  const itemsResult = await insertOrderItemsWithFallbacks(db, itemRows);

  if (itemsResult.error) {
    await db.from("orders").delete().eq("id", orderId);

    return NextResponse.json(
      { error: itemsResult.error.message || "Failed to create order items" },
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