import { useEffect, useState } from "react";
import { useDashboardContext } from "../../api/dashboard/DashboardApiContext";
import moment from "moment";

import IIBCard, { getThemeByIndex } from "../ui/IIBCard";
import DashboardTable from "../tables/DashboardRankingTable";
import DashboardMapLayout from "./DashboardMapLayout";
import ChilonzorMap from "../ui/ChilonzorMap";

interface Props {
  readonly startDate?: Date | null;
  readonly endDate?: Date | null;
}

export default function DashboardOrgansTab({ startDate, endDate }: Props) {
  const [activeId, setActiveId] = useState<number>(1);
  const [sectors, setSectors] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);

  const { DashboardApi } = useDashboardContext();

  const dateRange = {
    from: moment(startDate).format("YYYY-MM-DD"),
    to: moment(endDate).format("YYYY-MM-DD"),
  };

  useEffect(() => {
    DashboardApi.getSectors(dateRange)
      .then((res) => setSectors(res))
      .catch(console.log);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DashboardApi, startDate, endDate]);

  useEffect(() => {
    DashboardApi.getMahalla({ ...dateRange, sector: activeId })
      .then((res) => setRegions(res))
      .catch(console.log);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DashboardApi, activeId, startDate, endDate]);

  const rankings = regions.map((r: any, i: number) => ({
    region_id: r.region_id,
    rank: i + 1,
  }));

  return (
    <div className="row h-100">
      <div className="col-3 h-100">
        <DashboardTable
          rankingsData={regions}
          sectorId={activeId}
          setRegion={() => {}}
        />
      </div>
      <div className="col-9 h-100 d-flex flex-column gap-3">
        <div style={{ height: "100%" }}>
          <DashboardMapLayout
            headerComponent={<div className="d-flex gap-2 justify-content-between" />}
            sidebarComponent={
              <div className="d-flex flex-column gap-4">
                {[...sectors]
                  .sort((a, b) => b.kpi_score - a.kpi_score)
                  .map((item, index) => (
                    <IIBCard
                      key={item.sector}
                      title={`${item.sector} - сон ИИБ`}
                      count={item.region_count}
                      score={item.kpi_score}
                      rank={index + 1}
                      theme={getThemeByIndex(index)}
                      isActive={activeId === item.id}
                      onClick={() => setActiveId((prev) => prev === item.sector ? 1 : item.sector)}
                    />
                  ))}
              </div>
            }
          >
            <ChilonzorMap
              setRegion={() => {}}
              sectorId={activeId}
              setSector={setActiveId}
              rankings={rankings}
              totalCount={regions.length}
              colorMode="iib"
            />
          </DashboardMapLayout>
        </div>
      </div>
    </div>
  );
}
