import DashboardLayout from "../layout/DashboardLayout";
import GridLayout from "../layout/GridLayout";
import Filters from "../components/Filters";

import CountryStats from "../modules/geographic/CountryStats";
import RegionHeatmap from "../modules/geographic/RegionHeatmap";
import SectorByRegion from "../modules/geographic/SectorByRegion";

export default function GeographicPage({filters, setFilters, filterOptions, setFilterOptions}) {
  return (
    <DashboardLayout filters={filters} setFilters={setFilters} options={filterOptions} >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-700">Geographic Analysis</h1>
        {/* <Filters /> */}
      </div>

      <GridLayout>
        <CountryStats filters={filters} />
        <RegionHeatmap filters={filters} />
        <SectorByRegion filters={filters} />
      </GridLayout>
    </DashboardLayout>
  );
}
