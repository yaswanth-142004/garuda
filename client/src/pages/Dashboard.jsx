import React from "react";
import Topbar from "@/components/Topbar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Topbar */}
      <div className="sticky top-0 left-0 w-full z-50 shadow-md">
        <Topbar />
      </div>

      {/* Scrollable Content */}
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
