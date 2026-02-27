import { Response } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

export const generateTokenAndSetCookie = (
  res: Response,
  payload: { id: string; role: "user" | "admin" }
) => {
  const secret: Secret = process.env.JWT_SECRET as string;

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"],
  };

  const token = jwt.sign(payload, secret, options);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return token;
};