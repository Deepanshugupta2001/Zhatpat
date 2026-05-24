import { z } from "zod";

export const productCategories = [
  "electronics",
  "fashion",
  "home",
  "beauty",
  "sports",
  "books",
  "food",
  "wellness",
  "kids",
  "stationery",
  "travel",
  "other",
];

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name is required"),
  description: z.string().trim().min(12, "Description should be more detailed"),
  price: z.coerce.number().positive("Price must be greater than zero"),
  discountedPrice: z.coerce.number().nonnegative().optional(),
  category: z.enum(productCategories),
  images: z.array(z.object({
    url: z.string().trim().url(),
    public_id: z.string().trim().optional(),
  })).optional(),
  stock: z.coerce.number().int().nonnegative(),
  sku: z.string().trim().optional(),
  tags: z.array(z.string().trim()).optional(),
  isFeatured: z.boolean().optional(),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(500).optional(),
});
