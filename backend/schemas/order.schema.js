import { z } from "zod";

const checkoutItemSchema = z.object({
  product: z.string().trim().min(1),
  quantity: z.coerce.number().int().min(1),
  name: z.string().trim().optional(),
  price: z.coerce.number().positive().optional(),
  image: z.string().trim().optional(),
  seller: z.string().trim().optional(),
});

export const orderSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "Add at least one item to checkout"),
  shippingAddress: z.object({
    name: z.string().trim().min(2),
    phone: z.string().trim().min(7),
    street: z.string().trim().min(3),
    city: z.string().trim().min(2),
    state: z.string().trim().min(2),
    pincode: z.string().trim().min(4),
    country: z.string().trim().default("India"),
  }),
  paymentMethod: z.enum(["cod", "upi", "card", "netbanking"]).default("cod"),
  paymentToken: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const orderStatusSchema = z.object({
  orderStatus: z.enum(["placed", "confirmed", "packing", "shipped", "out_for_delivery", "delivered", "cancelled"]),
});
