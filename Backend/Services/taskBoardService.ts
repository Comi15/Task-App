import express from "express";
import { v4 as uuidv4 } from "uuid";
import { TaskBoard, ReturnType, Role } from "../types/types";
import {
  addTaskBoard,
  getTaskBoardByUserId,
  getTaskBoardCount,
} from "../database/taskBoardRepo";
import { handleErrors } from "../Helpers/errorHandleHelper";
import { getUserRoleByUserId } from "../database/usersRepo";

export const doAddTaskBoard = async (
  taskBoard: TaskBoard
): Promise<ReturnType<string>> => {
  const id = uuidv4();
  const taskBoardToBeAdded: TaskBoard = {
    id: id,
    name: taskBoard.name,
    userId: taskBoard.userId,
  };
  try {
    const currentUserRole = await getUserRoleByUserId(taskBoard.userId);
    if (!currentUserRole) {
      return {
        errMessage: "Couldn't get the current user role",
        httpStatusCode: 500,
      };
    }

    const currentTaskBoardCount = await getTaskBoardCount(taskBoard.userId);
    if (!currentTaskBoardCount) {
      return {
        errMessage: "Couldn't get the current task board count",
        httpStatusCode: 500,
      };
    }

    if (currentTaskBoardCount >= 3 && currentUserRole != Role.Premium) {
      return {
        errMessage:
          "Only premium users can create more than 3 task boards, please upgrade to premium.",
        httpStatusCode: 401,
      };
    }
    const taskBoardAdded = await addTaskBoard(taskBoardToBeAdded);
    if (!taskBoardAdded) {
      return {
        errMessage: "Couldn't add the task board, something wrong with the db",
        httpStatusCode: 500,
      };
    }

    return { data: taskBoardAdded as string, httpStatusCode: 200 };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    throw new Error(errMessage);
  }
};

export const doGetTaskBoardsByUserId = async (
  userId: string
): Promise<ReturnType<TaskBoard>> => {
  try {
    const taskBoards = await getTaskBoardByUserId(userId);
    if (!taskBoards) {
      return {
        errMessage:
          "Couldn't fetch the task boards, something wrong with the db",
        httpStatusCode: 500,
      };
    }

    return { dataArray: taskBoards, httpStatusCode: 200 };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    throw new Error(errMessage);
  }
};
