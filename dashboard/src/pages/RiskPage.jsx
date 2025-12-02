import DashboardLayout from "../layout/DashboardLayout";
import GridLayout from "../layout/GridLayout";
import Filters from "../components/Filters";

import HighRiskTopics from "../modules/risk/HighRiskTopics";
import LikelihoodVsIntensity from "../modules/risk/LikelihoodVsIntensity";
import RiskMatrix from "../modules/risk/RiskMatrix";
import AISummaryWidget from "../components/AISummaryWidget";
import ChatAnalytics from "../components/ChatAnalytics";

export default function RiskPage({filters, setFilters, filterOptions, setFilterOptions}) {
  return (
    <DashboardLayout filters={filters} setFilters={setFilters} options={filterOptions} >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-700">Risk Analysis</h1>
        {/* <Filters /> */}
      </div>

      <GridLayout>
        <HighRiskTopics filters={filters} />
        <LikelihoodVsIntensity filters={filters} />
        <RiskMatrix filters={filters} />
      </GridLayout>
      <ChatAnalytics page="risk" filters={filters} />
      <AISummaryWidget page="risk" filters={filters} />
    </DashboardLayout>
  );
}
