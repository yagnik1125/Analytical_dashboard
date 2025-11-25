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
import Loader from "../../components/Loader";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function CountryStats({ filters }) {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/records/country-stats", {
        params: filters,
      })
      .then((res) => {
        setStats(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to load country stats.");
        setIsLoading(false);
      });
  }, [filters]);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-lg">{error}</p>;
  if (!stats.length) return <p>No country data available.</p>;

  const labels = stats.map((s) => s._id);
  const values = stats.map((s) => s.count);

  return (
    <div
      className="
        bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 
        p-6 transition-all hover:shadow-2xl hover:border-blue-300/60
      "
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        🌍 Country Statistics
      </h2>

      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Insight Count",
              data: values,
              backgroundColor: "rgba(59, 130, 246, 0.85)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 2,
              borderRadius: 6,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            tooltip: {
              backgroundColor: "rgba(30, 41, 59, 0.9)",
              titleColor: "#fff",
              bodyColor: "#e5e7eb",
              padding: 10,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
            },
            legend: { display: false },
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
