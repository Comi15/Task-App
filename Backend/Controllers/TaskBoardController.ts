import express from "express";
import { doAddTaskBoard, doGetTaskBoardsByUserId } from "../Services/taskBoardService";
import { TaskBoard } from "../types/types";
import { handleErrors } from "../Helpers/errorHandleHelper";

export const addTaskBoard = async (
  req: express.Request<{}, {}, TaskBoard>,
  res: express.Response
) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) {
      return res
        .status(400)
        .json("Couldn't get the values from the request body");
    }
    const returnValue = await doAddTaskBoard({ name, userId });
    if (!returnValue) {
      return res.status(500).json("Something went wrong on the server");
    }
    if (returnValue.errMessage) {
      return res
        .status(returnValue.httpStatusCode)
        .json(returnValue.errMessage);
    }
    res.status(returnValue.httpStatusCode).json(returnValue.data);
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return res.status(500).json(errMessage);
  }
};

export const getTaskBoardsByUserId = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;
    if(!userId){
        return res.status(400).json("Couldn't get the userId from the params");
    }
    const taskBoards = await doGetTaskBoardsByUserId(userId);
    if (!taskBoards) {
        return res.status(500).json("Something went wrong on the server");
      }
      if (taskBoards.errMessage) {
        return res
          .status(taskBoards.httpStatusCode)
          .json(taskBoards.errMessage);
      }

      return res.status(taskBoards.httpStatusCode).json(taskBoards.dataArray);
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return res.status(500).json(errMessage);
  }
};
