import express from "express";
import {
  getMe,
  login,
  loginCustomer,
  loginSeller,
  logout,
  registerCustomer,
  registerSeller,
  updateProfile,
} from "../controllers/auth.controller.js";
import { optionalAuth, protect } from "../middleware/auth.middleware.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import {
  loginSchema,
  registerCustomerSchema,
  registerSellerSchema,
  updateProfileSchema,
} from "../../schemas/auth.schema.js";

const router = express.Router();

router.post("/register/customer", validateSchema(registerCustomerSchema), registerCustomer);
router.post("/register/seller", validateSchema(registerSellerSchema), registerSeller);
router.post("/login", validateSchema(loginSchema), login);
router.post("/login/customer", validateSchema(loginSchema), loginCustomer);
router.post("/login/seller", validateSchema(loginSchema), loginSeller);
router.post("/logout", protect, logout);
router.get("/me", optionalAuth, getMe);
router.patch("/update-profile", protect, validateSchema(updateProfileSchema), updateProfile);

export default router;
