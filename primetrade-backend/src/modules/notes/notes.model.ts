import mongoose from 'mongoose';
import { INotes } from './../../types/types';

const NotesSchema = new mongoose.Schema<INotes>({
  title:{
    type:String,
    required:true,
  },
  content:{
    type:String,
    required:true,
  },
  owner:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:true,
  }
},{timestamps:true})

export const Note = mongoose.model<INotes>('Note',NotesSchema)