import { Router } from "express";
import { getAllUsers } from "../controllers/users.controller";
import { getUserDetails, verifyAdmin, verifyToken } from "../utils/verify-token";
const router = Router();

router.get("/", verifyAdmin, getAllUsers);
router.post("/verify", verifyToken, getUserDetails);
// router.post("/delete", verifyToken, deleteUser);

export default router;
