import DashboardLayout from "../layout/DashboardLayout";
import GridLayout from "../layout/GridLayout";
import Filters from "../components/Filters";

import PestleDistribution from "../modules/pestle/PestleDistribution";
import PestleIntensity from "../modules/pestle/PestleIntensity";
import PestleLikelihood from "../modules/pestle/PestleLikelihood";

export default function PestlePage({filters, setFilters, filterOptions, setFilterOptions}) {
  return (
    <DashboardLayout filters={filters} setFilters={setFilters} options={filterOptions} >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-700">PESTLE Analysis</h1>
        {/* <Filters /> */}
      </div>

      <GridLayout>
        <PestleDistribution filters={filters} />
        <PestleIntensity filters={filters} />
        <PestleLikelihood filters={filters} />
      </GridLayout>
    </DashboardLayout>
  );
}
