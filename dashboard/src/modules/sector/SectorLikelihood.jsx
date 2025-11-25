import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "../../components/Loader";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function SectorLikelihood({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://analytical-dashboard-vfwl.onrender.com/api/records/sector/likelihood", { params: filters })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load sector likelihood");
        setLoading(false);
      });
  }, [filters]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="
      bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl 
      border border-gray-200 p-6 hover:shadow-2xl hover:border-blue-300/60 
      transition-all
    ">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        🌊 Average Likelihood by Sector
      </h2>

      <Line
        data={{
          labels: data.map((d) => d._id || "Unknown"),
          datasets: [
            {
              label: "Avg Likelihood",
              data: data.map((d) => d.avgLikelihood?.toFixed(2)),
              borderColor: "rgba(59,130,246,1)",
              backgroundColor: "rgba(59,130,246,0.3)",
              borderWidth: 3,
              pointRadius: 5,
              pointBackgroundColor: "#3b82f6",
              tension: 0.4,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "rgba(15,23,42,0.9)",
              titleColor: "#fff",
              bodyColor: "#e2e8f0",
              padding: 10,
            },
          },
          scales: {
            x: {
              ticks: { color: "#374151" },
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
