import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/types";
import { Note } from "../modules/notes/notes.model";

export const createNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content required" });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await Note.create({ title, content, owner: userId });

    res.status(201).json({ success: true, message: "Note created successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMyNotes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const notes = await Note.find({ owner: userId });

    if (!notes.length) {
      return res.status(404).json({ success: false, message: "No notes found" });
    }

    res.json({ success: true, data: notes });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      owner: req.user!.id 
    });
    
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    res.json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;

    if (!title && !content) {
      return res.status(400).json({ success: false, message: "Nothing to update" });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.user!.id },
      { $set: { title, content } },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    res.json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      owner: req.user?.id,
    });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    next(err);
  }
};