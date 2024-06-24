import { Router } from "express";
import {
  getAllProducts,
  getProduct,
  getProductReviews,
  addProductReview,
  getSearchedProducts,
} from "../controllers/products.controller";
import { verifyToken } from "../utils/verify-token";
export const router = Router();

router.get("/", getAllProducts);
router.get("/search", getSearchedProducts);
router.get("/:id", getProduct);
router.get("/:id/reviews", getProductReviews);
router.post("/:id/add-review", verifyToken, addProductReview);

export default router;
