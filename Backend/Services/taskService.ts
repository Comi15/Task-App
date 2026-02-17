import express from "express";
import { v4 as uuidv4 } from "uuid";
import cron from "node-cron";
import {
  Task,
  ReturnType,
  FilterData,
  MinMaxDate,
  StatusUpdate,
} from "../types/types";
import {
  addTaskDb,
  deleteTask,
  filterTasks,
  getAllTaskDueDates,
  getAllTasks,
  getMinMaxDate,
  getNumberOfFinishedTasksByUser,
  getNumberOfTasksByUser,
  getTaskById,
  getTasksByUserid,
  updateStatus,
  updateTask,
} from "../database/tasksRepo";
import { handleErrors } from "../Helpers/errorHandleHelper";
//import { sendEmail } from "./emailService";
import { timeUntilDueDate } from "../Helpers/dueDateCheckHelper";
export const doAddTask = async (
  req: express.Request,
): Promise<ReturnType<Task | null>> => {
  const id = uuidv4();
  const taskToBeAdded: Task = {
    id: id,
    userId: req.body.userId,
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    status: req.body.status,
    boardId: req.body.boardId,
  };
  try {
    const result = await addTaskDb(taskToBeAdded);
    if (!result) {
      return {
        errMessage: "Couldn't add the task, something wrong with the db",
        httpStatusCode: 500,
      };
    }
    if (result instanceof Error) {
      return { errMessage: result.message, httpStatusCode: 500 };
    }
    //return if everything is ok
    return { data: result, httpStatusCode: 200 };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { httpStatusCode: 500, errMessage: errMessage };
  }
};
export const doGetTasks = async (): Promise<ReturnType<Task | null>> => {
  try {
    const result = await getAllTasks();
    if (!result) {
      return {
        errMessage: "Something went wrong with the db couldn't retrieve tasks.",
        httpStatusCode: 500,
      };
    }
    if (result instanceof Error) {
      return { errMessage: result.message, httpStatusCode: 500 };
    }

    return { dataArray: result as Array<Task>, httpStatusCode: 200 };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { httpStatusCode: 500, errMessage: errMessage };
  }
};

export const doGetTasksByUserId = async (
  userId: string,
  taskBoardId: string,
): Promise<ReturnType<Task | null>> => {
  try {
    const tasks = await getTasksByUserid(userId, taskBoardId);
    if (!tasks) {
      throw new Error("Couldn't retrieve tasks from the db");
    }
    if (tasks instanceof Error) {
      return { httpStatusCode: 500, errMessage: tasks.message };
    }

    return { dataArray: tasks as Array<Task>, httpStatusCode: 200 };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { httpStatusCode: 500, errMessage: errMessage };
  }
};

export const doUpdateTask = async (task: Task): Promise<ReturnType<string>> => {
  try {
    const currentTask: Task = await getTaskById(task.id);
    if (!currentTask) {
      return {
        httpStatusCode: 500,
        errMessage:
          "Something went wrong, couldn't find the task with the given id",
      };
    }
    if (currentTask instanceof Error && currentTask.message) {
      return { httpStatusCode: 500, errMessage: currentTask.message };
    }
    if (
      currentTask.title === task.title &&
      currentTask.description === task.description &&
      currentTask.duedate === task.duedate &&
      currentTask.status === task.status &&
      currentTask.priority === task.priority
    ) {
      return {
        httpStatusCode: 400,
        errMessage: "You haven't changed any task details",
      };
    }

    const updatedTask = await updateTask(task);
    if (!updatedTask) {
      throw new Error("Could not update the task.");
    }
    if (updatedTask instanceof Error && updatedTask.message) {
      return { httpStatusCode: 500, errMessage: updatedTask.message };
    }
    return { httpStatusCode: 200, data: updatedTask as string };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { httpStatusCode: 500, errMessage: errMessage };
  }
};

export const doDeleteTask = async (
  taskId: string,
): Promise<ReturnType<string>> => {
  try {
    const deletedData = await deleteTask(taskId);
    if (!deletedData) {
      return {
        httpStatusCode: 500,
        errMessage: "Something went wrong, can't delete the task",
      };
    }
    if (deletedData instanceof Error && deletedData.message) {
      return { httpStatusCode: 500, errMessage: deletedData.message };
    }

    return { httpStatusCode: 200, data: deletedData };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { httpStatusCode: 500, errMessage: errMessage };
  }
};

export const doFilterTasks = async (
  filterData: FilterData,
): Promise<ReturnType<Task | null>> => {
  try {
    const filterResult = await filterTasks(filterData);
    if (!filterResult) {
      return {
        httpStatusCode: 500,
        errMessage: "Something went wrong while trying to filter the tasks",
      };
    }

    if(Array.isArray(filterResult) && !filterResult.length) {
      return {
        httpStatusCode: 200,
        dataArray: [],
      };
    }
    if (filterResult instanceof Error && filterResult.message) {
      return { httpStatusCode: 500, errMessage: filterResult.message };
    }
    return { httpStatusCode: 200, dataArray: filterResult as Array<Task> };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { httpStatusCode: 500, errMessage: errMessage };
  }
};

export const doGetMinandMaxDate = async (): Promise<ReturnType<MinMaxDate>> => {
  try {
    const dates = await getMinMaxDate();
    if (!dates) {
      return {
        httpStatusCode: 500,
        errMessage: "Something went wrong while trying to get he min,max date",
      };
    }
    if (dates instanceof Error && dates.message) {
      return { httpStatusCode: 500, errMessage: dates.message };
    }

    return { httpStatusCode: 200, data: dates };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { httpStatusCode: 500, errMessage: errMessage };
  }
};

export const doUpdateTaskStatus = async (
  updateData: StatusUpdate,
): Promise<ReturnType<string>> => {
  try {
    if (!updateData.status || !updateData.taskId || !updateData.userEmail) {
      return {
        httpStatusCode: 400,
        errMessage: "Didn't get the data from the client",
      };
    }
    const updatedStatus = await updateStatus(updateData);
    if (!updatedStatus) {
      return {
        httpStatusCode: 500,
        errMessage:
          "Something went wrong while trying to update the task status",
      };
    }
    //sendEmail(updatedStatus as string, updateData.userEmail);
    return { httpStatusCode: 200, data: updatedStatus as string };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { httpStatusCode: 500, errMessage: errMessage };
  }
};

export const doGetPercentageOfFinishedTasks = async (
  userId: string,
  selectedBoardId: string,
): Promise<ReturnType<Number>> => {
  try {
    const allTasksNumber = await getNumberOfTasksByUser(
      userId,
      selectedBoardId,
    );
    if (!allTasksNumber) {
      return {
        httpStatusCode: 500,
        errMessage: "Couldn't get the number of tasks",
      };
    }

    const numberOfFinishedTasks = await getNumberOfFinishedTasksByUser(
      userId,
      selectedBoardId,
    );
    if (!numberOfFinishedTasks) {
      return {
        httpStatusCode: 500,
        errMessage: "Couldn't get the number of tasks",
      };
    }
    if (numberOfFinishedTasks === "0" || allTasksNumber === "0") {
      return {
        httpStatusCode: 200,
        data: 1,
      };
    }

    return {
      httpStatusCode: 200,
      data: (numberOfFinishedTasks / allTasksNumber) * 100,
    };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { httpStatusCode: 500, errMessage: errMessage };
  }
};

export const checkIfDueDateComing = async () => {
  try {
    const allTasksDates = await getAllTaskDueDates();

    if (!allTasksDates) {
      throw new Error("Couldn't get the task due dates, something went wrong");
    }
    allTasksDates.forEach((task) => {
      timeUntilDueDate(task.duedate, task.userid, task.title);
    });
  } catch (err) {
    const msg = handleErrors(err);
  }
};

//Schedule the dueDate check every work day at 12 pm
cron.schedule("0 12 * * 1-5", checkIfDueDateComing);
