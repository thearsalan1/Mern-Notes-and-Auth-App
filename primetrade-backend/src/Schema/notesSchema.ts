import { z } from "zod";

export const createNoteBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(5000, "Content must be at most 5000 characters"),
});

export const updateNoteBodySchema = createNoteBodySchema.partial();

export const noteIdParamSchema = z.object({
  id: z.string().min(1, "Note id is required"),
});

export type CreateNoteBody = z.infer<typeof createNoteBodySchema>;
export type UpdateNoteBody = z.infer<typeof updateNoteBodySchema>;
export type NoteIdParams = z.infer<typeof noteIdParamSchema>;
