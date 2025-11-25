import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Loader from "../../components/Loader";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PestlePieChart({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/records/pestle-analysis", { params: filters })
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [filters]);

  if (loading) return <Loader />;

  return (
    <div className="bg-white p-6 shadow-2xl rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">PESTLE Distribution</h2>
      <Pie
        data={{
          labels: data.map(d => d._id),
          datasets: [{
            data: data.map(d => d.count),
            backgroundColor: [
              "#6366F1", "#F59E0B", "#EF4444", "#10B981", "#8B5CF6", "#F472B6"
            ],
            hoverOffset: 10
          }]
        }}
        options={{
          responsive: true,
          plugins: { legend: { position: "right" } }
        }}
      />
    </div>
  );
}
