import { z } from "zod";

export const registerCustomerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().trim().optional(),
});

export const registerSellerSchema = registerCustomerSchema.extend({
  storeName: z.string().trim().min(2, "Store name is required"),
  storeDescription: z.string().trim().max(500).optional(),
  gstNumber: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().optional(),
  avatar: z.string().trim().url().optional(),
  addresses: z.array(z.object({
    label: z.string().trim().optional(),
    street: z.string().trim().optional(),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    pincode: z.string().trim().optional(),
    country: z.string().trim().optional(),
    isDefault: z.boolean().optional(),
  })).optional(),
});
