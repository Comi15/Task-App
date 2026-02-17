import { useEffect, useState } from "react";
import "../styles/taskBoards.css";
import ToolTip from "./Tooltip";
import { doGetTaskBoardsByUserId } from "../Services/taskBoardService";
import toast from "react-hot-toast";
import { TaskBoard } from "../types/types";

type TaskBoardsProps = {
  userId: string;
  taskBoardSelected: string;
  setSelectedBoard: React.Dispatch<React.SetStateAction<string>>;
  taskBoardAdded: boolean;
  handleAddBoardClick: () => void;
  updateCurrentTaskBoardName: (name: string) => void;
};
const TaskBoards = ({
  userId,
  taskBoardSelected,
  setSelectedBoard,
  taskBoardAdded,
  handleAddBoardClick,
  updateCurrentTaskBoardName,
}: TaskBoardsProps) => {
  const [taskBoards, setTaskBoards] = useState(new Array());

  useEffect(() => {
    const fetchTaskBoards = async () => {
      const data = await doGetTaskBoardsByUserId(userId);
      if (!data || !data.dataArray) {
        toast.error("Couldn't load the tasks");
        return;
      }
      if (data.errMessage) {
        toast.error(data.errMessage);
        return;
      }
      if (!sessionStorage["selectedTaskBoard"]) {
        setSelectedBoard(
          data.dataArray[data.dataArray.length - 1].id as string,
        );
        updateCurrentTaskBoardName(
          data.dataArray[data.dataArray.length - 1].name,
        );
      }
      setTaskBoards(data.dataArray as Array<TaskBoard>);
    };
    fetchTaskBoards();
  }, [taskBoardAdded]);
  return (
    <div className="taskboards-container">
      <label>
        <h3>Task Boards</h3>
      </label>
      <div className="taskboards-icon-select">
        <select
          value={taskBoardSelected}
          onChange={(e) => {
            setSelectedBoard(e.target.value);
            const index = e.target.selectedIndex;
            const optionElement = e.target.options[index];
            updateCurrentTaskBoardName(optionElement.text);
          }}
          name="task-boards-select"
          id="task-boards-select"
        >
          {taskBoards.map((taskBoard, index) => (
            <option key={index} value={taskBoard.id}>
              {taskBoard.name}
            </option>
          ))}
        </select>
        <ToolTip infoText="Create a new task board" right="1000" bottom="100">
          <i onClick={handleAddBoardClick} className="fa-solid fa-plus"></i>
        </ToolTip>
      </div>
    </div>
  );
};

export default TaskBoards;
