import { useCallback, useEffect, useState } from "react";
import { useDashboardContext } from "../../api/dashboard/DashboardApiContext";
import moment from "moment";

import ChilonzorMap from "../ui/ChilonzorMap";
import CrimeCard from "../ui/CrimeCard";
import DashboardMapLayout from "./DashboardMapLayout";
import DailyChart from "../charts/DailyChart";
import Modal from "../ui/Modal";
import Loading from "../ui/Loading";

interface Props {
  readonly startDate?: Date | null;
  readonly endDate?: Date | null;
}

export default function DashboardRegionsTab({ startDate, endDate }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [regionInfo, setRegionInfo] = useState<any>({});
  const [regions, setRegions] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [activeMapRegion, setActiveMapRegion] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const { DashboardApi } = useDashboardContext();

  const dateRange = {
    from: moment(startDate).format("YYYY-MM-DD"),
    to: moment(endDate).format("YYYY-MM-DD"),
  };

  useEffect(() => {
    setLoading(true);
    DashboardApi.getMahalla(dateRange)
      .then((res) => setRegions(res))
      .catch(console.log)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DashboardApi, startDate, endDate]);

  useEffect(() => {
    const loadChart = activeMapRegion
      ? DashboardApi.getChartRegionTimeline(activeMapRegion, dateRange)
      : DashboardApi.getChartDistrict(dateRange);

    loadChart
      .then((res) => {
        const items = res?.data ?? (Array.isArray(res) ? res : []);
        setDailyData(
          items.map((item: any) => ({
            date: item.label ?? item.date,
            score: item.total_score ?? item.score,
          })),
        );
      })
      .catch(console.log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DashboardApi, startDate, endDate, activeMapRegion]);

  useEffect(() => {
    DashboardApi.getInfo(dateRange).catch(console.log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DashboardApi, startDate, endDate]);

  const handleClose = useCallback(() => {
    setActiveMapRegion("");
    setSelectedRegion(null);
  }, []);

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

  const rankings = regions.map((r: any, i: number) => ({
    region_id: r.region_id,
    rank: i + 1,
  }));

  if (loading) return <Loading />;

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ height: "100%" }}>
        <DashboardMapLayout sidebarComponent={null}>
          <div style={{ position: "relative", height: "100%", width: "100%" }}>
            <ChilonzorMap
              setRegion={(id) => selectRegion({ region_id: id })}
              setSelected={setActiveMapRegion}
              selected={activeMapRegion}
              rankings={rankings}
              totalCount={regions.length}
              colorMode="mahalla"
            />

          </div>
        </DashboardMapLayout>
      </div>
      <div style={{ height: "50%" }}>
        <DailyChart data={dailyData} />
      </div>

      <Modal isOpen={Boolean(selectedRegion)} onClose={handleClose}>
        <CrimeCard data={regionInfo} onClose={handleClose} />
      </Modal>
    </div>
  );
}
