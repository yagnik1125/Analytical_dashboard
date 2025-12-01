import DashboardLayout from "../layout/DashboardLayout";
import GridLayout from "../layout/GridLayout";
import Filters from "../components/Filters";

import InsightsPerYear from "../modules/time/InsightsPerYear";
import IntensityByYear from "../modules/time/IntensityByYear";
import RelevanceOverYears from "../modules/time/RelevanceOverYears";
import AISummaryWidget from "../components/AISummaryWidget";

export default function TimePage({filters, setFilters, filterOptions, setFilterOptions}) {
  return (
    <DashboardLayout filters={filters} setFilters={setFilters} options={filterOptions} >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-700">Time-Based Analysis</h1>
        {/* <Filters /> */}
      </div>

      <GridLayout>
        <InsightsPerYear filters={filters} />
        <IntensityByYear filters={filters} />
        <RelevanceOverYears filters={filters} />
      </GridLayout>
      <AISummaryWidget page="time" filters={filters} />
    </DashboardLayout>
  );
}
