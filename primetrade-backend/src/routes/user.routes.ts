import { Router } from "express";
import { register, login, me, logout } from "../controllers/auth.controllers";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);
router.post("/logout", auth, logout);

export default router;
