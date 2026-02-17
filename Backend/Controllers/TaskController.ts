import express from "express";
import {
  doAddTask,
  doDeleteTask,
  doFilterTasks,
  doGetMinandMaxDate,
  doGetPercentageOfFinishedTasks,
  doGetTasks,
  doGetTasksByUserId,
  doUpdateTask,
  doUpdateTaskStatus,
} from "../Services/taskService";
import { handleErrors } from "../Helpers/errorHandleHelper";
export const addTask = async (req: express.Request, res: express.Response) => {
  try {
    const returnValue = await doAddTask(req);
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

export const getTasks = async (req: express.Request, res: express.Response) => {
  try {
    const returnValue = await doGetTasks();
    if (!returnValue) {
      return res
        .status(500)
        .json("Something went wrong on the server in the services");
    }
    if (returnValue.errMessage) {
      return res
        .status(returnValue.httpStatusCode)
        .json(returnValue.errMessage);
    }

    res.status(returnValue.httpStatusCode).json(returnValue.dataArray);
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return res.status(500).json(errMessage);
  }
};

export const getTasksByUserId = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const taskBoardId = req.query.taskBoardId;
    const tasks = await doGetTasksByUserId(id, taskBoardId as string);
    if (!tasks) {
      return res
        .status(500)
        .json("Something went wrong with retrieving the tasks")
        .end();
    }
    if (tasks.errMessage) {
      return res.status(tasks.httpStatusCode).json(tasks.errMessage).end();
    }

    return res.status(tasks.httpStatusCode).json(tasks.dataArray).end();
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return res.status(500).json(errMessage);
  }
};

export const updateTask = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const taskUpdateValue = req.body;
    if (!taskUpdateValue) {
      return res
        .status(500)
        .json("Could not get the values from the request body");
    }
    const updatedTask = await doUpdateTask(taskUpdateValue);
    if (!updatedTask) {
      return res
        .status(500)
        .json("Could not update the task, please try again");
    }
    if (updatedTask.errMessage) {
      return res
        .status(updatedTask.httpStatusCode)
        .json(updatedTask.errMessage);
    }

    res.status(updatedTask.httpStatusCode).json(updatedTask.data);
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return res.status(500).json(errMessage);
  }
};

export const deleteTask = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const deleteResult = await doDeleteTask(id);
    if (!deleteResult) {
      return res.status(500).json("Something went wrong can't delete the task");
    }
    if (deleteResult.errMessage) {
      return res
        .status(deleteResult.httpStatusCode)
        .json(deleteResult.errMessage);
    }
    //if everything is alright
    res.status(deleteResult.httpStatusCode).json(deleteResult.data);
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return res.status(500).json(errMessage);
  }
};

export const filterTasks = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    if (!req.body) {
      throw new Error("Couldn't get the data from the request body");
    }
    const filterResults = await doFilterTasks(req.body);
    if (!filterResults) {
      return res
        .status(500)
        .json("Oops something went wrong while trying to filter the tasks...");
    }
    if (filterResults.errMessage) {
      return res
        .status(filterResults.httpStatusCode)
        .json(filterResults.errMessage);
    }

    if(Array.isArray(filterResults.dataArray) && !filterResults.dataArray.length) {
      return res
        .status(filterResults.httpStatusCode)
        .json(filterResults.dataArray);
    }

    res.status(filterResults.httpStatusCode).json(filterResults.dataArray);
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return res.status(500).json(errMessage);
  }
};

export const getMinAndMaxDate = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const dates = await doGetMinandMaxDate();
    if (!dates) {
      return res
        .status(500)
        .json(
          "Oops something went wrong while trying to get the min, max date...",
        );
    }
    if (dates.errMessage) {
      return res.status(dates.httpStatusCode).json(dates.errMessage);
    }

    res.status(dates.httpStatusCode).json(dates.data);
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return res.status(500).json(errMessage);
  }
};

export const updateTaskStatus = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { taskId, status, userEmail } = req.body;
    if (!taskId || !status || !userEmail) {
      return res.status(400).json("Couldn't get the data from the body");
    }
    const updatedTask = await doUpdateTaskStatus(req.body);
    if (!updatedTask) {
      return res
        .status(500)
        .json(
          "Oops something went wrong while trying to update task status...",
        );
    }
    if (updatedTask.errMessage) {
      return res
        .status(updatedTask.httpStatusCode)
        .json(updatedTask.errMessage);
    }

    res.status(updatedTask.httpStatusCode).json(updatedTask.data);
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return res.status(500).json(errMessage);
  }
};

export const getPercentageOfFinishedTasks = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { userId, selectedBoardId } = req.params;
    const percentageOfTasksFinished = await doGetPercentageOfFinishedTasks(
      userId,
      selectedBoardId,
    );
    if (!percentageOfTasksFinished) {
      return res
        .status(500)
        .json(
          "Oops something went wrong while trying to calculate the percentage of tasks finished...",
        );
    }
    if (percentageOfTasksFinished.errMessage) {
      return res.status(500).json(percentageOfTasksFinished.errMessage);
    }

    res
      .status(percentageOfTasksFinished.httpStatusCode)
      .json(percentageOfTasksFinished.data);
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return res.status(500).json(errMessage);
  }
};
