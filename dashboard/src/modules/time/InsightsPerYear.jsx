import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import Loader from "../../components/Loader";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

export default function InsightsPerYear({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://analytical-dashboard-vfwl.onrender.com/api/records/time/insights-per-year", { params: filters })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters]);

  if (loading) return <Loader />;

  const years = data.map(d => d._id || "N/A");
  const counts = data.map(d => d.count);

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-white p-6 shadow-2xl rounded-2xl border border-gray-200 backdrop-blur-md transition-transform hover:scale-[1.02]">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Insights Per Year</h2>
      <Line
        data={{
          labels: years,
          datasets: [
            {
              label: "Insights",
              data: counts,
              borderWidth: 3,
              borderColor: "rgb(99,102,241)",
              backgroundColor: "rgba(99,102,241,0.2)",
              fill: true,
              tension: 0.4,
              pointRadius: 5,
              pointHoverRadius: 7,
              pointBackgroundColor: "rgb(99,102,241)",
              pointHoverBackgroundColor: "rgb(79,70,229)"
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              labels: { color: "#4b5563", font: { size: 14 } }
            },
            tooltip: {
              mode: "index",
              intersect: false
            }
          },
          scales: {
            x: { ticks: { color: "#6b7280", font: { size: 13 } }, grid: { color: "#e5e7eb" } },
            y: { ticks: { color: "#6b7280", font: { size: 13 } }, grid: { color: "#e5e7eb" } }
          }
        }}
      />
    </div>
  );
}
