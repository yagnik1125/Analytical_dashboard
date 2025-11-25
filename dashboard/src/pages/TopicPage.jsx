import DashboardLayout from "../layout/DashboardLayout";
import GridLayout from "../layout/GridLayout";
import Filters from "../components/Filters";

import TopicIntensity from "../modules/topic/TopicIntensity";
import TopicLikelihood from "../modules/topic/TopicLikelihood";
import TopTopics from "../modules/topic/TopTopics";

export default function TopicPage({filters, setFilters, filterOptions, setFilterOptions}) {
  return (
    <DashboardLayout filters={filters} setFilters={setFilters} options={filterOptions} >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-700">Topic Analysis</h1>
        {/* <Filters /> */}
      </div>

      <GridLayout cols={2}>
        <TopicIntensity filters={filters} />
        <TopicLikelihood filters={filters} />

        <div className="col-span-2">
          <TopTopics filters={filters} />
        </div>
      </GridLayout>
    </DashboardLayout>
  );
}
