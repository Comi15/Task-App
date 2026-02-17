import { useState } from "react";
import toast from "react-hot-toast";
import { doAddNewTaskBoard } from "../Services/taskBoardService";
import "../styles/addTaskBoardForm.css";

type AddTaskBoardFormProps = {
  userId: string;
  taskBoardAdded: boolean;
  setTaskBoardAdded: React.Dispatch<React.SetStateAction<boolean>>;
  setAddTaskBoardClicked: React.Dispatch<React.SetStateAction<boolean>>;
};
const AddTaskBoardForm = ({
  userId,
  setTaskBoardAdded,
  taskBoardAdded,
  setAddTaskBoardClicked,
}: AddTaskBoardFormProps) => {
  const [boardName, setBoardName] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, errMessage } = await doAddNewTaskBoard({
      userId,
      name: boardName,
    });
    if (!data && !errMessage) {
      toast.error("Something went wrong, can't add the task board");
      return;
    }
    if (errMessage) {
      toast.error(errMessage, {
        position: "bottom-left",
      });
      return;
    }
    onSuccess(data as string);
    
  };

  const onSuccess = (data:string) => {
    setTaskBoardAdded(!taskBoardAdded);
    setAddTaskBoardClicked(false);
    toast.success(data, {
      position: "bottom-left",
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="taskboard-form">
        <input
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          type="text"
          placeholder="Board name"
          required
        />
        <button type="submit">Add board</button>
      </form>
    </>
  );
};

export default AddTaskBoardForm;
