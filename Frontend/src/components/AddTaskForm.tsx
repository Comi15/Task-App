import "../styles/addTaskForm.css";
import { cancelIcon } from "./Icons";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { doCreateTask } from "../Services/taskService";
import { Priority, Status } from "../types/types";
import { authContext } from "../contexts/authContextProvider";

type FormProps = {
  setTaskButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setNewTaskAdded:React.Dispatch<React.SetStateAction<boolean>>;
  newTaskAdded:boolean;
  taskBoardSelected:string
};
const AddTaskForm = ({ newTaskAdded,setTaskButtonClicked,setNewTaskAdded,taskBoardSelected }: FormProps) => {
  const { currentUser } = useContext(authContext);
  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    description: "",
    priority: Priority.High,
    dueDate: "",
    status: Status.ToDo,
    boardId:''
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Not logged in");
      return;
    }
    formData.userId = currentUser.id;
    formData.boardId = taskBoardSelected; 
    const { data, errMessage } = await doCreateTask(formData);
    if (!data) {
      toast.error("Something went wrong, can't add the task");
      return;
    }
    if (errMessage) {
      toast.error(errMessage);
      return
    }
    toast.success("You have created a new task!");
    setTaskButtonClicked(false);
    setNewTaskAdded(!newTaskAdded);
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="add-task-form">
        <div className="svg-div">
          <div
            onClick={() => setTaskButtonClicked(false)}
            className="cancel-icon-div"
          >
            {cancelIcon}
          </div>
        </div>
        <h3>New Task</h3>
        <label>Title</label>
        <input
          onChange={handleChange}
          type="text"
          name="title"
          required
          placeholder="Task 1"
        />
        <label>Description</label>
        <textarea
          onChange={handleChange}
          placeholder="...description"
          name="description"
          id="description"
        ></textarea>
        <label>Priority</label>
        <select onChange={handleChange} name="priority" id="priority">
          <option value={Priority.High}>High</option>
          <option value={Priority.Medium}>Medium</option>
          <option value={Priority.Low}>Low</option>
        </select>
        <div className="date-picker-div">
          <label>Due Date</label>
          <input
            onChange={handleChange}
            required
            type="date"
            name="dueDate"
            id="date"
          />
        </div>
        <label>Status</label>
        <select onChange={handleChange} name="status" id="status">
          <option value={Status.ToDo}>To Do</option>
          <option value={Status.InProgress}>In Progress</option>
          <option value={Status.QA}>QA</option>
          <option value={Status.Done}>Done</option>
        </select>
        <button type="submit">Add Task</button>
      </form>
    </>
  );
};

export default AddTaskForm;
