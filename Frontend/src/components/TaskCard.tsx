import { TaskReturn } from "../types/types";
import "../styles/taskCard.css";
import { editIcon } from "./Icons";
import ToolTip from "./Tooltip";

type TaskCardProps = {
  task: TaskReturn;
  handleEditButtonClicked: (task: TaskReturn) => void;
  handleOnDrag:(e:React.DragEvent, taskId:string) => void;
};

const TaskCard = ({ task, handleEditButtonClicked,handleOnDrag }: TaskCardProps) => {
  const { id,title } = task;
  return (
    <div
      draggable
      onDragStart = {(e) => handleOnDrag(e,id)}
      onClick={() => {
        handleEditButtonClicked(task);
      }}
      className="task-card-container"
    >
      <div className="tittle-container">
        <p>{title}</p>
      </div>
      <ToolTip infoText="Edit task">
        <button onClick={() => handleEditButtonClicked(task)} id="edit-btn">
          {editIcon}
        </button>
      </ToolTip>
    </div>
  );
};

export default TaskCard;
