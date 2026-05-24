import { productService } from "../../services/product.service.js";

export const listProducts = async (req, res, next) => {
  try {
    const products = await productService.listProducts(req.query);
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProduct(req.params.id);
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.user._id, req.body);
    res.status(201).json({ success: true, message: "Product created", product });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const product = await productService.addReview(req.params.id, req.user._id, req.body);
    res.status(201).json({ success: true, message: "Review added", product });
  } catch (error) {
    next(error);
  }
};
