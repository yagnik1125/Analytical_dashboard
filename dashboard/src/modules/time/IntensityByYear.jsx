import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import Loader from "../../components/Loader";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function IntensityByYear({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/records/time/intensity-by-year", { params: filters })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters]);

  if (loading) return <Loader />;

  return (
    <div className="bg-gradient-to-tr from-white via-gray-50 to-white p-6 shadow-2xl rounded-2xl border border-gray-200 backdrop-blur-md transition-transform hover:scale-[1.02]">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Intensity By Year</h2>
      <Bar
        data={{
          labels: data.map(i => i._id),
          datasets: [
            {
              label: "Avg Intensity",
              data: data.map(i => i.avgIntensity),
              backgroundColor: data.map(() => "rgba(255, 99, 132, 0.7)"),
              borderRadius: 6,
              barThickness: 20,
              hoverBackgroundColor: "rgba(255, 99, 132, 1)"
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { labels: { color: "#4b5563", font: { size: 14 } } },
            tooltip: { mode: "index", intersect: false }
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
