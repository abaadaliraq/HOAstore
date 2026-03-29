import { supabaseAdmin } from "../../lib/supabase";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: products } = await supabaseAdmin()
    .from("products")
    .select("*");

  const product = products?.find((p) => p.slug === slug);

  if (!product) {
    return (
      <main style={{ padding: "40px", background: "black", color: "white", minHeight: "100vh" }}>
        <h1>Product not found</h1>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px", background: "black", color: "white", minHeight: "100vh" }}>
      <h1>{product.name}</h1>

      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "400px",
          maxWidth: "100%",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      />

      <p style={{ marginTop: "20px", lineHeight: 1.8 }}>{product.description}</p>

      <h2 style={{ marginTop: "20px" }}>${product.price}</h2>

      <p
        style={{
          color:
            product.status === "available"
              ? "lightgreen"
              : product.status === "reserved"
              ? "orange"
              : "red",
          fontWeight: "bold",
        }}
      >
        {product.status}
      </p>
    </main>
  );
}