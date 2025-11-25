import api from "./api";

export const getCorrelationData = () =>
  api.get("/correlation/metrics");

export const getGeoCountryStats = () =>
  api.get("/geo/country-stats");

export const getPestleDistribution = () =>
  api.get("/pestle/distribution");

export const getRiskTopics = () =>
  api.get("/risk/high-risk-topics");

export const getSectorDistribution = () =>
  api.get("/sector/distribution");

export const getSourceDistribution = () =>
  api.get("/source/distribution");

export const getMissingStats = () =>
  api.get("/summary/missing-data");

export const getSummaryKPIs = () =>
  api.get("/summary/kpis");

export const getInsightsPerYear = () =>
  api.get("/time/insights-per-year");

export const getTopicIntensity = () =>
  api.get("/topic/intensity");

export const getTopicLikelihood = () =>
  api.get("/topic/likelihood");
