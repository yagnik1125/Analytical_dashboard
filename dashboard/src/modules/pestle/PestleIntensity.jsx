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

export default function PestleIntensity({ filters }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/records/pestle-analysis", { params: filters })
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to load PESTLE Intensity.");
        setIsLoading(false);
      });
  }, [filters]);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div
      className="
        bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl 
        border border-gray-200 p-6 hover:shadow-2xl hover:border-pink-300/60 
        transition-all
      "
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        🔥 Average Intensity by PESTLE
      </h2>

      <Bar
        data={{
          labels: data.map((d) => d._id),
          datasets: [
            {
              label: "Avg Intensity",
              data: data.map((d) => d.avgIntensity?.toFixed(2)),
              backgroundColor: "rgba(236,72,153,0.75)",
              borderColor: "rgba(236,72,153,1)",
              borderWidth: 2,
              borderRadius: 6,
            },
          ],
        }}
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
            x: { ticks: { color: "#374151" }, grid: { display: false } },
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
