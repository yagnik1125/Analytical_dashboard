import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";

export default function AISummary({filters, setFilters, filterOptions, setFilterOptions}) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchSummary = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/records/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "ai", filters }),  // Fetch AI + Local summary
      });

      const data = await res.json();
      setSummary(data);
    } catch (err) {
      setError("Failed to load summary");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
  }, [filters]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 p-6">{error}</div>;
  if (!summary) return <div className="p-6">No summary available</div>;

  const { localSummary, aiSummary } = summary;

  // Helper to display top items (Topics / Countries)
  const renderTopList = (list) =>
    list
      .filter(item => item._id)
      .map((item, idx) => (
        <li key={idx} className="ml-4 list-disc">
          {item._id} ({item.count})
        </li>
      ));

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-xl shadow-lg">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
          <span className="text-gray-500 text-sm">Total Records</span>
          <span className="text-2xl font-bold">{localSummary.totalRecords}</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
          <span className="text-gray-500 text-sm">Avg Intensity</span>
          <span className="text-2xl font-bold">{localSummary.avgIntensity}</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
          <span className="text-gray-500 text-sm">Avg Likelihood</span>
          <span className="text-2xl font-bold">{localSummary.avgLikelihood}</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
          <span className="text-gray-500 text-sm">Avg Relevance</span>
          <span className="text-2xl font-bold">{localSummary.avgRelevance}</span>
        </div>
      </div>

      {/* Top Topics & Countries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Top Topics</h3>
          <ul>{renderTopList(localSummary.topTopics)}</ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Top Countries</h3>
          <ul>{renderTopList(localSummary.topCountries)}</ul>
        </div>
      </div>

      {/* Correlations */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Correlations</h3>
        <ul className="list-disc ml-4">
          <li>Intensity ↔ Relevance: {localSummary.correlations.intensity_relevance}</li>
          <li>Intensity ↔ Likelihood: {localSummary.correlations.intensity_likelihood}</li>
          <li>Relevance ↔ Likelihood: {localSummary.correlations.relevance_likelihood}</li>
        </ul>
      </div>

      {/* AI Summary */}
      {aiSummary && (
        <div className="bg-white p-4 rounded-lg shadow max-h-[500px] overflow-y-auto">
          <h3 className="font-semibold mb-2">AI Generated Summary</h3>
          <pre className="whitespace-pre-wrap text-gray-800">{aiSummary}</pre>
        </div>
      )}
    </div>
  );
}
