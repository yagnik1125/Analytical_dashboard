// src/charts/correlation/CorrelationMatrix.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  LinearScale,
  Title
} from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { Chart } from "react-chartjs-2";
import Loader from "../../components/Loader";

ChartJS.register(MatrixController, MatrixElement, LinearScale, Tooltip, Legend, Title);

export default function CorrelationMatrix({ filters }) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    axios
      .get("https://analytical-dashboard-vfwl.onrender.com/api/records/correlation-data", { params: filters })
      .then((res) => {
        setRecords(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to load correlation data.");
        setIsLoading(false);
      });
  }, [filters]);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-lg">{error}</p>;
  if (!records.length)
    return <p className="text-gray-700 text-lg">⚠ No data available for selected filters.</p>;

  const intensity = records.map(r => r.intensity || 0);
  const relevance = records.map(r => r.relevance || 0);
  const likelihood = records.map(r => r.likelihood || 0);

  const corr = (x, y) => {
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;
    const num = x.reduce((sum, _, i) => sum + ((x[i] - meanX) * (y[i] - meanY)), 0);
    const den = Math.sqrt(
      x.reduce((sum, v) => sum + (v - meanX) ** 2, 0) *
      y.reduce((sum, v) => sum + (v - meanY) ** 2, 0)
    );
    return den ? num / den : 0;
  };

  const labels = ["Intensity", "Relevance", "Likelihood"];
  const values = [
    [1, corr(intensity, relevance), corr(intensity, likelihood)],
    [corr(relevance, intensity), 1, corr(relevance, likelihood)],
    [corr(likelihood, intensity), corr(likelihood, relevance), 1],
  ];

  const chartData = {
    datasets: [
      {
        label: "Correlation Matrix",
        data: values.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => ({
            x: colIndex,
            y: rowIndex,
            v: value,
          }))
        ),
        backgroundColor(ctx) {
          const v = ctx.dataset.data[ctx.dataIndex].v;
          const abs = Math.abs(v);

          return v >= 0
            ? `rgba(59, 130, 246, ${abs})` // blue
            : `rgba(239, 68, 68, ${abs})`; // red
        },
        width: () => 65,
        height: () => 65,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)"
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label(ctx) {
            return `Correlation: ${ctx.raw.v.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        ticks: { callback: v => labels[v] || "" },
        grid: { display: false },
      },
      y: {
        type: "linear",
        ticks: { callback: v => labels[v] || "" },
        grid: { display: false },
      }
    }
  };

  return (
    <div className="
      bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-100 
      hover:shadow-2xl transition-all
    ">
      <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2 mb-6">
        🔗 Correlation Matrix
      </h2>
      <div className="flex justify-center">
        <Chart type="matrix" data={chartData} options={options} />
      </div>
    </div>
  );
}
