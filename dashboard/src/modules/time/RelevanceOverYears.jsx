import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import Loader from "../../components/Loader";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function RelevanceOverYears({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/records/time/relevance-over-years", { params: filters })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters]);

  if (loading) return <Loader />;

  const years = data.map(d => d._id);
  const relevance = data.map(d => d.avgRelevance);

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-white p-6 shadow-2xl rounded-2xl border border-gray-200 backdrop-blur-md transition-transform hover:scale-[1.02]">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Relevance Over Years</h2>
      <Line
        data={{
          labels: years,
          datasets: [
            {
              label: "Avg Relevance",
              data: relevance,
              borderColor: "rgb(34,197,94)",
              backgroundColor: "rgba(34,197,94,0.2)",
              tension: 0.4,
              pointRadius: 5,
              pointHoverRadius: 7,
              fill: true
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
