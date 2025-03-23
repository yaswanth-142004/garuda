import React from "react";
import Topbar from "@/components/Topbar";
import { Outlet } from "react-router-dom";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

const words = [
  {
    text: "L e t s ",
    className: "text-blue-500 dark:text-pink-500 text-5xl",
  },
  {
    text: "  B u i l d . . .",
    className: "text-yellow-200 dark:text-yellow-500 text-5xl",
  },
];

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Fixed Topbar */}
      <div className="sticky top-0 left-0 w-full z-50 shadow-md ">
        <Topbar />
      </div>

      {/* Scrollable Content */}
      <div className=" ml-[40%] mt-[22%]">
        <TypewriterEffectSmooth words={words} />
      </div>
    </div>
  );
};

export default Dashboard;
