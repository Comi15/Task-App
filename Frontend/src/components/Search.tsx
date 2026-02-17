import { searchIcon } from "./Icons";
import "../styles/search.css";
import ToolTip from "./Tooltip";
import { useState, useEffect } from "react";
import { FilterData, TaskReturn } from "../types/types";
import { doFilterTasks } from "../Services/taskService";
import toast from "react-hot-toast";
import useDebounce from "../hooks/useDebounce";
type SearchProps = {
  setTasksArray: React.Dispatch<React.SetStateAction<Array<TaskReturn>>>;
  filterData: FilterData;
  setFilterData: React.Dispatch<React.SetStateAction<FilterData>>;
};
const Search = ({
  setTasksArray,
  filterData,
  setFilterData,
}: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  useEffect(() => {
    setFilterData((prev) => ({ ...prev, searchQuery: debouncedQuery }));
    const searchTasks = async () => {
      const { dataArray, errMessage } = await doFilterTasks({
        ...filterData,
        searchQuery: debouncedQuery,
      });
      if (!dataArray && !errMessage) {
        toast.error("Something went wrong while searching");
        return;
      }
      if (errMessage) {
        toast.error(errMessage);
        setTasksArray([]);
        return;
      }
      //Everything went alright
      setTasksArray(dataArray as Array<TaskReturn>);
    };

    searchTasks();
  }, [debouncedQuery]);

  return (
    <div className="search-container">
      <input
        onChange={handleChange}
        value={searchQuery}
        type="text"
        placeholder="...Find tasks by name"
      />
      <div className="search-icon-div">
        <ToolTip bottom="5" right="-45" infoText="Search">
          {searchIcon}
        </ToolTip>
      </div>
    </div>
  );
};

export default Search;
