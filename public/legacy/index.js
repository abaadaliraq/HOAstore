import { ARTWORKS_PRODUCTS } from "./artworks.js";
import { PAINTINGS_PRODUCTS } from "./paintings.js";
import { WOOD_PRODUCTS } from "./wood.js";
import { COPPER_PRODUCTS } from "./copper.js";
import { SILVER_PRODUCTS } from "./silver.js";
import { CRYSTAL_PRODUCTS } from "./crystal.js";
import { FURNITURE_PRODUCTS } from "./furniture.js";
import { ARABIC_CALLIGRAPHY_PRODUCTS } from "./ARABIC_CALLIGRAPHY.js";
import { ACCESSORIES_PRODUCTS } from "./Accessories.js";
import { CARPETS_PRODUCTS } from "./carpets.js";
import { VASES_PRODUCTS } from "./vases.js";

const fallbackProducts = [
  ...ARTWORKS_PRODUCTS,
  ...PAINTINGS_PRODUCTS,
  ...WOOD_PRODUCTS,
  ...COPPER_PRODUCTS,
  ...SILVER_PRODUCTS,
  ...CRYSTAL_PRODUCTS,
  ...FURNITURE_PRODUCTS,
  ...ARABIC_CALLIGRAPHY_PRODUCTS,
  ...ACCESSORIES_PRODUCTS,
  ...CARPETS_PRODUCTS,
  ...VASES_PRODUCTS,
];

async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const products = await res.json();

    if (Array.isArray(products) && products.length) {
      window.PRODUCTS = products;
      console.log("Using Supabase products:", products.length);
      return;
    }

    window.PRODUCTS = fallbackProducts;
    console.warn("Supabase returned empty array, using fallback products.");
  } catch (err) {
    window.PRODUCTS = fallbackProducts;
    console.error("Failed to load Supabase products, using fallback.", err);
  }
}

await loadProducts();
