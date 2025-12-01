import DashboardLayout from "../layout/DashboardLayout";
import GridLayout from "../layout/GridLayout";

import SummaryKPIs from "../modules/summary/SummaryKPIs";
import MissingDataStats from "../modules/summary/MissingDataStats";
import AISummaryWidget from "../components/AISummaryWidget";

export default function SummaryPage({filters, setFilters, filterOptions, setFilterOptions}) {
  return (
    <DashboardLayout filters={filters} setFilters={setFilters} options={filterOptions} >
      <h1 className="text-3xl font-semibold text-gray-700 mb-6">Summary & Data Quality</h1>

      <GridLayout>
        <SummaryKPIs filters={filters} />
        <MissingDataStats filters={filters} />
      </GridLayout>
      <AISummaryWidget page="summary" filters={filters} />
    </DashboardLayout>
  );
}
