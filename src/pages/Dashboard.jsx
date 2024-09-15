import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import { useUser } from "../contexts/User";

export default function Dashboard() {
  const { theme, toggleTheme } = useUser();

  return (
    <div className="flex h-screen">
      <section className={`w-[10%] sm:w-[15%] ${theme === "green" ? 'bg-gradient-to-b from-green-700 via-green-500 to-green-300' : 'bg-gradient-to-b from-yellow-700 via-yellow-500 to-yellow-300'} transition-all duration-500`}>
        <Sidebar theme={theme} toggleTheme={toggleTheme} />
      </section>
      <div className={`flex-1 p-4 ${theme === "green" ? 'bg-gradient-to-b from-green-100 via-green-50 to-white' : 'bg-gradient-to-b from-yellow-100 via-yellow-50 to-white'} overflow-auto`}>
        <Outlet />
      </div>
    </div>
  );
}
