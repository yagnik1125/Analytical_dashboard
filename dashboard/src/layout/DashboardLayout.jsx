// src/layouts/DashboardLayout.jsx
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FilterDrawer from "../components/FilterDrawer";
import { useState } from "react";

export default function DashboardLayout({ children ,filters, setFilters, options }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  return (
    <div className="w-full h-screen flex overflow-hidden bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* Navbar with filter button */}
        <Navbar onOpenFilters={() => setIsFilterOpen(true)} />

        {/* Page Content */}
        <main className="p-6 min-h-[calc(100vh-64px)]">
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
