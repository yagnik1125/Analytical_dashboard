// src/layouts/DashboardLayout.jsx
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FilterDrawer from "../components/FilterDrawer";
import { useState } from "react";

export default function DashboardLayout({ children ,filters, setFilters, options }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* Navbar with filter button */}
        <Navbar onOpenFilters={() => setIsFilterOpen(true)} onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Page Content */}
        <main className="p-4 md:p-6 min-h-screen">
          {children}
        </main>
      </div>

      {/* Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        options={options}
      />
    </div>
  );
}
