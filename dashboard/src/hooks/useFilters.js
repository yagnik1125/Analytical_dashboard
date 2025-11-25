import { useState, useEffect } from "react";
import axios from "axios";

export default function useFilters() {
  const [filters, setFilters] = useState({
    topic: "",
    sector: "",
    region: "",
    pestle: "",
    source: "",
    swot: "",
    country: "",
    city: "",
    end_year: "",
  });

  const [options, setOptions] = useState({
    topics: [],
    sectors: [],
    regions: [],
    countries: [],
    cities: [],
    pestles: [],
    sources: [],
    swots: [],
    end_years: [],
  });

  // Fetch available filter options
  useEffect(() => {
    axios
      .get("https://analytical-dashboard-vfwl.onrender.com/api/records/filters")
      .then((res) => {
        setOptions(res.data);
      })
      .catch((err) => {
        console.error("Failed to load filter options:", err);
      });
  }, []);

  return [filters, setFilters, options];
}
