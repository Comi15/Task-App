import { useState } from "react";
import "../styles/tooltip.css";

type ToolTipProps = {
  infoText: string;
  children: React.ReactNode;
  bottom?:string;
  right?:string;
};
const ToolTip = ({ infoText, children,bottom,right }: ToolTipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="tooltip-container"
    >
      {children}
      <div style={{bottom:`${bottom}px`,right:`${right}px`}} className={`tooltip ${showTooltip ? "active" : ""}`}>{infoText}</div>
    </div>
  );
};

export default ToolTip;
