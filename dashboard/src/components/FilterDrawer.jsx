import { X } from "lucide-react";
import Filters from "./Filters";

export default function FilterDrawer({ isOpen, onClose, filters, setFilters, options }) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Background overlay */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`
          absolute top-0 right-0 h-full w-[480px] bg-white shadow-xl p-6 
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X />
          </button>
        </div>

        {/* Filter components */}
        <div className="overflow-y-auto max-h-[calc(100vh-80px)] pr-2">
          <Filters filters={filters} setFilters={setFilters} options={options} />
        </div>
      </div>
    </div>
  );
}
