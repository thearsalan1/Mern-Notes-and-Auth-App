import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Note } from "../modules/notes/notes.model";
import {
  createNoteBodySchema,
  updateNoteBodySchema,
  noteIdParamSchema,
} from "../Schema/notesSchema";

export const createNote = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validatedData = createNoteBodySchema.parse(req.body);

    const note = await Note.create({
      title: validatedData.title,
      content: validatedData.content,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: error.errors,
        },
      });
    }
    next(error);
  }
};

export const getNotes = async (req: any, res: Response, next: NextFunction) => {
  try {
    const notes = await Note.find({ owner: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = noteIdParamSchema.parse(req.params);

    const note = await Note.findOne({
      _id: new mongoose.Types.ObjectId(id),
      owner: new mongoose.Types.ObjectId(req.user.id),
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Note not found" },
      });
    }

    res.json({
      success: true,
      data: note,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: error.errors,
        },
      });
    }
    next(error);
  }
};

export const updateNote = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = noteIdParamSchema.parse(req.params);
    const validatedData = updateNoteBodySchema.parse(req.body);

    const note = await Note.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        owner: new mongoose.Types.ObjectId(req.user.id),
      },
      { ...validatedData },
      { returnDocument: "after", runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Note not found" },
      });
    }

    res.json({
      success: true,
      data: note,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: error.errors,
        },
      });
    }
    next(error);
  }
};

export const deleteNote = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = noteIdParamSchema.parse(req.params);

    const note = await Note.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      owner: new mongoose.Types.ObjectId(req.user.id),
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Note not found" },
      });
    }

    res.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: error.errors,
        },
      });
    }
    next(error);
  }
};