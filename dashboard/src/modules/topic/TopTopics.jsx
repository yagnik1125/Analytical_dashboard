import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import Loader from "../../components/Loader";

export default function TopTopics({ filters }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://analytical-dashboard-vfwl.onrender.com/api/records/topic/top", { params: filters })
      .then(res => {
        setTopics(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters]);

  if (loading) return <Loader />;

  return (
    <div className="
      bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl 
      border border-gray-200 p-6 hover:shadow-2xl hover:border-green-300/60 
      transition-all
    ">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        🌱 Top Trending Topics
      </h2>

      <Bar
        data={{
          labels: topics.map(t => t._id || "N/A"),
          datasets: [
            {
              label: "Count",
              data: topics.map(t => t.count),
              backgroundColor: "rgba(16, 185, 129, 0.8)",
              borderColor: "rgba(16, 185, 129, 1)",
              borderWidth: 2,
              borderRadius: 6
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "rgba(30, 41, 59, 0.9)",
              titleColor: "#fff",
              bodyColor: "#e5e7eb",
              padding: 10,
            }
          },
          scales: {
            x: { 
              ticks: { color: "#374151", font: { size: 12 } },
              grid: { display: false }
            },
            y: { 
              ticks: { color: "#6b7280" },
              grid: { color: "rgba(200,200,200,0.3)" }
            }
          }
        }}
      />
    </div>
  );
}
