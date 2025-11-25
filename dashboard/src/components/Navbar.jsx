import React from "react";
import { SlidersHorizontal } from "lucide-react";

export default function Navbar({ onOpenFilters }) {
  return (
    <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6 py-2 border-b">
      <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>

      {/* Filters Button */}
      <button
        onClick={onOpenFilters}
        className="
          flex items-center gap-2 px-4 py-2 
          bg-blue-500 text-white 
          rounded-xl shadow-md 
          hover:bg-blue-600 hover:shadow-lg 
          active:scale-[0.97]
          transition-all duration-200
        "
      >
        <SlidersHorizontal size={18} />
        <span className="font-medium">Filters</span>
      </button>
    </div>
  );
}
