import express from "express";
const router = express.Router();
import { register, login, logout, resetPassword } from "../Controllers/AuthController";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
//router.post("/reset",sendResetMail);
// router.post("/new-password",resetPassword);

export default router;
