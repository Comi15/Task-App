import { doFilterTasks, doGetMinMaxDate } from "../Services/taskService";
import "../styles/filter.css";
import { FilterData, TaskReturn } from "../types/types";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PriorityToggle from "./PriorityToggle";

type FilterProps = {
  setTasksArray: React.Dispatch<React.SetStateAction<Array<TaskReturn>>>;
  arrayCopy: Array<TaskReturn>;
  filterData: FilterData;
  setFilterData: React.Dispatch<React.SetStateAction<FilterData>>;
};
const Filter = ({
  setTasksArray,
  arrayCopy,
  filterData,
  setFilterData,
}: FilterProps) => {
  const [selectedPriorites, setSelectedPriorities] = useState(Array<string>);
  const [filterCleared, setFilterCleared] = useState<boolean>(true);

  useEffect(() => {
    const getMinMaxDate = async () => {
      if (filterCleared) {
        const { data, errMessage } = await doGetMinMaxDate();
        if (!data && !errMessage) {
          toast.error("Couldn't fetch min and max date");
          return;
        }
        if (errMessage) {
          toast.error(errMessage);
        }
        setFilterData((prev) => ({
          ...prev,
          startDate: data?.mindate,
          endDate: data?.maxdate,
        }));
      }
    };
    getMinMaxDate();
  }, [arrayCopy, filterCleared]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFilterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const { dataArray, errMessage } = await doFilterTasks(
      filterData as FilterData,
    );

    if (!dataArray && !errMessage) {
      toast.error("Oops something went wrong while trying to filter the data");
      return;
    }
    if (Array.isArray(dataArray) && !dataArray.length) {
      toast.error("No tasks match the filter", {
        position: "bottom-left",
      });
      setTasksArray([]);
      return;
    }
    if (errMessage) {
      toast.error(errMessage, {
        position: "bottom-left",
      });
      return;
    }
    setTasksArray(dataArray as Array<TaskReturn>);
    setFilterCleared(false);
    toast.success("Successfulyy filtered the data", {
      position: "bottom-left",
    });
  };

  const handleClearFilterClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setTasksArray(arrayCopy);
    setSelectedPriorities([]);
    setFilterData((prev) => ({ ...prev, priorities: [], searchQuery: "" }));
    setFilterCleared(true);
    toast.success("All filters cleared.", {
      position: "bottom-left",
    });
  };

  return (
    <div className="filter-container">
      <h2>Filters</h2>
      <div className="filter-priority-container">
        <h3>Priority</h3>
        <PriorityToggle
          setFilterData={setFilterData}
          selectedPriorites={selectedPriorites}
          setSelectedPriorities={setSelectedPriorities}
        />
        <h3>Due Date</h3>
        <div className="date-filter-container">
          <input
            onChange={handleChange}
            type="date"
            name="startDate"
            value={filterData?.startDate}
          />
          <input
            onChange={handleChange}
            type="date"
            name="endDate"
            value={filterData?.endDate}
          />
        </div>
        <button onClick={handleFilterClick} id="apply-filter-btn">
          Apply filters
        </button>
        <button onClick={handleClearFilterClick} id="clear-filters-btn">
          Clear filters
        </button>
      </div>
    </div>
  );
};

export default Filter;
