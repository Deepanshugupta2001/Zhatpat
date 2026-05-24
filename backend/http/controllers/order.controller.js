import { orderService } from "../../services/order.service.js";

export const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user._id, req.body);
    res.status(201).json({ success: true, message: "Order placed", order });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getCustomerOrders(req.user._id);
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.orderStatus);
    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    next(error);
  }
};
