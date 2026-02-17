import express from "express";
const router = express.Router();
import { addTask, deleteTask, filterTasks, getMinAndMaxDate, getPercentageOfFinishedTasks, getTasks,getTasksByUserId, updateTask, updateTaskStatus } from "../Controllers/TaskController";
import { isAuthenticated } from "../middlewares/authMiddleware";

router.post("/add", isAuthenticated, addTask);
router.get("/", isAuthenticated, getTasks);
router.get("/:id",isAuthenticated,getTasksByUserId);
router.put("/update",isAuthenticated,updateTask);
router.delete("/:id",isAuthenticated,deleteTask);
router.put("/filter",isAuthenticated,filterTasks);
router.get("/dates/date",isAuthenticated,getMinAndMaxDate);
router.patch("/update/status",isAuthenticated,updateTaskStatus);
router.get("/percentage/:userId/:selectedBoardId",isAuthenticated,getPercentageOfFinishedTasks);
export default router;
