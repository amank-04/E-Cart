import { Router } from "express";
import { createCheckout, verifySessionId } from "../controllers/checkout.controller";
const router = Router();

router.post("/", createCheckout);
router.post("/verify", verifySessionId);

export default router;
