import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../types/types";

export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

export const generateToken = (currentUser: User) => {
  const jwtSecretKey = process.env.TOKEN_KEY as string;
  return jwt.sign({ id: currentUser.id }, jwtSecretKey, {
    expiresIn: "2h",
  });
};
