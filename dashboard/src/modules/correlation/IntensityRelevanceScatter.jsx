// src/charts/correlation/IntensityRelevanceScatter.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  PointElement,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import Loader from "../../components/Loader";

ChartJS.register(PointElement, LinearScale, Tooltip, Legend);

export default function IntensityRelevanceScatter({ filters }) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    axios
      .get("https://analytical-dashboard-vfwl.onrender.com/api/records/scatter-intensity-relevance", { params: filters })
      .then((res) => {
        setRecords(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to load scatter chart data.");
        setIsLoading(false);
      });
  }, [filters]);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-lg">{error}</p>;
  if (!records.length)
    return <p className="text-gray-700 text-lg">⚠ No data available for selected filters.</p>;

  const points = records.map((r) => ({
    x: r.intensity || 0,
    y: r.relevance || 0,
  }));

  return (
    <div className="
      bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-100 
      hover:shadow-2xl transition-all
    ">
      <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2 mb-6">
        🎯 Intensity vs Relevance
      </h2>

      <Scatter
        data={{
          datasets: [
            {
              label: "Insights",
              data: points,
              backgroundColor: "rgba(59, 130, 246, 0.7)",
              borderColor: "rgba(59, 130, 246, 0.9)",
              pointRadius: 7,
              pointHoverRadius: 10,
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          scales: {
            x: {
              title: { display: true, text: "Intensity", color: "#374151", font: { size: 14 } },
              grid: { color: "#e5e7eb50" },
            },
            y: {
              title: { display: true, text: "Relevance", color: "#374151", font: { size: 14 } },
              grid: { color: "#e5e7eb50" },
            },
          },
          plugins: {
            tooltip: {
              backgroundColor: "rgba(30, 41, 59, 0.9)",
              titleColor: "#fff",
              bodyColor: "#d1d5db",
              padding: 12,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)"
            }
          }
        }}
      />
    </div>
  );
}
