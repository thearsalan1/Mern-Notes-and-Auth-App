import { NextFunction, Request, Response } from "express";
import { User } from "../modules/users/user.model";
import { generateTokenAndSetCookie } from "../utils/jwt";
import { registerBodySchema, loginBodySchema } from "../Schema/userSchema";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerBodySchema.parse(req.body);

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: "USER_EXISTS", message: "Email already registered" },
      });
    }

    const user = await User.create({
      email: validatedData.email,
      password: validatedData.password,
      role: validatedData.role,
    });

    generateTokenAndSetCookie(res, { id: user._id.toString(), role: user.role });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
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

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginBodySchema.parse(req.body);

    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" },
      });
    }

    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" },
      });
    }

    generateTokenAndSetCookie(res, { id: user._id.toString(), role: user.role });

    res.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
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

export const me = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged Out" });
};