// import Dashboard from "./pages/Dashboard";

// export default function App() {
//   return <Dashboard />;
// }


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import CorrelationPage from "./pages/CorrelationPage";
import RiskPage from "./pages/RiskPage";
import TopicPage from "./pages/TopicPage";
import SectorPage from "./pages/SectorPage";
import PestlePage from "./pages/PestlePage";
import GeographicPage from "./pages/GeographicPage";
import SummaryPage from "./pages/SummaryPage";
import TimePage from "./pages/TimePage";
import { useState,useEffect } from "react";
import axios from "axios";
import Loader from "./components/Loader";

export default function App() {
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/records/filters")
      .then(res => setFilterOptions(res.data))
      .catch(err => console.error("Filters API Error:", err));
  }, []);
  if (!filterOptions) return <Loader />;

  return (
    <Routes>
      <Route path="/" element={<DashboardPage filters={filters} setFilters={setFilters} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />} />

      <Route path="/correlation" element={<CorrelationPage filters={filters} setFilters={setFilters} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />} />
      <Route path="/risk" element={<RiskPage filters={filters} setFilters={setFilters} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />} />
      <Route path="/topic" element={<TopicPage filters={filters} setFilters={setFilters} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />} />
      <Route path="/sector" element={<SectorPage filters={filters} setFilters={setFilters} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />} />
      <Route path="/pestle" element={<PestlePage filters={filters} setFilters={setFilters} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />} />
      <Route path="/geographic" element={<GeographicPage filters={filters} setFilters={setFilters} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />} />
      <Route path="/summary" element={<SummaryPage filters={filters} setFilters={setFilters} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />} />
      <Route path="/time" element={<TimePage filters={filters} setFilters={setFilters} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />} />

      <Route path="*" element={<DashboardPage filters={filters} setFilters={setFilters} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />} />
    </Routes>
  );
}
