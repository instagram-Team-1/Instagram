import React, { useState } from "react";
import Msgs from "@/app/Home/actualRoom/component/msgs";
import Request from "@/app/Home/actualRoom/component/req";

type ActivePanelType = "none" | "search" | "messages" | "notifications";

interface MasegeButtonPanelProps {
  activePanel: ActivePanelType;
}

function MesageButtonPanel({ activePanel }: MasegeButtonPanelProps) {
  const [status, setStatus] = useState("messages");
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className={`fixed top-0 left-0 h-screen ml-[75px] bg-white dark:bg-black border-r border-gray-200 dark:border-zinc-800 p-4 transition-all duration-400 ease-in-out ${
          activePanel === "messages" ? "w-[400px] max-h-[600px]" : "w-[0px] max-h-0"
        } overflow-hidden`}
        style={{ minWidth: activePanel === "messages" ? "400px" : "0px" }}
      >
        <div className="h-[160px] w-full p-5 border-b-[1px] flex justify-between items-center">
         
          
          <Msgs />
        </div>
        <div
          className={`transition-all duration-300 ${
            expanded ? "max-h-[400px]" : "max-h-0"
          } overflow-hidden`}
        >
      
        </div>
      </div>
    </div>
  );
}

export default MesageButtonPanel;
