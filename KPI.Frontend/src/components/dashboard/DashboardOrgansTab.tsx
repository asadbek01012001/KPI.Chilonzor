import { useEffect, useState } from "react";
import { useDashboardContext } from "../../api/dashboard/DashboardApiContext";
import moment from "moment";

import DashboardMapLayout from "./DashboardMapLayout";
import ChilonzorMap from "../ui/ChilonzorMap";
import Loading from "../ui/Loading";

interface Props {
  readonly startDate?: Date | null;
  readonly endDate?: Date | null;
}

const SECTOR_CONFIGS = [
  { id: 1, viewBox: "0 500 900 700" },
  { id: 2, viewBox: "300 300 1500 5" },
  { id: 3, viewBox: "100 30 1200 600" },
  { id: 4, viewBox: "80 300 1200 600" },
];

export default function DashboardOrgansTab({ startDate, endDate }: Props) {
  const [activeId, setActiveId] = useState<number>(2);
  const [sectors, setSectors] = useState<any[]>([]);
  const [sectorRegions, setSectorRegions] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(true);

  const { DashboardApi } = useDashboardContext();

  const dateRange = {
    from: moment(startDate).format("YYYY-MM-DD"),
    to: moment(endDate).format("YYYY-MM-DD"),
  };

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      DashboardApi.getSectors(dateRange),
      ...SECTOR_CONFIGS.map((s) =>
        DashboardApi.getMahalla({ ...dateRange, sector: s.id }),
      ),
    ]).then(([sectorsResult, ...regionResults]) => {
      if (sectorsResult.status === "fulfilled") {
        setSectors(sectorsResult.value);
      }
      const map: Record<number, any[]> = {};
      regionResults.forEach((result, idx) => {
        map[SECTOR_CONFIGS[idx].id] =
          result.status === "fulfilled" ? result.value : [];
      });
      setSectorRegions(map);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DashboardApi, startDate, endDate]);

  // Rank sectors by kpi_score descending
  const rankedSectors = [...sectors].sort(
    (a, b) => (b.kpi_score ?? 0) - (a.kpi_score ?? 0),
  );

  if (loading) return <Loading />;

  return (
    <div style={{ height: "100%" }}>
      <DashboardMapLayout sidebarComponent={<div />}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            height: "100%",
            width: "100%",
            gap: "8px",
          }}
        >
          {SECTOR_CONFIGS.map((sector) => {
            const regions = sectorRegions[sector.id] ?? [];
            const rankings = regions.map((r: any, i: number) => ({
              region_id: r.region_id,
              rank: i + 1,
            }));

            // Sector summary data from getSectors
            const sectorData = sectors.find(
              (s: any) => (s.id ?? s.sector) === sector.id,
            );
            const sectorName =
              sectorData?.name || `IIB ${sector.id}-sektor`;
            const kpiScore = sectorData?.kpi_score;
            const regionCount = sectorData?.region_count ?? regions.length;
            const sectorRank =
              rankedSectors.findIndex(
                (s: any) => (s.id ?? s.sector) === sector.id,
              ) + 1;
            const topMfy = regions[0];

            return (
              <div
                key={sector.id}
                style={{
                  position: "relative",
                  border: `1px solid ${activeId === sector.id ? "rgba(36,115,189,0.55)" : "#475569"}`,
                  borderRadius: "4px",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  transition: "border-color 0.2s",
                  overflow: "hidden",
                }}
              >
                <ChilonzorMap
                  setRegion={() => {}}
                  sectorId={sector.id}
                  setSector={setActiveId}
                  rankings={rankings}
                  totalCount={regions.length}
                  colorMode="iib"
                  isOrgansType={true}
                  viewBox={sector.viewBox}
                />

                <div className="dash-info-card dash-info-card--sm">
                  <div className="dic-header">
                    <div className="dic-badge">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div>
                      <div className="dic-title">{sectorName}</div>
                      <div className="dic-subtitle">IIB sektori</div>
                    </div>
                  </div>

                  <div className="dic-stat">
                    <span className="dic-stat-label">O'rni</span>
                    <span className="dic-stat-value">
                      {sectorRank > 0 ? sectorRank : "—"}
                    </span>
                  </div>

                  <div className="dic-stat">
                    <span className="dic-stat-label">To'plagan bali</span>
                    <span className="dic-stat-value">
                      {kpiScore != null ? Number(kpiScore).toFixed(1) : "—"}
                    </span>
                  </div>

                  <div className="dic-stat">
                    <span className="dic-stat-label">MFYlar soni</span>
                    <span className="dic-stat-value">{regionCount}</span>
                  </div>

                  {topMfy && (
                    <div className="dic-stat">
                      <span className="dic-stat-label">Faol MFY</span>
                      <span
                        className="dic-stat-value"
                        style={{ fontSize: "13px", color: "#34d399", maxWidth: "120px", textAlign: "right", lineHeight: 1.2 }}
                      >
                        {topMfy.region_name || topMfy.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DashboardMapLayout>
    </div>
  );
}
