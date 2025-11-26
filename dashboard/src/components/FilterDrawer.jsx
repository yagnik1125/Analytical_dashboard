import { X } from "lucide-react";
import Filters from "./Filters";

export default function FilterDrawer({ isOpen, onClose, filters, setFilters, options }) {
  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300
      ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>

      {/* Background overlay */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 
        ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`
          absolute top-0 right-0 h-full 
          w-full sm:w-[420px] bg-white shadow-2xl 
          rounded-l-2xl p-6 border-l
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >

        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Filters</h2>

          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Filters Content */}
        <div className="overflow-y-auto h-[calc(100vh-120px)] pr-2">
          <Filters filters={filters} setFilters={setFilters} options={options} />
        </div>

        {/* Reset Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => setFilters({})}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
