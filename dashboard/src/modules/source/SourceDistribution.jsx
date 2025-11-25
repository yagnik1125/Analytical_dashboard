import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import Loader from "../../components/Loader";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function SourceDistribution({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);

    axios
      .get("http://localhost:5000/api/records/source/distribution", { params: filters })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load source distribution");
        setLoading(false);
      });
  }, [filters]);

  if (loading) return <Loader />
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="bg-white p-5 shadow-lg rounded-xl border backdrop-blur-md">
      <h2 className="text-xl font-semibold mb-4">Source Distribution</h2>

      <Bar
        data={{
          labels: data.map(d => d._id || "Unknown"),
          datasets: [
            {
              label: "Count",
              data: data.map(d => d.count),
              backgroundColor: "rgba(0, 200, 150, 0.7)"
            }
          ]
        }}
      />
    </div>
  );
}
