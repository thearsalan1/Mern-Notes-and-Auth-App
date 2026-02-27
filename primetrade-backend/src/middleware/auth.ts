import { NextFunction, Request, Response } from "express";
import  Jwt  from "jsonwebtoken";
import { AuthRequest } from "../types/types";

export const auth = (req:Request,res:Response,next:NextFunction)=>{
  try {
    const token = req.cookies?.token || (
      req.headers.authorization?.startsWith("Bearer ")?
      req.headers.authorization.split(" ")[1] 
      :null
    )

    if(!token){
      return res.status(401).json({success:false,message:"Unauthorized"});
    }

    const decoded = Jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id:string; role:'user' | 'admin'};

    req.user ={id:decoded.id , role:decoded.role}
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}


export const requireRole = (roles:("user" | "admin")[])=>{
  return (req:AuthRequest,res:Response,next:NextFunction)=>{
    if(!req.user || !req.user.role){
      return res.status(403).json({success:false,message:"Forbidden"})
    }
    next();
  }
}