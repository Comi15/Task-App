import { Priority, Status, TaskReturn, TaskUpdate } from "../types/types";
import "../styles/taskDetails.css";
import { cancelIcon } from "./Icons";
import { useState, useEffect } from "react";
import { doDeleteTask } from "../Services/taskService";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/WebSocketTypes";

type TaskDetailsProps = {
  task: TaskReturn;
  setEditButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setTaskUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  taskUpdated: boolean;
  userEmail: string;
};

const TaskDetails = ({
  taskUpdated,
  setTaskUpdated,
  task,
  setEditButtonClicked,
  userEmail,
}: TaskDetailsProps) => {
  const [socket, setSocket] =
    useState<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const { id, title, description, priority, status, duedate } = task;
  const [saveChangesDisabled, setSaveChangesDisabled] = useState(true);
  const [editData, setEditData] = useState<TaskUpdate>({
    id: id,
    title: title,
    description: description,
    priority: priority,
    status: status,
    duedate: duedate as string,
    userEmail: userEmail,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setSaveChangesDisabled(false);

    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const socket = io("https://taskappv1.webi.rs", {
      withCredentials: true,
    });
    setSocket(socket);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!socket) {
      toast.error("Couldn't establish a connection with the WS server");
      return;
    }

    socket.emit("updateData", editData);

    socket.on("updateError", (errorMsg) => {
      toast.error(errorMsg);
    });

    socket.on("updateSuccess", (successMsg) => {
      handleSuccess();
      toast.success(`Task ${successMsg as string} has been updated`);

      return () => {
        socket.off('updateSuccess');
        socket.off("updateError");
      }
    });
  };
  const handleDeleteTask = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const { data, errMessage } = await doDeleteTask(id);
    if (!data && !errMessage) {
      toast.error(
        "Didn't get a response from the server, could not update the task"
      );
      return;
    }
    if (errMessage) {
      toast.error(errMessage);
      return;
    }

    handleSuccess();
    toast.success(`${data}`);
  };

  const handleSuccess = () => {
    setEditButtonClicked(false);
    setTaskUpdated(!taskUpdated);
  };

  return (
    <form onSubmit={handleSubmit} className="task-details-container">
      <div className="details-header-container">
        <div className="details-title-container">
          <input
            value={editData.title}
            onChange={handleChange}
            type="text"
            name="title"
            required
          />
        </div>
        <div
          onClick={() => setEditButtonClicked(false)}
          className="cancel-icon-div"
        >
          {cancelIcon}
        </div>
      </div>
      <label>Description</label>
      <textarea
        value={editData.description}
        onChange={handleChange}
        name="description"
        id="description-details"
      ></textarea>
      <label>Priority</label>
      <div className="details-priority-container">
        <select
          value={editData.priority}
          onChange={handleChange}
          name="priority"
          id="priority"
          required
        >
          <option value={Priority.High}>High</option>
          <option value={Priority.Medium}>Medium</option>
          <option value={Priority.Low}>Low</option>
        </select>
      </div>
      <label>Status</label>
      <div className="details-status-container">
        <select
          value={editData.status}
          onChange={handleChange}
          name="status"
          id="status"
          required
        >
          <option value={Status.ToDo}>To Do</option>
          <option value={Status.InProgress}>In Progress</option>
          <option value={Status.QA}>QA</option>
          <option value={Status.Done}>Done</option>
        </select>
      </div>
      <label>Due Date:</label>
      <div className="details-date-container">
        <input
          value={editData.duedate}
          onChange={handleChange}
          required
          type="date"
          name="duedate"
          id="date"
        />
      </div>
      <div className="save-ch-btn-del-btn-container">
        <button
          className="save-ch-btn"
          disabled={saveChangesDisabled ? true : false}
          type="submit"
        >
          {saveChangesDisabled ? "No Changes" : "Save changes"}
        </button>
        <button onClick={handleDeleteTask} className="del-btn">
          Delete Task
        </button>
      </div>
    </form>
  );
};

export default TaskDetails;
