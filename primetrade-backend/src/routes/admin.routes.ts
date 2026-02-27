import { Router } from "express";
import { requireRole, auth } from "../middleware/auth";
import {User}  from "../modules/users/user.model";
import { Note } from "../modules/notes/notes.model";

const adminRouter = Router();

adminRouter.get("/users", auth, requireRole(["admin"]), async (_req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/notes", auth, requireRole(["admin"]), async (_req, res, next) => {
  try {
    const notes = await Note.find()
      .populate("owner", "email role")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: notes });
  } catch (err) {
    next(err);
  }
});

export default adminRouter;
