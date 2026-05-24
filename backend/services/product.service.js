import mongoose from "mongoose";
import Product from "../models/Product.model.js";
import Seller from "../models/Seller.model.js";

const catalogSeed = [
  ["sample-01", "Orbit Desk Lamp", "home", 4299, 3599, 4.8, 18, "House of Forma", "A sculptural wireless desk lamp with warm dimming and a terrazzo base.", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80", "#f08a5d"],
  ["sample-02", "Muse Carryall", "fashion", 5999, 4899, 4.7, 27, "Atelier North", "Structured vegan leather tote with modular pockets for work and weekend use.", "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80", "#2f9c95"],
  ["sample-03", "AeroPods Studio", "electronics", 8999, 7499, 4.9, 34, "Signal Works", "Noise-isolating earbuds with airy tuning and a matte aluminum pocket case.", "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80", "#6a7fdb"],
  ["sample-04", "Moss Ceramic Set", "home", 2899, 2299, 4.6, 15, "Clay & Co.", "Hand-glazed tableware set with soft green pooling and stackable dinner shapes.", "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80", "#6d8c54"],
  ["sample-05", "Glow Ritual Serum", "beauty", 2499, 1999, 4.8, 42, "Kind Lab", "Lightweight vitamin serum with niacinamide, rice water, and a non-sticky finish.", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80", "#d67aa5"],
  ["sample-06", "Tempo Training Mat", "sports", 3499, 2899, 4.7, 31, "Motion Yard", "Grip-forward workout mat built for yoga, mobility, and compact home gyms.", "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=80", "#d1a14d"],
  ["sample-07", "Margins Notebook Trio", "stationery", 1299, 999, 4.5, 64, "Paper Assembly", "Lay-flat notebooks with warm paper, numbered pages, and index cards.", "https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?auto=format&fit=crop&w=900&q=80", "#5f7f9f"],
  ["sample-08", "Northline Weekender", "travel", 7299, 6499, 4.8, 21, "Roam Supply", "Cabin-friendly canvas weekender with a shoe tunnel and padded laptop sleeve.", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80", "#7b6f59"],
  ["sample-09", "Little Loom Blocks", "kids", 2199, 1799, 4.9, 38, "Tiny Foundry", "Color-rich wooden block set for open-ended building and tactile play.", "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=900&q=80", "#df765f"],
  ["sample-10", "Harvest Granola Box", "food", 1499, 1199, 4.6, 55, "Morning Mill", "Small-batch granola sampler with cacao, berry, seed, and jaggery blends.", "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=900&q=80", "#b67b43"],
  ["sample-11", "Quiet Pages Collection", "books", 1899, 1499, 4.7, 24, "Ink Current", "A curated four-book set for design, living, food, and slow weekend reading.", "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80", "#8f5b4a"],
  ["sample-12", "Recovery Cloud Pillow", "wellness", 3999, 3299, 4.8, 29, "Rest Method", "Cooling contour pillow with responsive support for side and back sleepers.", "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80", "#7aa6a1"],
  ["sample-13", "Arc Wireless Charger", "electronics", 3499, 2799, 4.5, 46, "Signal Works", "Angled wireless charging stand with braided cable and soft status lighting.", "https://images.unsplash.com/photo-1603539444875-76e7684265f6?auto=format&fit=crop&w=900&q=80", "#526db6"],
  ["sample-14", "Ridge Knit Overshirt", "fashion", 4599, 3899, 4.6, 19, "Atelier North", "Textured cotton overshirt with relaxed structure and natural corozo buttons.", "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80", "#8b6b52"],
  ["sample-15", "Botanical Candle Pair", "home", 1999, 1599, 4.7, 51, "House of Forma", "Soy wax candle duo with basil citrus and smoked fig fragrance profiles.", "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80", "#587c65"],
  ["sample-16", "Breathe Bath Soak", "beauty", 1799, 1399, 4.5, 37, "Kind Lab", "Mineral bath soak with eucalyptus, sea salt, and oat milk powder.", "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=80", "#9b8fc3"],
  ["sample-17", "Pulse Skipping Rope", "sports", 1599, 1199, 4.4, 70, "Motion Yard", "Weighted speed rope with matte handles and smooth bearing rotation.", "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80", "#bd4b4b"],
  ["sample-18", "Pocket Planner Kit", "stationery", 999, 799, 4.6, 80, "Paper Assembly", "Pocket planner, brass clip, tab stickers, and smooth gel pen bundle.", "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80", "#d0a95b"],
  ["sample-19", "Trail Flask Set", "travel", 2599, 2199, 4.7, 43, "Roam Supply", "Insulated flask with two nesting cups for city commutes and short trails.", "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80", "#3f7468"],
  ["sample-20", "Studio Mystery Box", "other", 2999, 2499, 4.8, 16, "Zhatpat Edit", "A rotating box of small-batch accessories, desk goods, and limited finds.", "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=80", "#6f5f97"],
];

export const featuredFallback = catalogSeed.map(([
  _id,
  name,
  category,
  price,
  discountedPrice,
  rating,
  stock,
  seller,
  description,
  image,
  accent,
]) => ({
  _id,
  name,
  description,
  price,
  discountedPrice,
  category,
  stock,
  rating,
  seller,
  accent,
  tags: [category, seller.toLowerCase().replaceAll(" ", "-")],
  images: [{ url: image }],
  isFeatured: true,
}));

export const productService = {
  async listProducts(query) {
    if (mongoose.connection.readyState !== 1) {
      return featuredFallback;
    }

    const filter = { isActive: true };

    if (query.category && query.category !== "all") filter.category = query.category;
    if (query.search) filter.$text = { $search: query.search };

    const products = await Product.find(filter)
      .populate("seller", "storeName rating")
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(Number(query.limit) || 40);

    return products.length ? products : featuredFallback;
  },

  async getProduct(productId) {
    const product = await Product.findById(productId).populate("seller", "storeName rating storeLogo");

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    return product;
  },

  async createProduct(userId, payload) {
    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
      const error = new Error("Seller profile not found");
      error.statusCode = 404;
      throw error;
    }

    return Product.create({ ...payload, seller: seller._id });
  },

  async addReview(productId, userId, payload) {
    const product = await Product.findById(productId);

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    product.reviews.push({ user: userId, ...payload });
    product.updateRating();
    await product.save();

    return product;
  },
};
