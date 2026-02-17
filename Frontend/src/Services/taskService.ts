import axios from "axios";
import {
  Task,
  ReturnData,
  TaskReturn,
  TaskUpdate,
  FilterData,
  MinMaxDate,
  StatusUpdate,
} from "../types/types";
import { handleErrors } from "../helpers/errorHandleHelper";

const BASE_URL = `${import.meta.env.VITE_API_URL}/tasks`;

export const doCreateTask = async (
  task: Task,
): Promise<ReturnData<TaskReturn>> => {
  try {
    const res = await axios.post(`${BASE_URL}/add`, task, {
      withCredentials: true,
    });
    if (!res || !res.data) {
      throw new Error("Something went wrong");
    }
    return { data: res.data as TaskReturn };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { errMessage: errMessage };
  }
};

export const doGetTasksByUserId = async (
  userId: string,
  taskBoardId: string,
): Promise<ReturnData<TaskReturn>> => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}`, {
      withCredentials: true,
      params: {
        taskBoardId: taskBoardId,
      },
    });
    if (!response || !response.data) {
      throw new Error("Somethin went wrong");
    }
    return { dataArray: response.data as Array<TaskReturn> };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    if (err.response.status == 401) {
      return { errMessage: "Token expired!" };
    }
    return { errMessage: errMessage };
  }
};

export const doUpdateTask = async (
  taskUpdateInfo: TaskUpdate,
): Promise<ReturnData<String>> => {
  try {
    const res = await axios.put(`${BASE_URL}/update`, taskUpdateInfo, {
      withCredentials: true,
    });
    if (!res || !res.data) {
      throw new Error(
        "Something went wrong while trying to update the task, couldn't get a response from the server",
      );
    }
    return { data: res.data };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { errMessage: errMessage };
  }
};

export const doDeleteTask = async (
  taskId: string,
): Promise<ReturnData<string>> => {
  try {
    const res = await axios.delete(`${BASE_URL}/${taskId}`, {
      withCredentials: true,
    });
    if (!res || !res.data) {
      throw new Error(
        "Something went wrong while trying to delete the task, couldn't get the data from the server",
      );
    }
    return { data: res.data };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { errMessage: errMessage };
  }
};

export const doFilterTasks = async (
  filterData: FilterData,
): Promise<ReturnData<TaskReturn>> => {
  try {
    const res = await axios.put(`${BASE_URL}/filter`, filterData, {
      withCredentials: true,
    });
    if (!res || !res.data) {
      throw new Error("Something went wrong while filtering the tasks");
    }
    return { dataArray: res.data };
  } catch (err: any) {
    if (err?.response.status === 401) {
      return { errMessage: "Token expired!" };
    }
    const errMessage = handleErrors(err);
    return { errMessage: errMessage };
  }
};

export const doGetMinMaxDate = async (): Promise<ReturnData<MinMaxDate>> => {
  try {
    const res = await axios.get(`${BASE_URL}/dates/date`, {
      withCredentials: true,
    });
    if (!res || !res.data) {
      throw new Error("Something went wrong fetching min and max date.");
    }
    return { data: res.data };
  } catch (err) {
    const errMessage = handleErrors(err);
    return { errMessage: errMessage };
  }
};

export const doUpdateTaskStatus = async (
  updateData: StatusUpdate,
): Promise<ReturnData<string>> => {
  try {
    const res = await axios.patch(`${BASE_URL}/update/status`, updateData, {
      withCredentials: true,
    });
    if (!res || !res.data) {
      throw new Error("Something went wrong while updating task status.");
    }
    return { data: res.data };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { errMessage: errMessage };
  }
};

export const doGetPrecentageOfTasksDone = async (
  userId: string,
  selectedBoardId: string,
) => {
  try {
    if (!selectedBoardId) {
      return { data: 1 };
    }
    const res = await axios.get(
      `${BASE_URL}/percentage/${userId}/${selectedBoardId}`,
      {
        withCredentials: true,
      },
    );
    if (!res || !res.data) {
      throw new Error(
        "Something went wrong fetching the percentage of tasks done.",
      );
    }
    return { data: res.data };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { errMessage: errMessage };
  }
};
