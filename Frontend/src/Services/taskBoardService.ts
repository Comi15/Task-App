import axios from "axios";
import { ReturnData, TaskBoard } from "../types/types";
import { handleErrors } from "../helpers/errorHandleHelper";

const BASE_URL = `${import.meta.env.VITE_API_URL}/taskBoard`;

export const doGetTaskBoardsByUserId = async (
  userId: string
): Promise<ReturnData<TaskBoard>> => {
  try {
    const response = await axios.get(`${BASE_URL}/get/${userId}`, {
      withCredentials: true,
    });
    if (!response || !response.data) {
      throw new Error("Something went wrong");
    }
    return { dataArray: response.data as Array<TaskBoard> };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { errMessage: errMessage };
  }
};

export const doAddNewTaskBoard = async (taskBoard: TaskBoard) => {
  try {
    const response = await axios.post(`${BASE_URL}/create`, taskBoard, {
      withCredentials: true,
    });
    if (!response || !response.data) {
      throw new Error("Something went wrong");
    }
    return { data: response.data as string };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { errMessage: errMessage };
  }
};
