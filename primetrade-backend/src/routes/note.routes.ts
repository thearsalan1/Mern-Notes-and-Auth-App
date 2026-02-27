import { Router } from "express";
import {
  createNote,
  getMyNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/note.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/", auth, createNote);
router.get("/", auth, getMyNotes);
router.get("/:id", auth, getNoteById);
router.put("/:id", auth, updateNote);
router.delete("/:id", auth, deleteNote);

export default router;
