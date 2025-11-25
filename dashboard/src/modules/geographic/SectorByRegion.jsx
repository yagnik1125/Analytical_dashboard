import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "../../components/Loader";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function SectorByRegion({ filters }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/records/sector-by-region", { params: filters })
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to load sector-region data.");
        setIsLoading(false);
      });
  }, [filters]);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500 text-lg">{error}</p>;
  if (!data.length) return <p>No sector-region data found.</p>;

  const regions = data.map((d) => d._id);

  const sectorMap = {};
  data.forEach((r) =>
    r.sectors.forEach((s) => {
      if (!sectorMap[s.sector]) sectorMap[s.sector] = {};
      sectorMap[s.sector][r._id] = s.count;
    })
  );

  const datasets = Object.keys(sectorMap).map((sector) => ({
    label: sector || "Unknown",
    data: regions.map((r) => sectorMap[sector][r] || 0),
    backgroundColor: `rgba(${Math.floor(Math.random() * 120) + 80}, ${
      Math.floor(Math.random() * 100) + 100
    }, 200, 0.75)`,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  }));

  return (
    <div
      className="
        bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 
        p-6 transition-all hover:shadow-2xl hover:border-blue-300/60
      "
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        🏭 Sector Distribution by Region
      </h2>

      <Bar
        data={{ labels: regions, datasets }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: { padding: 20, color: "#374151" },
            },
            tooltip: {
              backgroundColor: "rgba(30, 41, 59, 0.9)",
              titleColor: "#fff",
              bodyColor: "#d1d5db",
              padding: 12,
            },
          },
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: {
              stacked: true,
              grid: { color: "rgba(200,200,200,0.3)" },
            },
          },
        }}
      />
    </div>
  );
}
