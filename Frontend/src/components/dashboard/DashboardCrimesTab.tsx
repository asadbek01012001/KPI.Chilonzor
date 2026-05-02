import { useCallback, useEffect, useState } from "react";
import { useDashboardContext } from "../../api/dashboard/DashboardApiContext";
import moment from "moment";

import DashboardTable from "../tables/DashboardRankingTable";
import ChilonzorMap from "../ui/ChilonzorMap";
import DashboardMapLayout from "./DashboardMapLayout";
import MahallaDetail from "../ui/CrimeCard";

interface Props {
  readonly startDate?: Date | null;
  readonly endDate?: Date | null;
}

export default function DashboardCrimesTab({ startDate, endDate }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [regionInfo,     setRegionInfo]     = useState<any>({});
  const [activeMapRegion, setActiveMapRegion] = useState<string>("");
  const [regions, setRegions] = useState<any[]>([]);

  const { DashboardApi } = useDashboardContext();

  const dateRange = {
    from: moment(startDate).format("YYYY-MM-DD"),
    to:   moment(endDate).format("YYYY-MM-DD"),
  };

  useEffect(() => {
    DashboardApi.getTopCrimes(dateRange)
      .then((res) => {
        setRegions(res.map((item: any) => ({
          ...item,
          total_score:  item.penalty_score,
          overall_rank: item.average_rank,
        })));
      })
      .catch(console.log);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DashboardApi, startDate, endDate]);

  const selectRegion = useCallback((value: any) => {
    if (!value?.region_id) return;
    DashboardApi.getRegionSummary(value.region_id, dateRange)
      .then((res) => { setRegionInfo(res); setSelectedRegion(value); setActiveMapRegion(value.region_id); })
      .catch(console.log);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DashboardApi, startDate, endDate]);

  // rank=1 → eng ko'p jinoyat → qizil
  const rankings = regions.map((r: any, i: number) => ({
    region_id: r.region_id,
    rank: i + 1,
  }));

  return (
    <div className="row h-100">
      <div className="col-3 h-100">
        <DashboardTable
          rankingsData={regions}
          setRegion={selectRegion}
          activeRegion={activeMapRegion}
          type="decrease"
        />
      </div>
      <div className="col-9 h-100 d-flex flex-column gap-3">
        <div style={{ height: "100%" }}>
          <DashboardMapLayout
            sidebarComponent={
              selectedRegion ? (
                <MahallaDetail
                  data={regionInfo}
                  onClose={() => { setActiveMapRegion(""); setSelectedRegion(null); }}
                />
              ) : null
            }
          >
            <ChilonzorMap
              setRegion={(id) => selectRegion({ region_id: id })}
              setSelected={setActiveMapRegion}
              selected={activeMapRegion}
              rankings={rankings}
              totalCount={regions.length}
              colorMode="penalty"
            />
          </DashboardMapLayout>
        </div>
      </div>
    </div>
  );
}
