import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  storeName: { type: String, required: true, trim: true },
  storeDescription: { type: String, trim: true },
  storeLogo: { type: String },
  storeBanner: { type: String },
  rating: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  bankDetails: {
    accountName: String, accountNumber: String,
    ifscCode: String, bankName: String,
  },
  gstNumber: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Seller", sellerSchema);