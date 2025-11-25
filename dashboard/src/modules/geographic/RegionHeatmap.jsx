import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  LinearScale,
} from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { Chart } from "react-chartjs-2";
import Loader from "../../components/Loader";

ChartJS.register(MatrixController, MatrixElement, LinearScale, Tooltip, Legend);

export default function RegionHeatmap({ filters }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://analytical-dashboard-vfwl.onrender.com/api/records/region-heatmap", { params: filters })
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to load region heatmap data");
        setIsLoading(false);
      });
  }, [filters]);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-lg">{error}</p>;
  if (!data.length) return <p>No region data available.</p>;

  const heatmap = data.map((r, i) => ({
    x: 0,
    y: i,
    v: r.count,
  }));

  const chartData = {
    datasets: [
      {
        label: "Region Heatmap",
        data: heatmap,
        backgroundColor(ctx) {
          const val = ctx.dataset.data[ctx.dataIndex].v;
          const intensity = Math.min(1, val / 60);
          return `rgba(59, 130, 246, ${intensity})`; // blue gradient
        },
        width: () => 250,
        height: () => 45,
      },
    ],
  };

  const labels = data.map((d) => d._id);

  return (
    <div
      className="
        bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 
        p-6 hover:shadow-2xl hover:border-blue-300/50 transition-all
      "
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        🌡 Region Heatmap
      </h2>

      <Chart
        type="matrix"
        data={chartData}
        options={{
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `Count: ${ctx.raw.v}`,
              },
              backgroundColor: "rgba(30, 41, 59, 0.9)",
              titleColor: "#fff",
              bodyColor: "#e5e7eb",
            },
          },
          scales: {
            y: {
              ticks: { callback: (v) => labels[v] },
              grid: { display: false },
            },
            x: { display: false },
          },
        }}
      />
    </div>
  );
}
