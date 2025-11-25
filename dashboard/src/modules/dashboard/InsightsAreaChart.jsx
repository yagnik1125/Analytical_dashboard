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

export default function InsightsAreaChart({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/records/time/insights-per-year", { params: filters })
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [filters]);

  if (loading) return <Loader />;

  const years = data.map(d => d._id);
  const counts = data.map(d => d.count);

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-white p-6 shadow-2xl rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Insights Growth (Area Chart)</h2>
      <Line
        data={{
          labels: years,
          datasets: [{
            label: "Insights",
            data: counts,
            fill: true,
            backgroundColor: "rgba(99,102,241,0.2)",
            borderColor: "rgb(99,102,241)",
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        }}
        options={{ responsive: true }}
      />
    </div>
  );
}
