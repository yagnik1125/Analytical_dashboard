// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import API from "../api/api";

// export default function Filters({ onChange }) {
//   const [options, setOptions] = useState({});
//   const [selected, setSelected] = useState({
//     topic: "",
//     sector: "",
//     region: "",
//     country: "",
//     pestle: "",
//     end_year: "",
//   });

//   useEffect(() => {
//     async function load() {
//       const res = await API.get("/records/filters");
//       setOptions(res.data);
//     }
//     load();
//   }, []);

//   const update = (key, value) => {
//     const updated = { ...selected, [key]: value };
//     setSelected(updated);
//     onChange(updated);
//   };

//   return (
//     <div style={{ display: "flex",justifyContent: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
      
//       <Select
//         placeholder="Topic"
//         options={options.topics?.map((t) => ({ label: t, value: t }))}
//         onChange={(e) => update("topic", e?.value || "")}
//         isClearable
//         styles={{ container: (b) => ({ ...b, width: 200 }) }}
//       />

//       <Select
//         placeholder="Sector"
//         options={options.sectors?.map((t) => ({ label: t, value: t }))}
//         onChange={(e) => update("sector", e?.value || "")}
//         isClearable
//         styles={{ container: (b) => ({ ...b, width: 200 }) }}
//       />

//       <Select
//         placeholder="Region"
//         options={options.regions?.map((t) => ({ label: t, value: t }))}
//         onChange={(e) => update("region", e?.value || "")}
//         isClearable
//         styles={{ container: (b) => ({ ...b, width: 200 }) }}
//       />

//       <Select
//         placeholder="Country"
//         options={options.countries?.map((t) => ({ label: t, value: t }))}
//         onChange={(e) => update("country", e?.value || "")}
//         isClearable
//         styles={{ container: (b) => ({ ...b, width: 200 }) }}
//       />

//       <Select
//         placeholder="Pestle"
//         options={options.pestle?.map((t) => ({ label: t, value: t }))}
//         onChange={(e) => update("pestle", e?.value || "")}
//         isClearable
//         styles={{ container: (b) => ({ ...b, width: 200 }) }}
//       />

//       <input
//         placeholder="End Year (<=)"
//         style={{ padding: 8, width: 150 }}
//         onChange={(e) => update("end_year", e.target.value)}
//       />
//     </div>
//   );
// }


// src/components/Filters.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import CustomSelect from "./ui/CustomSelect";
import Loader from "./Loader";

export default function Filters({ filters, setFilters, options }) {
  if (!options)
    return (
      <div className="p-4 bg-white rounded-xl shadow-md border text-red-500">
        Failed to load filters.
      </div>
    );

  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-center">

      {/* YEAR FILTER */}
      <CustomSelect
        label="End Year"
        value={filters?.end_year || ""}
        list={options.endYears}
        onChange={(v) => setFilters({ ...filters, end_year: v })}
      />

      {/* TOPIC */}
      <CustomSelect
        label="Topic"
        value={filters?.topic || ""}
        list={options.topics}
        onChange={(v) => setFilters({ ...filters, topic: v })}
      />

      {/* SECTOR */}
      <CustomSelect
        label="Sector"
        value={filters?.sector || ""}
        list={options.sectors}
        onChange={(v) => setFilters({ ...filters, sector: v })}
      />

      {/* REGION */}
      <CustomSelect
        label="Region"
        value={filters?.region || ""}
        list={options.regions}
        onChange={(v) => setFilters({ ...filters, region: v })}
      />

      {/* COUNTRY */}
      <CustomSelect
        label="Country"
        value={filters?.country || ""}
        list={options.countries}
        onChange={(v) => setFilters({ ...filters, country: v })}
      />

      {/* CITY */}
      <CustomSelect
        label="City"
        value={filters?.city || ""}
        list={options.cities}
        onChange={(v) => setFilters({ ...filters, city: v })}
      />

      {/* PESTLE */}
      <CustomSelect
        label="PESTLE"
        value={filters?.pestle || ""}
        list={options.pestles}
        onChange={(v) => setFilters({ ...filters, pestle: v })}
      />

      {/* SWOT */}
      <CustomSelect
        label="SWOT"
        value={filters?.swot || ""}
        list={options.swots}
        onChange={(v) => setFilters({ ...filters, swot: v })}
      />

      {/* START YEAR */}
      <CustomSelect
        label="Start Year"
        value={filters?.start_year || ""}
        list={options.startYears}
        onChange={(v) => setFilters({ ...filters, start_year: v })}
      />

      {/* SOURCE */}
      <CustomSelect
        label="Source"
        value={filters?.source || ""}
        list={options.sources}
        onChange={(v) => setFilters({ ...filters, source: v })}
      />

    </div>
  );
}

/* ----------------------------------------------
  Reusable Select Component
------------------------------------------------ */
// function SelectBox({ label, value, list, onChange }) {
//   return (
//     <div className="flex flex-col max-w-[350px] w-full">
//       <span className="text-xs text-gray-500 mb-1 truncate">{label}</span>

//       <select
//         className="
//           select-fix
//           px-3 py-2 border rounded-lg bg-gray-50 hover:bg-gray-100 
//           text-gray-700 shadow-sm
//           w-full max-w-[350px] 
//           text-sm
//         "
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       >
//         <option value="">Select {label}</option>

//         {list?.map((item) => (
//           <option key={item} value={item}>
//             {item || "N/A"}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }


