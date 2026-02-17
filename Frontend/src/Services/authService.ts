import axios, { AxiosError } from "axios";
import { User, LoginDto, ReturnData, CurrentUser } from "../types/types";
import { handleErrors } from "../helpers/errorHandleHelper";

const BASE_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const doRegister = async (user: User): Promise<ReturnData<string>> => {
  const returnData = {
    data: "",
    errMessage: "",
  };
  try {
    const res = await axios.post(`${BASE_URL}/register`, user);
    if (!res || !res.data) {
      throw new Error("Register failed data undefined or missing");
    }
    returnData.data = res.data;
    return returnData;
  } catch (err: any) {
    if (err instanceof AxiosError && err.response) {
      returnData.errMessage = err.response.data;
      return returnData;
    }
    returnData.errMessage = err.message;
    return returnData;
  }
};

export const doLogin = async (
  user: LoginDto,
): Promise<ReturnData<CurrentUser | null>> => {
  const returnData = {
    data: null,
    errMessage: "",
  };
  try {
    const res = await axios.post(`${BASE_URL}/login`, user, {
      withCredentials: true,
    });
    if (!res || !res.data) {
      throw new Error("Login failed, data was undefined or misiing");
    }
    returnData.data = res.data;
    return returnData;
  } catch (err: any) {
    if (err instanceof AxiosError && err.response) {
      returnData.errMessage = err.response.data;
      return returnData;
    }
    returnData.errMessage = err.message;
    return returnData;
  }
};

export const doLogOut = async (): Promise<ReturnData<String>> => {
  const returnData = {
    data: "",
    errMessage: "",
  };
  try {
    const res = await axios.post(
      `${BASE_URL}/logout`,
      {},
      {
        withCredentials: true,
      },
    );
    if (!res || !res.data) {
      throw new Error("Data is undefined or missing");
    }
    returnData.data = res.data;
    return returnData;
  } catch (err: any) {
    if (err instanceof AxiosError && err.response) {
      returnData.errMessage = err.response.data;
      return returnData;
    }
    returnData.errMessage = err.message;
    return returnData;
  }
};

export const doSendResetMail = async (
  email: string,
): Promise<ReturnData<String>> => {
  try {
    const res = await axios.post(
      `${BASE_URL}/reset`,
      { email },
      {
        withCredentials: true,
      },
    );
    if (!res || !res.data) {
      throw new Error("Data is undefined or missing");
    }

    return { data: res.data };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { errMessage: errMessage };
  }
};

export const doResetPassword = async (resetData: LoginDto) => {
  try {
    const res = await axios.post(`${BASE_URL}/new-password`, resetData, {
      withCredentials: true,
    });
    if (!res || !res.data) {
      throw new Error("Data is undefined or missing");
    }

    return { data: res.data };
  } catch (err: any) {
    const errMessage = handleErrors(err);
    return { errMessage: errMessage };
  }
};
