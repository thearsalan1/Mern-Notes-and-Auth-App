import { Router } from "express";
import { requireRole, auth } from "../middleware/auth";
import {User}  from "../modules/users/user.model";

const adminRouter = Router();

adminRouter.get("/users", auth, requireRole(["admin"]), async (_req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

export default adminRouter;
