import express from "express";
import { addReview, createProduct, getProduct, listProducts } from "../controllers/product.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import { productSchema, reviewSchema } from "../../schemas/product.schema.js";

const router = express.Router();

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", protect, authorize("seller"), validateSchema(productSchema), createProduct);
router.post("/:id/reviews", protect, authorize("customer"), validateSchema(reviewSchema), addReview);

export default router;
