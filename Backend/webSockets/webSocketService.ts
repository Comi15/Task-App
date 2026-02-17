import { getTaskById, updateTask } from "../database/tasksRepo";
import { handleErrors } from "../Helpers/errorHandleHelper";
import { getJwtFromCookies, verifyTokenWS } from "../Helpers/webSocketHelper";
//import { sendEmail } from "../Services/emailService";
import { Task } from "../types/types";

export const updateTaskRealTime = async (socket: any, updateData: Task) => {
  try {
    const token = getJwtFromCookies(socket);
    if (!token) {
      socket.emit("updateError", "Access Denied");
      return;
    }

    if (!verifyTokenWS(token)) {
      socket.emit("updateError", "Invalid Token");
      return;
    }

    const currentTask: Task = await getTaskById(updateData.id);
    if (!currentTask) {
      socket.emit(
        "updateError",
        "An error occured, task with the given id doesn't exits"
      );
      return;
    }

    if (
      currentTask.title === updateData.title &&
      currentTask.description === updateData.description &&
      currentTask.duedate === updateData.duedate &&
      currentTask.status === updateData.status &&
      currentTask.priority === updateData.priority
    ) {
      socket.emit("updateError", "You haven't changed any task details");
      return;
    }

    const updatedTask = await updateTask(updateData);
    if (!updatedTask) {
      socket.emit("updateError", "Couldn't update the task");
      return;
    }

    socket.emit("updateSuccess", updatedTask as string);
    const emailMsg = `${updatedTask} has been updated`;
    //sendEmail(emailMsg, updateData.userEmail as string);
  } catch (err: any) {
    const errMessage = handleErrors(err);
    socket.emit("updateError", errMessage);
  }
};


