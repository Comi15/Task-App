import jwt from "jsonwebtoken";
import express from "express";
import { COOKIE_NAME } from "../Services/authService";

export const isAuthenticated = (
  req: express.Request,
  res: express.Response,
  next: any,
) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    return res.status(401).json("Access denied");
  }

  try {
    jwt.verify(token, process.env.TOKEN_KEY as string);
    next();
  } catch (error: any) {
    return res.status(401).json("Invalid token");
  }
};
