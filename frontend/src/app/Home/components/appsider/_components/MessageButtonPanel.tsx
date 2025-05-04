import React from "react";
import { useState } from "react";
import Msgs from "@/app/actualRoom/component/msgs";
import Request from "@/app/actualRoom/component/req";
type ActivePanelType = "none" | "search" | "messages" | "notifications";

interface MasegeButtonPanelProps {
  activePanel: ActivePanelType;
}

function MesageButtonPanel({
  activePanel,
}: MasegeButtonPanelProps) {
  const [status, setStatus] = useState('')




  return (
    <div>
      <div
        className={`${activePanel === "messages"
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
          } transition-all duration-400 ease-in-out fixed top-0 left-0 h-screen ml-[75px] bg-white dark:bg-black border-r border-gray-200 dark:border-zinc-800 p-4`}
        style={{ minWidth: "400px" }}
      >
        <div className=' h-[100vh] w-full text-white '>
          <div className='w-full flex justify-between px-[20px]'>
            <p onClick={() => setStatus('msg')} className={`cursor-pointer ${status === 'msg' ? '' : 'text-white/50'}`}>Messages</p>
            <p onClick={() => setStatus('req')} className={`cursor-pointer ${status === 'req' ? '' : 'text-white/50'}`}>requests</p>
          </div>
          {status === 'msg' ?
            (<div><Msgs /></div>)
            : (<div><Request /></div>)
          }
        </div>
      </div>
    </div>
  );
}

export default MesageButtonPanel;