import { Document } from "mongoose";

export interface AuthRequest extends Document{
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