import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "../../components/Loader";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function PestleDistribution({ filters }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://analytical-dashboard-vfwl.onrender.com/api/records/pestle-analysis", { params: filters })
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to load PESTLE Distribution.");
        setIsLoading(false);
      });
  }, [filters]);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  const chartData = {
    labels: data.map((d) => d._id || "Unknown"),
    datasets: [
      {
        label: "Count",
        data: data.map((d) => d.count),
        backgroundColor: "rgba(59,130,246,0.8)",
        borderColor: "rgba(59,130,246,1)",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div
      className="
        bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl 
        border border-gray-200 p-6 hover:shadow-2xl hover:border-blue-300/60 
        transition-all
      "
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        📊 PESTLE Distribution (Count)
      </h2>

      <Bar
        data={chartData}
        options={{
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "rgba(15,23,42,.9)",
              titleColor: "#fff",
              bodyColor: "#e2e8f0",
              padding: 10,
            },
          },
          scales: {
            x: {
              ticks: { color: "#374151", maxRotation: 40, minRotation: 40 },
              grid: { display: false },
            },
            y: {
              ticks: { color: "#6b7280" },
              grid: { color: "rgba(200,200,200,.3)" },
            },
          },
        }}
      />
    </div>
  );
}
