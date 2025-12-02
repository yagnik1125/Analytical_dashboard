// import React, { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Filters from "../components/Filters";

// import CorrelationMatrix from "../modules/correlation/CorrelationMatrix";
// import IntensityRelevanceScatter from "../modules/correlation/IntensityRelevanceScatter";

// import RegionHeatmap from "../modules/geographic/RegionHeatmap";
// import CountryStats from "../modules/geographic/CountryStats";
// import SectorByRegion from "../modules/geographic/SectorByRegion";

// import PestleDistribution from "../modules/pestle/PestleDistribution";
// import PestleIntensity from "../modules/pestle/PestleIntensity";
// import PestleLikelihood from "../modules/pestle/PestleLikelihood";

// import HighRiskTopics from "../modules/risk/HighRiskTopics";
// import LikelihoodVsIntensity from "../modules/risk/LikelihoodVsIntensity";
// import RiskMatrix from "../modules/risk/RiskMatrix";

// import SectorDistribution from "../modules/sector/SectorDistribution";
// import SectorIntensity from "../modules/sector/SectorIntensity";
// import SectorLikelihood from "../modules/sector/SectorLikelihood";

// import SourceDistribution from "../modules/source/SourceDistribution";
// import SourceIntensity from "../modules/source/SourceIntensity";
// import SourceLikelihood from "../modules/source/SourceLikelihood";

// import MissingDataStats from "../modules/summary/MissingDataStats";
// import SummaryKPIs from "../modules/summary/SummaryKPIs";

// import InsightsPerYear from "../modules/time/InsightsPerYear";
// import IntensityByYear from "../modules/time/IntensityByYear";
// import RelevanceOverYears from "../modules/time/RelevanceOverYears";

// import TopicIntensity from "../modules/topic/TopicIntensity";
// import TopicLikelihood from "../modules/topic/TopicLikelihood";
// import TopTopics from "../modules/topic/TopTopics";

// export default function Dashboard() {
//   const [activeChart, setActiveChart] = useState("corr-matrix");
//   const [filters, setFilters] = useState({});

//   const renderChart = () => {
//     switch (activeChart) {
//       case "corr-matrix":
//         return <CorrelationMatrix filters={filters} />;
//       case "intensity-relevance":
//         return <IntensityRelevanceScatter filters={filters} />;

//       case "region-heatmap":
//         return <RegionHeatmap filters={filters} />;
//       case "country-stats":
//         return <CountryStats filters={filters} />;
//       case "sector-region":
//         return <SectorByRegion filters={filters} />;

//       case "pestle-dist":
//         return <PestleDistribution filters={filters} />;
//       case "pestle-intensity":
//         return <PestleIntensity filters={filters} />;
//       case "pestle-likelihood":
//         return <PestleLikelihood filters={filters} />;

//       case "high-risk-topics":
//         return <HighRiskTopics filters={filters} />;
//       case "likelihood-vs-intensity":
//           return <LikelihoodVsIntensity filters={filters} />;
//       case "risk-matrix":
//           return <RiskMatrix filters={filters} />;

//       case "sector-dist":
//         return <SectorDistribution filters={filters} />;
//       case "sector-intensity":
//           return <SectorIntensity filters={filters} />;
//       case "sector-likelihood":
//           return <SectorLikelihood filters={filters} />;

//       case "source-dist":
//         return <SourceDistribution filters={filters} />;
//       case "source-intensity":
//           return <SourceIntensity filters={filters} />;
//       case "source-likelihood":
//           return <SourceLikelihood filters={filters} />;

//       case "missing-data":
//           return <MissingDataStats filters={filters} />;
//       case "summary-kpi":
//           return <SummaryKPIs filters={filters} />;

//       case "insights-year":
//           return <InsightsPerYear filters={filters} />;
//       case "intensity-year":
//           return <IntensityByYear filters={filters} />;
//       case "relevance-year":
//           return <RelevanceOverYears filters={filters} />;

//       case "topic-intensity":
//           return <TopicIntensity filters={filters} />;
//       case "topic-likelihood":
//           return <TopicLikelihood filters={filters} />;
//       case "topics-top":
//           return <TopTopics filters={filters} />;
//       default:
//         return <h2>Select a chart from sidebar</h2>;
//     }
//   };

//   return (
//     <div style={{ display: "flex" }}>
//       <Sidebar setActiveChart={setActiveChart} />

//       <div style={{ flex: 1, padding: "20px" }}>
//         <Filters onChange={setFilters} />
//         <div style={{ marginTop: 20 }}>
//           {renderChart()}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import Filters from "../components/Filters";
import SummaryKPIs from "../modules/summary/SummaryKPIs";
import HighRiskTopics from "../modules/risk/HighRiskTopics"
import CorrelationMatrix from "../modules/correlation/CorrelationMatrix";
import InsightsPerYear from "../modules/time/InsightsPerYear";
import DashboardLayout from "../layout/DashboardLayout";
import GridLayout from "../layout/GridLayout";
import Loader from "../components/Loader"
import InsightsAreaChart from "../modules/dashboard/InsightsAreaChart";
import PestlePieChart from "../modules/dashboard/PestlePieChart";
import SectorRadarChart from "../modules/dashboard/SectorRadarChart";
import AISummaryWidget from "../components/AISummaryWidget";
import ChatAnalytics from "../components/ChatAnalytics";

export default function Dashboard({filters, setFilters, filterOptions, setFilterOptions}) {
  return (
    <DashboardLayout filters={filters} setFilters={setFilters} options={filterOptions} >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Dashboard Overview</h1>
        {/* <Filters 
          filters={filters} 
          setFilters={setFilters} 
          options={filterOptions} 
        /> */}
      </div>

      <GridLayout>
        <InsightsAreaChart filters={filters} />
        <PestlePieChart filters={filters} />
        <SectorRadarChart filters={filters} />
      </GridLayout>
      <ChatAnalytics page="dashboard" filters={filters} />
      <AISummaryWidget page="dashboard" filters={filters} />
    </DashboardLayout>
  );
}

