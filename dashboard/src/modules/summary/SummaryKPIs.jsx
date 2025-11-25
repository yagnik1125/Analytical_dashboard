import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader";

export default function SummaryKPIs({ filters }) {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);

    axios
      .get("http://localhost:5000/api/records/summary/kpis", { params: filters })
      .then((res) => {
        setKpis(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load summary KPIs");
        setLoading(false);
      });
  }, [filters]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">📊 Summary KPIs</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPIBox label="Total Records" value={kpis.totalRecords} color="blue" />
        <KPIBox label="Avg Intensity" value={kpis.avgIntensity.toFixed(2)} color="purple" />
        <KPIBox label="Avg Likelihood" value={kpis.avgLikelihood.toFixed(2)} color="emerald" />
        <KPIBox label="Avg Relevance" value={kpis.avgRelevance.toFixed(2)} color="pink" />
        <KPIBox label="Total Topics" value={kpis.totalTopics} color="cyan" />
        <KPIBox label="Total Countries" value={kpis.totalCountries} color="amber" />
        <KPIBox label="Total Sources" value={kpis.totalSources} color="rose" />
      </div>
    </div>
  );
}

function KPIBox({ label, value, color }) {
  return (
    <div
      className="
        group flex flex-col p-5 bg-white/60 backdrop-blur-xl rounded-xl shadow-md border
        transition-all hover:shadow-xl hover:-translate-y-1
      "
    >
      <span className="text-sm text-gray-500 font-medium">{label}</span>

      <span className="text-4xl font-extrabold text-gray-800 mt-2 tracking-tight">
        {value}
      </span>

      <div
        className={`
          mt-3 h-1 w-16 rounded-full bg-${color}-400 group-hover:w-24 transition-all
        `}
      ></div>
    </div>
  );
}
