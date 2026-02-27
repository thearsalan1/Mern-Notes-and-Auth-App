import { Request } from "express";
import mongoose, { Document } from "mongoose";

export interface AuthRequest extends Request{
  user?:{
    id:string,
    role:"user" | "admin"
  }
}

export interface IUser extends Document{
  email:String,
  password:string,
  role:'user' | 'admin'
  comparePassword(candidate:string):Promise<boolean>
}

export interface INotes extends Document{
  title:string,
  content:string,
  owner:mongoose.Types.ObjectId,
}