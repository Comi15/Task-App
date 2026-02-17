import "../styles/ToggleButton.css";
import { FilterData, Priority } from "../types/types";

const priorities = [Priority.High, Priority.Medium, Priority.Low];

type PriorityToggleProps = {
  selectedPriorites: Array<string>;
  setSelectedPriorities: React.Dispatch<React.SetStateAction<Array<string>>>;
  setFilterData: React.Dispatch<React.SetStateAction<FilterData>>;
};

const PriorityToggle = ({
  selectedPriorites,
  setSelectedPriorities,
  setFilterData,
}: PriorityToggleProps) => {
  const toggle = (value: string) => {
    setSelectedPriorities((prev) => {
      const newPriorities = prev.includes(value)
        ? prev.filter((v: string) => v !== value)
        : [...prev, value];
      setFilterData((prev) => ({ ...prev, priorities: newPriorities }));
      return newPriorities;
    });
  };

  return (
    <div className="toggle-group">
      {priorities.map((p) => (
        <button
          key={p}
          className={`toggle-btn ${selectedPriorites.includes(p) ? "active" : ""}`}
          onClick={() => toggle(p)}
        >
          {p.charAt(0).toUpperCase() + p.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default PriorityToggle;
