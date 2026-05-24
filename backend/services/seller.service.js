import Seller from "../models/Seller.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";

export const sellerService = {
  async getDashboard(userId) {
    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
      const error = new Error("Seller profile not found");
      error.statusCode = 404;
      throw error;
    }

    const [products, orders] = await Promise.all([
      Product.find({ seller: seller._id }).sort({ createdAt: -1 }),
      Order.find({ "items.seller": seller._id }).sort({ createdAt: -1 }).limit(20),
    ]);
    const revenue = orders.reduce((sum, order) => {
      const sellerTotal = order.items
        .filter((item) => item.seller?.toString() === seller._id.toString())
        .reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);

      return sum + sellerTotal;
    }, 0);

    return {
      seller,
      stats: {
        products: products.length,
        orders: orders.length,
        revenue,
        averageRating: seller.rating,
      },
      products,
      orders,
    };
  },
};
