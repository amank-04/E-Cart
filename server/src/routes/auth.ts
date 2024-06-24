import { Router } from "express";
import { login, register, resetPassword, sendEmail } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/send-email", sendEmail);
router.post("/reset-password", resetPassword);

export default router;
