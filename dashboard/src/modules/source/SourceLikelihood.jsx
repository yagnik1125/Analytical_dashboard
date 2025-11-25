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
  Legend
} from "chart.js";
import Loader from "../../components/Loader";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function SourceLikelihood({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);

    axios
      .get("https://analytical-dashboard-vfwl.onrender.com/api/records/source/likelihood", { params: filters })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load source likelihood");
        setLoading(false);
      });
  }, [filters]);

  if (loading) return <Loader />
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="bg-white p-5 shadow-lg rounded-xl border backdrop-blur-md">
      <h2 className="text-xl font-semibold mb-4">Average Likelihood by Source</h2>

      <Line
        data={{
          labels: data.map(d => d._id || "Unknown"),
          datasets: [
            {
              label: "Avg Likelihood",
              data: data.map(d => d.avgLikelihood?.toFixed(2)),
              borderColor: "rgba(100, 100, 255, 0.9)",
              fill: false
            }
          ]
        }}
      />
    </div>
  );
}
