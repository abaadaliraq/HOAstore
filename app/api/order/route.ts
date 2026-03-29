import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, phone, email, payment_type, items } = body;

    if (!name || !phone || !Array.isArray(items) || !items.length) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin()
      .from("orders")
      .insert([
        {
          name,
          phone,
          email: email || null,
          payment_type,
          items,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}