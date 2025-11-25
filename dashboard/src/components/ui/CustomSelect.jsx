import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({ label, value, list, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on click outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col max-w-[350px] w-full relative" ref={ref}>
      <span className="text-xs text-gray-500 mb-1">{label}</span>

      {/* BUTTON */}
      <button
        className="
          px-3 py-2 border rounded-lg bg-gray-50 hover:bg-gray-100
          text-gray-700 shadow-sm w-full text-left flex justify-between items-center
        "
        onClick={() => setOpen(!open)}
      >
        <span className="truncate w-[85%]">
          {value || `Select ${label}`}
        </span>
        <ChevronDown size={16} />
      </button>

      {/* DROPDOWN LIST */}
      {open && (
        <div
          className="
            absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg 
            max-h-60 overflow-y-auto z-30
          "
        >
          <div
            key="select-placeholder"
            onClick={() => {
              onChange("");   // Reset filter
              setOpen(false);
            }}
            className="
              px-3 py-2 bg-gray-50 hover:bg-gray-100 cursor-pointer
              text-sm font-medium text-gray-500
            "
          >
            Select {label}
          </div>
          {list?.map((item) => (
            <div
              key={item}
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
              className="
                px-3 py-2 hover:bg-blue-50 cursor-pointer 
                text-sm whitespace-normal break-words
              "
            >
              {item || "N/A"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
