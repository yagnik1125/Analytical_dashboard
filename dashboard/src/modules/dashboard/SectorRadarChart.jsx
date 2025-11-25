import React, { useEffect, useState } from "react";
import axios from "axios";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import Loader from "../../components/Loader";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function SectorRadarChart({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/records/sector/intensity", { params: filters })
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [filters]);

  if (loading) return <Loader />;

  return (
    <div className="bg-white p-6 shadow-2xl rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Sector Metrics (Radar)</h2>
      <Radar
        data={{
          labels: data.map(d => d._id),
          datasets: [{
            label: "Avg Intensity",
            data: data.map(d => d.avgIntensity),
            backgroundColor: "rgba(99,102,241,0.2)",
            borderColor: "rgb(99,102,241)",
            pointBackgroundColor: "rgb(99,102,241)"
          }]
        }}
        options={{
          responsive: true,
          scales: {
            r: { angleLines: { color: "#e5e7eb" }, grid: { color: "#e5e7eb" }, ticks: { color: "#6b7280" } }
          }
        }}
      />
    </div>
  );
}
