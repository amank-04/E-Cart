import { Router } from "express";
import {
  createCartItem,
  getAllCartItems,
  deleteCartItem,
  selectAllCartItems,
  updateCartItem,
  clearAllCart,
} from "../controllers/cart.controller";
import { verifyToken } from "../utils/verify-token";
const router = Router();

router.post("/", verifyToken, getAllCartItems);
router.post("/create", verifyToken, createCartItem);
router.post("/update", verifyToken, updateCartItem);
router.post("/del", verifyToken, deleteCartItem);
router.post("/select", verifyToken, selectAllCartItems);
router.post("/clear", verifyToken, clearAllCart);

export default router;
