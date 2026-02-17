import { AxiosError } from "axios";


export const handleErrors = (err: any): string => {
  if (!err) {
    return "Ooops something went wrong.";
  }

  if (err.code === "ECONNRESET") {
    return "Connection reset...Please wait";
  }

  if (err instanceof AxiosError && err.response && err.response.data) {
    return err.response.data;
  }

  if (!err.message) {
    return "Ooops something went wrong.";
  }

  return err.message;
};
