import DashboardLayout from "../layout/DashboardLayout";
import GridLayout from "../layout/GridLayout";

import SummaryKPIs from "../modules/summary/SummaryKPIs";
import MissingDataStats from "../modules/summary/MissingDataStats";

export default function SummaryPage({filters, setFilters, filterOptions, setFilterOptions}) {
  return (
    <DashboardLayout filters={filters} setFilters={setFilters} options={filterOptions} >
      <h1 className="text-3xl font-semibold text-gray-700 mb-6">Summary & Data Quality</h1>

      <GridLayout cols={2}>
        <SummaryKPIs filters={filters} />
        <MissingDataStats filters={filters} />
      </GridLayout>
    </DashboardLayout>
  );
}
