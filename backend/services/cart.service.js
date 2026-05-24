import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

export const cartService = {
  async getCart(userId) {
    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    return cart;
  },

  async addItem(userId, productId, quantity = 1) {
    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      const error = new Error("Product is not available");
      error.statusCode = 404;
      throw error;
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { user: userId, items: [] } },
      { upsert: true, new: true },
    );
    const existing = cart.items.find((item) => item.product.toString() === productId);

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        price: product.discountedPrice || product.price,
      });
    }

    await cart.save();
    return cart.populate("items.product");
  },

  async clearCart(userId) {
    return Cart.findOneAndUpdate({ user: userId }, { items: [] }, { new: true, upsert: true });
  },
};
