import { Router } from "express";
import { verifyToken } from "../utils/verify-token";
import { getOrders } from "../controllers/orders.controller";
const router = Router();

router.post("/", verifyToken, getOrders);

export default router;
