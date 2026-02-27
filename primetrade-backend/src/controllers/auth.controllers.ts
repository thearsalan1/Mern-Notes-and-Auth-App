import { NextFunction, Request, Response } from "express";
import { User } from "../modules/users/user.model";
import { generateTokenAndSetCookie } from "../utils/jwt";

export const register = async (req:Request,res:Response, next: NextFunction
)=>{
  try {
    const {email,password,role}= req.body;
    if(!password || !email || !role){
      return res.status(400).json({success:false,message:"All fields required"})
    }
    if(password.length!>=6){
      return res.status(400).json({success:false,message:"Password must be longer than 6 characters"});
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({success:false,message:"User already registered"})
    }

    const user= await User.create({
      email,
      password,
      role
    })

    generateTokenAndSetCookie(res,{id:user._id.toString(),role:user.role});

    res.status(201).json({
      success: true,
      data: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
}

export const login = async (req:Request, res:Response,next:NextFunction)=>{
  try {
    const {email,password}= req.body;
    if(!email || ! password){
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }
     const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res,{id:user._id.toString(),role:user.role})

    res.json({
      success:true,
      data:{
        id:user._id,
        email:user.email,
        role:user.role
      }
    })
  } catch (error) {
    next(error)
  }
}

export const me = async(req:any,res:Response)=>{
 const user = await User.findById(req.user.id).select("-password");
 res.json({success:true,data:user}); 
}

export const logout = async(req:Request,res:Response)=>{
  res.clearCookie("token");
  res.json({
    success:true,
    message:"Logged Out"
  })
}