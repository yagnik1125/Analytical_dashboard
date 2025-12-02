import DashboardLayout from "../layout/DashboardLayout";
import GridLayout from "../layout/GridLayout";
import Filters from "../components/Filters";
import CorrelationMatrix from "../modules/correlation/CorrelationMatrix";
import IntensityRelevanceScatter from "../modules/correlation/IntensityRelevanceScatter";
import AISummaryWidget from "../components/AISummaryWidget";
import ChatAnalytics from "../components/ChatAnalytics";

export default function CorrelationPage({filters, setFilters, filterOptions, setFilterOptions}) {
  return (
    <DashboardLayout filters={filters} setFilters={setFilters} options={filterOptions} >
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-3xl font-semibold text-gray-700">Correlation Analysis</h1>
        {/* <Filters /> */}
      </div>

      <GridLayout>
        <CorrelationMatrix filters={filters} />
        <IntensityRelevanceScatter filters={filters} />
      </GridLayout>
      <ChatAnalytics page="correlation" filters={filters} />
      <AISummaryWidget page="correlation" filters={filters}/>
    </DashboardLayout>
  );
}
