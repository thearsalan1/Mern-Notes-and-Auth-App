import express, { Request, Response }   from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/user.routes"

dotenv.config();

const app= express();

app.use(
  cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
  })
)
app.use(express.json())
app.use(cookieParser());

app.use("/api/auth",authRoutes)

app.get("/health",(req:Request,res:Response)=>{
  res.status(200).json({message:"Server running"})
})

app.use(errorHandler)

export default app;