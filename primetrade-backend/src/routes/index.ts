import { Router } from "express";
import userRoutes from "./user.routes";
import noteRoutes from "./note.routes";
import adminUserRoutes from "./admin.routes";


export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "API v1 healthy" });
});

router.use("/auth", userRoutes);
router.use("/notes", noteRoutes);
router.use("/admin", adminUserRoutes);

export default router;