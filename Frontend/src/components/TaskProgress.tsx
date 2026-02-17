import ProgressBar from "@ramonak/react-progress-bar";
import "../styles/taskProgress.css";
import { doGetPrecentageOfTasksDone } from "../Services/taskService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TaskReturn } from "../types/types";

type TaskProgressProps = {
  userId: string;
  arrayCopy: Array<TaskReturn>;
  selectedBoardID:string;
};
const TaskProgress = ({ userId, arrayCopy,selectedBoardID }: TaskProgressProps) => {
  const [percentageOfTasksDone, setPercentageOfTasksDone] = useState(0);
  useEffect(() => {
    const getPercentageOfTasksDone = async (userId: string,selectedBoardID:string) => {
      const percentageOfTasksDone = await doGetPrecentageOfTasksDone(userId,selectedBoardID);
      if (!percentageOfTasksDone) {
        toast.error("Couldn't get the percentage of tasks done");
        return;
      }
      if (percentageOfTasksDone.errMessage) {
        toast.error(percentageOfTasksDone.errMessage);
        return;
      }
      if(percentageOfTasksDone.data === 1){
        setPercentageOfTasksDone(0);
        return;
      }
      setPercentageOfTasksDone(Math.round(percentageOfTasksDone.data));
    };
    getPercentageOfTasksDone(userId,selectedBoardID);
  }, [arrayCopy,selectedBoardID]);
  return (
    <div className="task-progress-container">
      <h3>Tasks Done</h3>
      <ProgressBar
        width="200px"
        completed={percentageOfTasksDone}
        maxCompleted={100}
      />
    </div>
  );
};

export default TaskProgress;
