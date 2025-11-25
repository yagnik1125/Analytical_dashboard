import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function SectorDistribution({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://analytical-dashboard-vfwl.onrender.com/api/records/sector/distribution", { params: filters })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load sector distribution");
        setLoading(false);
      });
  }, [filters]);

  if (loading) return <p>Loading Sector Distribution...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="
      bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl 
      border border-gray-200 p-6 hover:shadow-2xl hover:border-blue-300/60 
      transition-all
    ">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        🏭 Sector Distribution
      </h2>

      <Bar
        data={{
          labels: data.map((d) => d._id || "Unknown"),
          datasets: [
            {
              label: "Record Count",
              data: data.map((d) => d.count),
              backgroundColor: "rgba(59, 130, 246, 0.8)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 2,
              borderRadius: 6,
            },
          ],
        }}
        options={{
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              titleColor: "#fff",
              bodyColor: "#e2e8f0",
              padding: 10,
              borderColor: "#fff",
            },
          },
          scales: {
            x: {
              ticks: { color: "#374151", maxRotation: 40, minRotation: 40 },
              grid: { display: false },
            },
            y: {
              ticks: { color: "#6b7280" },
              grid: { color: "rgba(200,200,200,0.3)" },
            },
          },
        }}
      />
    </div>
  );
}
