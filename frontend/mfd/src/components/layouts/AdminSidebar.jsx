// import React from "react";
// import Sidebar from "../admin/Sidebar";

// const AdminLayout = ({ children }) => {
//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 shadow-md">
//         <Sidebar />
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 p-6 overflow-auto">
//         {children}
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;
import React, { useState } from "react";
import Sidebar from "../admin/Sidebar";
import { FiMenu } from "react-icons/fi"; // Hamburger menu icon

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Top Bar for Small Screens */}
      <div className="flex items-center justify-between bg-gray-800 p-4 text-white md:hidden">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        <button
          className="focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FiMenu className="text-2xl" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white md:block ${isSidebarOpen ? "block" : "hidden"} w-64 fixed md:relative z-40 h-full transition-all duration-300 ease-in-out`}
      >
        <Sidebar />
      </aside>

      {/* Overlay when sidebar is open on small screens */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
        ></div>
      )}

      {/* Main content */}
      <main className="flex-1 p-4 md:ml-64">{children}</main>
    </div>
  );
};

export default AdminLayout;
