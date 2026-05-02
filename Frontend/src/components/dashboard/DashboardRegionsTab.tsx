import { useCallback, useEffect, useState } from "react";
import { useDashboardContext } from "../../api/dashboard/DashboardApiContext";
import moment from "moment";

import DashboardTable from "../tables/DashboardRankingTable";
import ChilonzorMap from "../ui/ChilonzorMap";
import CrimeCard from "../ui/CrimeCard";
import StatCard from "../ui/StatCard";
import DashboardMapLayout from "./DashboardMapLayout";
import DailyChart from "../charts/DailyChart";

interface Props {
  readonly startDate?: Date | null;
  readonly endDate?: Date | null;
}

export default function DashboardRegionsTab({ startDate, endDate }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [regionInfo, setRegionInfo] = useState<any>({});
  const [regions, setRegions] = useState<any[]>([]);
  const [info, setInfo] = useState<any>();
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [activeMapRegion, setActiveMapRegion] = useState<string>("");

  const { DashboardApi } = useDashboardContext();

  const dateRange = {
    from: moment(startDate).format("YYYY-MM-DD"),
    to: moment(endDate).format("YYYY-MM-DD"),
  };

  useEffect(() => {
    DashboardApi.getMahalla(dateRange)
      .then((res) => setRegions(res))
      .catch(console.log);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DashboardApi, startDate, endDate]);

  // Chart: mahalla tanlanganda usha mahalla chart, aks holda district chart
  useEffect(() => {
    const loadChart = activeMapRegion
      ? DashboardApi.getChartRegionTimeline(activeMapRegion, dateRange)
      : DashboardApi.getChartDistrict(dateRange);

    loadChart
      .then((res) => {
        const items = res?.data ?? (Array.isArray(res) ? res : []);
        setDailyData(items.map((item: any) => ({
          date: item.label ?? item.date,
          score: item.total_score ?? item.score,
        })));
      })
      .catch(console.log);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DashboardApi, startDate, endDate, activeMapRegion]);

  useEffect(() => {
    DashboardApi.getInfo(dateRange)
      .then((res) => setInfo(res))
      .catch(console.log);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DashboardApi, startDate, endDate]);

  const selectRegion = useCallback(
    (value: any) => {
      if (!value?.region_id) return;
      DashboardApi.getRegionSummary(value.region_id, dateRange)
        .then((resSummary) => {
          setRegionInfo(resSummary);
          setSelectedRegion(value);
          setActiveMapRegion(value.region_id);
        })
        .catch(console.log);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [DashboardApi, startDate, endDate],
  );

  // Build rankings for map coloring
  const rankings = regions.map((r: any, i: number) => ({
    region_id: r.region_id,
    rank: i + 1, // assume already sorted by rank
  }));

  return (
    <div className="row h-100">
      <div className="col-3 h-100">
        <DashboardTable
          setRegion={selectRegion}
          rankingsData={regions}
          activeRegion={activeMapRegion}
        />
      </div>
      <div className="col-9 h-100 d-flex flex-column gap-3">
        <div style={{ height: "100%" }}>
          <DashboardMapLayout
            headerComponent={
              <div className="d-flex gap-2 justify-content-between">
                <StatCard value={info?.indicators?.parent_count} label="Жами кўрсаткичлар" percent={65} />
                <StatCard value={55} label="Маҳаллалар сони" percent={40} />
                <StatCard value={info?.directions_count} label="Йўналишлар сони" percent={info?.directions_count} variant="success" />
                <StatCard value={info?.leader?.region_name} label="Лидер маҳалла" variant="warning" />
              </div>
            }
            sidebarComponent={
              selectedRegion ? (
                <CrimeCard
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
              colorMode="mahalla"
            />
          </DashboardMapLayout>
        </div>
      </div>
      <div className="col-12 mt-5 pb-6">
        <DailyChart data={dailyData} />
      </div>
    </div>
  );
}
