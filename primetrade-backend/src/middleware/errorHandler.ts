import { NextFunction, Request, Response } from "express";


export const errorHandler = async(err:any,req:Request,res:Response , next:NextFunction)=>{
console.log(err);
const statusCode = err.statusCode || 500;
res.status(statusCode).json({
  success:false,
  message:err.message || "Internal server error"
});
}