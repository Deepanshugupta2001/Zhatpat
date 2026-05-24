import express from "express";
import { getSellerDashboard } from "../controllers/seller.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("seller"), getSellerDashboard);

export default router;
