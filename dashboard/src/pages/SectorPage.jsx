import DashboardLayout from "../layout/DashboardLayout";
import GridLayout from "../layout/GridLayout";
import Filters from "../components/Filters";

import SectorDistribution from "../modules/sector/SectorDistribution";
import SectorIntensity from "../modules/sector/SectorIntensity";
import SectorLikelihood from "../modules/sector/SectorLikelihood";

export default function SectorPage({filters, setFilters, filterOptions, setFilterOptions}) {
  return (
    <DashboardLayout filters={filters} setFilters={setFilters} options={filterOptions} >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-700">Sector Analysis</h1>
        {/* <Filters /> */}
      </div>

      <GridLayout cols={2}>
        <SectorDistribution filters={filters} />
        <SectorIntensity filters={filters} />
        <div className="col-span-2">
          <SectorLikelihood filters={filters} />
        </div>
      </GridLayout>
    </DashboardLayout>
  );
}
