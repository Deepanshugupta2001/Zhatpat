const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const categoryFilters = [
  "all",
  "electronics",
  "fashion",
  "home",
  "beauty",
  "sports",
  "books",
  "food",
  "wellness",
  "kids",
  "stationery",
  "travel",
  "other",
];

const catalogSeed = [
  ["orbit-lamp", "Orbit Desk Lamp", "home", 4299, 3599, 4.8, 18, "House of Forma", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80", "#f08a5d"],
  ["muse-carryall", "Muse Carryall", "fashion", 5999, 4899, 4.7, 27, "Atelier North", "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80", "#2f9c95"],
  ["aeropods", "AeroPods Studio", "electronics", 8999, 7499, 4.9, 34, "Signal Works", "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80", "#6a7fdb"],
  ["ceramic-set", "Moss Ceramic Set", "home", 2899, 2299, 4.6, 15, "Clay & Co.", "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80", "#6d8c54"],
  ["glow-serum", "Glow Ritual Serum", "beauty", 2499, 1999, 4.8, 42, "Kind Lab", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80", "#d67aa5"],
  ["training-mat", "Tempo Training Mat", "sports", 3499, 2899, 4.7, 31, "Motion Yard", "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=80", "#d1a14d"],
  ["notebook-trio", "Margins Notebook Trio", "stationery", 1299, 999, 4.5, 64, "Paper Assembly", "https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?auto=format&fit=crop&w=900&q=80", "#5f7f9f"],
  ["weekender", "Northline Weekender", "travel", 7299, 6499, 4.8, 21, "Roam Supply", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80", "#7b6f59"],
  ["loom-blocks", "Little Loom Blocks", "kids", 2199, 1799, 4.9, 38, "Tiny Foundry", "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=900&q=80", "#df765f"],
  ["granola-box", "Harvest Granola Box", "food", 1499, 1199, 4.6, 55, "Morning Mill", "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=900&q=80", "#b67b43"],
  ["book-collection", "Quiet Pages Collection", "books", 1899, 1499, 4.7, 24, "Ink Current", "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80", "#8f5b4a"],
  ["recovery-pillow", "Recovery Cloud Pillow", "wellness", 3999, 3299, 4.8, 29, "Rest Method", "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80", "#7aa6a1"],
  ["wireless-charger", "Arc Wireless Charger", "electronics", 3499, 2799, 4.5, 46, "Signal Works", "https://images.unsplash.com/photo-1603539444875-76e7684265f6?auto=format&fit=crop&w=900&q=80", "#526db6"],
  ["overshirt", "Ridge Knit Overshirt", "fashion", 4599, 3899, 4.6, 19, "Atelier North", "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80", "#8b6b52"],
  ["candle-pair", "Botanical Candle Pair", "home", 1999, 1599, 4.7, 51, "House of Forma", "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80", "#587c65"],
  ["bath-soak", "Breathe Bath Soak", "beauty", 1799, 1399, 4.5, 37, "Kind Lab", "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=80", "#9b8fc3"],
  ["skipping-rope", "Pulse Skipping Rope", "sports", 1599, 1199, 4.4, 70, "Motion Yard", "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80", "#bd4b4b"],
  ["planner-kit", "Pocket Planner Kit", "stationery", 999, 799, 4.6, 80, "Paper Assembly", "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80", "#d0a95b"],
  ["trail-flask", "Trail Flask Set", "travel", 2599, 2199, 4.7, 43, "Roam Supply", "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80", "#3f7468"],
  ["mystery-box", "Studio Mystery Box", "other", 2999, 2499, 4.8, 16, "Zhatpat Edit", "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=80", "#6f5f97"],
];

export const featuredProducts = catalogSeed.map(([
  _id,
  name,
  category,
  price,
  discountedPrice,
  rating,
  stock,
  seller,
  image,
  accent,
]) => ({
  _id,
  name,
  category,
  price,
  discountedPrice,
  rating,
  stock,
  seller,
  image,
  accent,
}));

export const getProductsApi = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();

    return data.products?.map((product) => ({
      ...product,
      image: product.images?.[0]?.url || product.image,
      seller: product.seller?.storeName || product.seller || "Curated seller",
    })) || featuredProducts;
  } catch (error) {
    return featuredProducts;
  }
};
