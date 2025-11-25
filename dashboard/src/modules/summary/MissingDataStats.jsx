import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader";

export default function MissingDataStats({ filters }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);

    axios
      .get("http://localhost:5000/api/records/summary/missing-data", { params: filters })
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load missing data statistics");
        setLoading(false);
      });
  }, [filters]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        🧩 Missing Data Statistics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(stats).map(([key, val]) =>
          key !== "_id" && key !== "total" ? (
            <MissingBox
              key={key}
              label={key.replace("missing_", "").replace("_", " ").toUpperCase()}
              value={val}
            />
          ) : null
        )}

        <MissingBox key="total_records" label="TOTAL RECORDS" value={stats.total} />
      </div>
    </div>
  );
}

function MissingBox({ label, value }) {
  return (
    <div
      className="
        flex flex-col p-5 bg-white/60 backdrop-blur-xl rounded-xl shadow-md border
        transition-all hover:shadow-xl hover:-translate-y-1
      "
    >
      <span className="text-sm text-gray-500 font-medium">{label}</span>

      <span className="text-4xl font-extrabold text-gray-800 mt-2 tracking-tight">
        {value}
      </span>

      <div className="mt-3 h-1 w-20 rounded-full bg-red-400"></div>
    </div>
  );
}
