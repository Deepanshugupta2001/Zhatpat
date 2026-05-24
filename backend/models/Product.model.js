import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
}, { timestamps: true });

export const PRODUCT_CATEGORIES = [
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

const productSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discountedPrice: { type: Number, min: 0 },
  category: {
    type: String,
    enum: PRODUCT_CATEGORIES,
    required: true,
  },
  images: [{ url: String, public_id: String }],
  stock: { type: Number, required: true, default: 0, min: 0 },
  sku: { type: String, trim: true },
  tags: [String],
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.methods.updateRating = function () {
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.rating = total / this.reviews.length;
  this.numReviews = this.reviews.length;
};

productSchema.index({ name: "text", tags: "text" });

export default mongoose.model("Product", productSchema);
