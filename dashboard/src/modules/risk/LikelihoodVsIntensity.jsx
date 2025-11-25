import React, { useEffect, useState } from "react";
import axios from "axios";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import Loader from "../../components/Loader";
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export default function LikelihoodVsIntensity({ filters }) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://analytical-dashboard-vfwl.onrender.com/api/records/risk/likelihood-intensity", {
        params: filters,
      })
      .then(res => {
        setRecords(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch scatter data.");
        setIsLoading(false);
      });
  }, [filters]);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-lg">{error}</p>;

  const points = records.map(r => ({
    x: r.likelihood || 0,
    y: r.intensity || 0,
  }));

  return (
    <div
      className="
        bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 
        p-6 transition-all hover:shadow-2xl hover:border-blue-300/50
      "
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        📈 Likelihood vs Intensity
      </h2>

      <Scatter
        data={{
          datasets: [
            {
              label: "Risk Points",
              data: points,
              backgroundColor: "rgba(59, 130, 246, 0.8)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 2,
              pointRadius: 7,
              pointHoverRadius: 10,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            tooltip: {
              backgroundColor: "rgba(30, 41, 59, 0.9)",
              titleColor: "#fff",
              bodyColor: "#d1d5db",
              padding: 12,
            },
          },
          scales: {
            x: {
              title: { display: true, text: "Likelihood", color: "#374151" },
              grid: { color: "rgba(200,200,200,0.3)" },
            },
            y: {
              title: { display: true, text: "Intensity", color: "#374151" },
              grid: { color: "rgba(200,200,200,0.3)" },
            },
          },
        }}
      />
    </div>
  );
}
