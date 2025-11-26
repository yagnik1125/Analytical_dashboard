// import React from "react";

// export default function Sidebar({ setActiveChart }) {
//   return (
//     <div style={{
//       width: "270px",
//       background: "#1e1e1e",
//       color: "white",
//       padding: "20px 10px",
//       height: "100vh",
//       overflowY: "auto"
//     }}>
//       <h2 style={{ color: "cyan", marginBottom: 20 }}>Analytics Dashboard</h2>

//       <MenuGroup title="Correlation Analysis">
//         <MenuItem name="Correlation Matrix" chart="corr-matrix" setActive={setActiveChart} />
//         <MenuItem name="Intensity vs Relevance" chart="intensity-relevance" setActive={setActiveChart} />
//       </MenuGroup>

//       <MenuGroup title="Geographic Analysis">
//         <MenuItem name="Region Heatmap" chart="region-heatmap" setActive={setActiveChart} />
//         <MenuItem name="Country Stats" chart="country-stats" setActive={setActiveChart} />
//         <MenuItem name="Sector by Region" chart="sector-region" setActive={setActiveChart} />
//       </MenuGroup>

//       <MenuGroup title="PESTLE Analysis">
//         <MenuItem name="PESTLE Distribution" chart="pestle-dist" setActive={setActiveChart} />
//         <MenuItem name="PESTLE Intensity" chart="pestle-intensity" setActive={setActiveChart} />
//         <MenuItem name="PESTLE Likelihood" chart="pestle-likelihood" setActive={setActiveChart} />
//       </MenuGroup>

//       <MenuGroup title="Risk Analysis">
//         <MenuItem name="Likelihood vs Intensity" chart="likelihood-vs-intensity" setActive={setActiveChart} />
//         <MenuItem name="Risk Matrix" chart="risk-matrix" setActive={setActiveChart} />
//         <MenuItem name="High Risk Topics" chart="high-risk-topics" setActive={setActiveChart} />
//       </MenuGroup>

//       <MenuGroup title="Sector Analysis">
//         <MenuItem name="Sector Distribution" chart="sector-dist" setActive={setActiveChart} />
//         <MenuItem name="Sector Intensity" chart="sector-intensity" setActive={setActiveChart} />
//         <MenuItem name="Sector Likelihood" chart="sector-likelihood" setActive={setActiveChart} />
//       </MenuGroup>

//       <MenuGroup title="Source Analysis">
//         <MenuItem name="Source Distribution" chart="source-dist" setActive={setActiveChart} />
//         <MenuItem name="Source Intensity" chart="source-intensity" setActive={setActiveChart} />
//         <MenuItem name="Source Likelihood" chart="source-likelihood" setActive={setActiveChart} />
//       </MenuGroup>

//       <MenuGroup title="Summary">
//         <MenuItem name="Missing Data Stats" chart="missing-data" setActive={setActiveChart} />
//         <MenuItem name="Summary KPIs" chart="summary-kpi" setActive={setActiveChart} />
//       </MenuGroup>

//       <MenuGroup title="Time-Based Analysis">
//         <MenuItem name="Insights Per Year" chart="insights-year" setActive={setActiveChart} />
//         <MenuItem name="Intensity by Year" chart="intensity-year" setActive={setActiveChart} />
//         <MenuItem name="Relevance Over Years" chart="relevance-year" setActive={setActiveChart} />
//       </MenuGroup>

//       <MenuGroup title="Topic Analysis">
//         <MenuItem name="Topic Intensity" chart="topic-intensity" setActive={setActiveChart} />
//         <MenuItem name="Topic Likelihood" chart="topic-likelihood" setActive={setActiveChart} />
//         <MenuItem name="Top Topics" chart="topics-top" setActive={setActiveChart} />
//       </MenuGroup>

//     </div>
//   );
// }

// function MenuGroup({ title, children }) {
//   return (
//     <div style={{ marginBottom: 25 }}>
//       <h4 style={{ opacity: 0.7, marginBottom: 8 }}>{title}</h4>
//       <div>{children}</div>
//     </div>
//   );
// }

// function MenuItem({ name, chart, setActive }) {
//   return (
//     <div
//       onClick={() => setActive(chart)}
//       style={{
//         padding: "6px 10px",
//         cursor: "pointer",
//         borderRadius: 4,
//         marginBottom: 4,
//         background: "#2b2b2b",
//       }}>
//       {name}
//     </div>
//   );
// }


// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  AlertTriangle,
  Globe2,
  FileSearch,
  PieChart,
  Layers,
  Clock,
  Brain
} from "lucide-react";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Correlation", icon: BarChart3, path: "/correlation" },
  { label: "Risk", icon: AlertTriangle, path: "/risk" },
  { label: "Geographic", icon: Globe2, path: "/geographic" },
  { label: "Topic", icon: Brain, path: "/topic" },
  { label: "Sector", icon: Layers, path: "/sector" },
  { label: "Pestle", icon: PieChart, path: "/pestle" },
  { label: "Summary", icon: FileSearch, path: "/summary" },
  { label: "Time", icon: Clock, path: "/time" },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity 
        ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside 
        className={`fixed z-50 md:static top-0 left-0 h-full w-64 bg-white shadow-lg border-r
        transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-6 text-xl font-semibold text-purple-600">
          Insight Dashboard
        </div>

        <nav className="mt-4">
          {menu.map(item => (
            <NavLink 
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({isActive}) =>
                `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-purple-50 
                 ${isActive ? "bg-purple-100 text-purple-600 font-medium" : ""}`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
