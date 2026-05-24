import express from "express";
import { z } from "zod";
import { addCartItem, clearCart, getCart } from "../controllers/cart.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { validateSchema } from "../middleware/validate.middleware.js";

const router = express.Router();
const cartItemSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.coerce.number().int().min(1).default(1),
});

router.use(protect, authorize("customer"));
router.get("/", getCart);
router.post("/items", validateSchema(cartItemSchema), addCartItem);
router.delete("/", clearCart);

export default router;
