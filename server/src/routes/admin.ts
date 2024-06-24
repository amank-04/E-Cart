import { Router } from "express";
import { getAllProducts } from "../controllers/products.controller";
import {
  getAllOrders,
  getAllUsers,
  addNewProduct,
  updateOrderStatus,
  updateProduct,
  deleteProduct,
} from "../controllers/admin.controller";
const router = Router();

router.get("/products", getAllProducts);
router.get("/orders", getAllOrders);
router.post("/orders", updateOrderStatus);
router.get("/customers", getAllUsers);
router.post("/add-product", addNewProduct);
router.post("/delete", deleteProduct);
router.post("/update-product", updateProduct);

export default router;
