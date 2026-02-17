import express from "express";
import { addTaskBoard, getTaskBoardsByUserId } from "../Controllers/TaskBoardController";
import { isAuthenticated } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/create",isAuthenticated, addTaskBoard);
router.get("/get/:userId",isAuthenticated,getTaskBoardsByUserId);


export default router;