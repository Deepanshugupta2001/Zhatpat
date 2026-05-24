import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import { featuredFallback } from "./product.service.js";

const makePaymentReference = () => `MOCK-${Date.now()}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;

export const orderService = {
  async createOrder(userId, payload) {
    const realProductIds = payload.items
      .map((item) => item.product)
      .filter((productId) => /^[a-f\d]{24}$/i.test(productId));
    const products = realProductIds.length
      ? await Product.find({ _id: { $in: realProductIds }, isActive: true })
      : [];

    const orderItems = payload.items.map((item) => {
      const product = products.find((entry) => entry._id.toString() === item.product);
      const fallbackProduct = featuredFallback.find((entry) => entry._id === item.product);

      if (!product && !fallbackProduct && !item.name) {
        const error = new Error("One or more products are unavailable");
        error.statusCode = 422;
        throw error;
      }

      const price = product?.discountedPrice || product?.price || fallbackProduct?.discountedPrice || fallbackProduct?.price || item.price;

      return {
        product: product?._id,
        seller: product?.seller,
        name: product?.name || fallbackProduct?.name || item.name,
        image: product?.images?.[0]?.url || fallbackProduct?.images?.[0]?.url || item.image,
        price,
        quantity: item.quantity,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCharge = subtotal >= 2999 ? 0 : 149;

    return Order.create({
      customer: userId,
      items: orderItems,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentMethod === "cod" ? "pending" : "paid",
      paymentGateway: payload.paymentMethod === "cod" ? "cash_on_delivery" : "mock_gateway",
      paymentReference: payload.paymentMethod === "cod" ? undefined : makePaymentReference(),
      orderStatus: payload.paymentMethod === "cod" ? "confirmed" : "packing",
      notes: payload.notes,
      subtotal,
      shippingCharge,
      total: subtotal + shippingCharge,
    });
  },

  async getCustomerOrders(userId) {
    return Order.find({ customer: userId }).sort({ createdAt: -1 });
  },

  async updateOrderStatus(orderId, orderStatus) {
    const order = await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true });

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      throw error;
    }

    return order;
  },
};
