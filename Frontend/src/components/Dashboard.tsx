import NavBar from "./NavBar";
import "../styles/dashboard.css";
import { useContext, useState, useEffect } from "react";
import AddTaskForm from "./AddTaskForm";
import PopUp from "./PopUp";
import { FilterData, Status, TaskReturn } from "../types/types";
import TaskCard from "./TaskCard";
import {
  doGetTasksByUserId,
  doUpdateTaskStatus,
} from "../Services/taskService";
import { authContext } from "../contexts/authContextProvider";
import toast from "react-hot-toast";
import TaskDetails from "./TaskDetails";
import Search from "./Search";
import Filter from "./FIlter";
import TaskProgress from "./TaskProgress";
import CalendarView from "./CalendarVIew";
import TaskBoards from "./TaskBoards";
import AddTaskBoardForm from "./AddTaskBoardForm";

const Dashboard = () => {
  const { currentUser, logOut } = useContext(authContext);

  //states for task boards
  const [taskBoardSelected, setTaskBoardSelected] = useState(() => {
    return sessionStorage.getItem("selectedTaskBoard") || "";
  });
  const [taskBoardAdded, setTaskBoardAdded] = useState(false);
  const [addTaskBoardClicked, setAddTaskBoardClicked] = useState(false);
  const [currentTaskBoardName, setCurrentTaskBoardName] = useState(() => {
    return sessionStorage.getItem("selectedTaskBoardName") || "";
  });

  const [view, setView] = useState("board");
  //state for opening a pop up
  const [taskButtonClicked, setTaskButtonClicked] = useState(false);
  const [editButtonClicked, setEditButtonClicked] = useState(false);

  //states for fetching the data
  const [tasksArray, setTasksArray] = useState<Array<TaskReturn>>(new Array());
  const [tasksArrayCopy, setTasksArrayCopy] = useState<Array<TaskReturn>>(
    new Array(),
  );
  const [isLoading, setIsLoading] = useState(true);

  //States to fetch the data again on add and update
  const [newTaskAdded, setNewTaskAdded] = useState(false);
  const [taskUpdated, setTaskUpdated] = useState(false);

  //state for the update data
  const [taskToBeEdited, setTaskToBeEdited] = useState<TaskReturn | null>(null);

  //filter data
  const [filterData, setFilterData] = useState<FilterData>({
    startDate: "",
    endDate: "",
    userId: currentUser?.id as string,
    taskBoardId: taskBoardSelected,
    searchQuery: "",
    priorities: [],
  });


  useEffect(() => {
    sessionStorage.setItem("selectedTaskBoard", taskBoardSelected);
    sessionStorage.setItem("selectedTaskBoardName", currentTaskBoardName);
    const fetchTasks = async () => {
      setFilterData((prev) => ({ ...prev, taskBoardId: taskBoardSelected }));
      if (!currentUser) {
        toast.error("User not logged in");
        return;
      }
      const data = await doGetTasksByUserId(currentUser.id, taskBoardSelected);
      if (!data) {
        toast.error("Couldn't load the tasks");
        return;
      }
      if (data.errMessage) {
        if (data.errMessage === "Token expired!") {
          toast.error(data.errMessage);
          logOut();
          return;
        }
        toast.error(data.errMessage);
        return;
      }

      setTasksArray(data.dataArray as TaskReturn[]);
      setTasksArrayCopy(data.dataArray as TaskReturn[]);
    };
    try {
      fetchTasks();
    } finally {
      //Da ne zabode na ucitavanju ako je Promise odbijen
      setIsLoading(false);
    }
  }, [newTaskAdded, taskUpdated, taskBoardSelected, taskBoardAdded]);

  const handleEditButtonClicked = (task: TaskReturn) => {
    setTaskToBeEdited(task);
    setEditButtonClicked(!editButtonClicked);
  };

  const handleOnDrag = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: Status) => {
    const taskId = e.dataTransfer.getData("taskId") as string;
    const userEmail = currentUser?.email as string;
    const updatedStatus = await doUpdateTaskStatus({
      taskId,
      status,
      userEmail,
    });
    if (!updatedStatus) {
      toast.error("Something went wrong couldn't update task status");
    }
    if (updatedStatus.errMessage) {
      toast.error(updatedStatus.errMessage);
    }

    toast.success(updatedStatus.data as string);
    setTaskUpdated(!taskUpdated);
  };

  const handleAddBoardClick = () => {
    setAddTaskBoardClicked(!addTaskBoardClicked);
  };
  const updateCurrentTaskBoardName = (name: string) => {
    setCurrentTaskBoardName(name);
  };
  return (
    <>
      <NavBar>
        <Search
          filterData={filterData}
          setFilterData={setFilterData}
          setTasksArray={setTasksArray}
        />
      </NavBar>
      <div className="dashboard-container">
        {taskButtonClicked && (
          <PopUp setPopUpButtonClicked={setTaskButtonClicked}>
            <AddTaskForm
              newTaskAdded={newTaskAdded}
              setNewTaskAdded={setNewTaskAdded}
              setTaskButtonClicked={setTaskButtonClicked}
              taskBoardSelected={taskBoardSelected}
            />
          </PopUp>
        )}

        {editButtonClicked && (
          <PopUp setPopUpButtonClicked={setEditButtonClicked}>
            <TaskDetails
              taskUpdated={taskUpdated}
              setTaskUpdated={setTaskUpdated}
              setEditButtonClicked={setEditButtonClicked}
              task={taskToBeEdited as TaskReturn}
              userEmail={currentUser?.email as string}
            />
          </PopUp>
        )}

        {!isLoading ? (
          <div className="filter-tasks-container">
            <section className="side-section">
              <Filter
                filterData={filterData}
                setFilterData={setFilterData}
                setTasksArray={setTasksArray}
                arrayCopy={tasksArrayCopy}
              />
              <TaskProgress
                arrayCopy={tasksArrayCopy}
                userId={currentUser?.id as string}
                selectedBoardID={taskBoardSelected}
              />
              <label>
                <h3>View</h3>
              </label>
              <select
                value={view}
                onChange={(e) => setView(e.target.value)}
                name="viewSelect"
                id="viewSelect"
              >
                <option value="board">Board</option>
                <option value="calendar">Calendar</option>
              </select>
              <TaskBoards
                updateCurrentTaskBoardName={updateCurrentTaskBoardName}
                handleAddBoardClick={handleAddBoardClick}
                taskBoardAdded={taskBoardAdded}
                taskBoardSelected={taskBoardSelected}
                setSelectedBoard={setTaskBoardSelected}
                userId={currentUser?.id as string}
              />
              {addTaskBoardClicked && (
                <AddTaskBoardForm
                  setAddTaskBoardClicked={setAddTaskBoardClicked}
                  userId={currentUser?.id as string}
                  setTaskBoardAdded={setTaskBoardAdded}
                  taskBoardAdded={taskBoardAdded}
                />
              )}
            </section>
            {view === "board" ? (
              <div className="all-tasks-container">
                <div className="tasks-header-nav">
                  <h2>{currentTaskBoardName}</h2>
                </div>

                {!taskButtonClicked && (
                  <button
                    onClick={() => setTaskButtonClicked(!taskButtonClicked)}
                    className="add-task-button"
                  >
                    Create New Task
                  </button>
                )}

                <div
                  onDrop={(e) => handleDrop(e, Status.ToDo)}
                  onDragOver={handleDragOver}
                  className="task-column"
                >
                  <h4>To Do</h4>
                  {tasksArray
                    .filter((task) => {
                      return task?.status === Status.ToDo;
                    })
                    .map((task, index) => (
                      <TaskCard
                        handleOnDrag={handleOnDrag}
                        handleEditButtonClicked={handleEditButtonClicked}
                        task={task}
                        key={index}
                      />
                    ))}
                </div>
                <div
                  onDrop={(e) => handleDrop(e, Status.InProgress)}
                  onDragOver={handleDragOver}
                  className="task-column"
                >
                  <h4>In Progress</h4>
                  {tasksArray
                    .filter((task) => {
                      return task.status === Status.InProgress;
                    })
                    .map((task, index) => (
                      <TaskCard
                        handleOnDrag={handleOnDrag}
                        handleEditButtonClicked={handleEditButtonClicked}
                        task={task}
                        key={index}
                      />
                    ))}
                </div>
                <div
                  onDrop={(e) => handleDrop(e, Status.QA)}
                  onDragOver={handleDragOver}
                  className="task-column"
                >
                  <h4>QA</h4>
                  {tasksArray
                    .filter((task) => {
                      return task.status === Status.QA;
                    })
                    .map((task, index) => (
                      <TaskCard
                        handleOnDrag={handleOnDrag}
                        handleEditButtonClicked={handleEditButtonClicked}
                        task={task}
                        key={index}
                      />
                    ))}
                </div>
                <div
                  onDrop={(e) => handleDrop(e, Status.Done)}
                  onDragOver={handleDragOver}
                  className="task-column"
                >
                  <h4>Done</h4>
                  {tasksArray
                    .filter((task) => {
                      return task.status === Status.Done;
                    })
                    .map((task, index) => (
                      <TaskCard
                        handleOnDrag={handleOnDrag}
                        handleEditButtonClicked={handleEditButtonClicked}
                        task={task}
                        key={index}
                      />
                    ))}
                </div>
              </div>
            ) : (
              <CalendarView arrayCopy={tasksArrayCopy} />
            )}
          </div>
        ) : (
          "loading..."
        )}
      </div>
    </>
  );
};

export default Dashboard;
