import { SlidersHorizontal, Menu } from "lucide-react";

export default function Navbar({ onOpenFilters, onOpenSidebar }) {
  return (
    <header className="h-16 bg-white shadow flex justify-between items-center px-4 md:px-6 border-b">

      {/* Mobile Sidebar Button */}
      <button 
        className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition"
        onClick={onOpenSidebar}
      >
        <Menu size={22} />
      </button>

      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

      {/* Filters Button */}
      <button
        onClick={onOpenFilters}
        className="flex items-center gap-2 px-4 py-2 
        bg-blue-600 text-white rounded-xl font-medium shadow-md
        hover:bg-blue-700 active:scale-95 transition-all duration-200"
      >
        <SlidersHorizontal size={18} />
        Filters
      </button>
    </header>
  );
}
