import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import Loader from "../../components/Loader";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function HighRiskTopics({ filters }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/records/risk/high-risk-topics", {
        params: filters,
      })
      .then(res => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to load high risk topics.");
        setIsLoading(false);
      });
  }, [filters]);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-lg">{error}</p>;

  return (
    <div
      className="
        bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 
        p-6 transition-all hover:shadow-2xl hover:border-blue-300/50
      "
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        🚨 High-Risk Topics Overview
      </h2>

      <Bar
        data={{
          labels: data.map(d => d._id),
          datasets: [
            {
              label: "Risk Score",
              data: data.map(d => d.riskScore.toFixed(2)),
              backgroundColor: "rgba(239, 68, 68, 0.8)",
              borderColor: "rgba(239, 68, 68, 1)",
              borderWidth: 2,
              borderRadius: 6,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "rgba(30, 41, 59, 0.9)",
              titleColor: "#fff",
              bodyColor: "#d1d5db",
              padding: 12,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
            },
          },
          scales: {
            x: {
              ticks: { color: "#374151", font: { size: 12, weight: 500 } },
              grid: { display: false },
            },
            y: {
              ticks: { color: "#6b7280", font: { size: 12 } },
              grid: { color: "rgba(200,200,200,0.3)" },
            },
          },
        }}
      />
    </div>
  );
}
