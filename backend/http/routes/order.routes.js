import express from "express";
import { createOrder, getMyOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import { orderSchema, orderStatusSchema } from "../../schemas/order.schema.js";

const router = express.Router();

router.get("/my", protect, authorize("customer"), getMyOrders);
router.post("/", protect, authorize("customer"), validateSchema(orderSchema), createOrder);
router.patch("/:id/status", protect, authorize("seller"), validateSchema(orderStatusSchema), updateOrderStatus);

export default router;
