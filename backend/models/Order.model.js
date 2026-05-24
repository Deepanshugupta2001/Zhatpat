import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
  name: String, image: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  shippingAddress: {
    name: String, phone: String,
    street: String, city: String,
    state: String, pincode: String,
    country: { type: String, default: "India" },
  },
  paymentMethod: { type: String, enum: ["cod", "upi", "card", "netbanking"], default: "cod" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  paymentGateway: { type: String, default: "mock" },
  paymentReference: { type: String },
  orderStatus: {
    type: String,
    enum: ["placed", "confirmed", "packing", "shipped", "out_for_delivery", "delivered", "cancelled"],
    default: "placed",
  },
  subtotal: { type: Number, required: true },
  shippingCharge: { type: Number, default: 0 },
  total: { type: Number, required: true },
  notes: { type: String },
  cancelReason: { type: String },
  deliveredAt: { type: Date },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
