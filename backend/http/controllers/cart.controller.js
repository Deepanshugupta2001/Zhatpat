import { cartService } from "../../services/cart.service.js";

export const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user._id);
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

export const addCartItem = async (req, res, next) => {
  try {
    const cart = await cartService.addItem(req.user._id, req.body.productId, req.body.quantity);
    res.status(201).json({ success: true, message: "Added to cart", cart });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user._id);
    res.json({ success: true, message: "Cart cleared", cart });
  } catch (error) {
    next(error);
  }
};
