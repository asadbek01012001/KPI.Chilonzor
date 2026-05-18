import { useCallback, useEffect, useState } from "react";
import { useDashboardContext } from "../../api/dashboard/DashboardApiContext";
import moment from "moment";

import ChilonzorMap from "../ui/ChilonzorMap";
import DashboardMapLayout from "./DashboardMapLayout";
import MahallaDetail from "../ui/CrimeCard";
import Modal from "../ui/Modal";
import Loading from "../ui/Loading";

interface Props {
  readonly startDate?: Date | null;
  readonly endDate?: Date | null;
}

export default function Dashboard102Tab({ startDate, endDate }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [regionInfo, setRegionInfo] = useState<any>({});
  const [activeMapRegion, setActiveMapRegion] = useState<string>("");
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { DashboardApi } = useDashboardContext();

  const dateRange = {
    from: moment(startDate).format("YYYY-MM-DD"),
    to: moment(endDate).format("YYYY-MM-DD"),
  };

  useEffect(() => {
    setLoading(true);
    DashboardApi.getTop102(dateRange)
      .then((res) => {
        setRegions(
          res.map((item: any) => ({
            ...item,
            total_score: item.penalty_score,
            overall_rank: item.average_rank,
          })),
        );
      })
      .catch(console.log)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DashboardApi, startDate, endDate]);

  const handleClose = useCallback(() => {
    setSelectedRegion(null);
    setActiveMapRegion("");
  }, []);

  const selectRegion = useCallback(
    (value: any) => {
      if (!value?.region_id) return;
      DashboardApi.getRegionSummary(value.region_id, dateRange)
        .then((res) => {
          setRegionInfo(res);
          setSelectedRegion(value);
          setActiveMapRegion(value.region_id);
        })
        .catch(console.log);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [DashboardApi, startDate, endDate],
  );

  const rankings = regions.map((r: any, i: number) => ({
    region_id: r.region_id,
    rank: i + 1,
  }));

  if (loading) return <Loading />;

  return (
    <div style={{ height: "100%" }}>
      <DashboardMapLayout sidebarComponent={null}>
        <div style={{ position: "relative", height: "100%", width: "100%" }}>
          <ChilonzorMap
            setRegion={(id) => selectRegion({ region_id: id })}
            setSelected={setActiveMapRegion}
            selected={activeMapRegion}
            rankings={rankings}
            totalCount={regions.length}
            colorMode="penalty"
          />

          {/* Info card — top-right corner */}
          <div className="dash-info-card">
            <div className="dic-header">
              <div className="dic-badge">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <div className="dic-title">102 рейтинги</div>
                <div className="dic-subtitle">Сўровлар статистикаси</div>
              </div>
            </div>

            <div className="dic-stat">
              <span className="dic-stat-label">Жами маҳаллалар</span>
              <span className="dic-stat-value">{regions.length}</span>
            </div>

            {regions.length > 0 && (
              <>
                <div className="dic-divider" />
                <div className="dic-list-title">КЎП ЧАҚИРИҚ</div>
                {regions.slice(0, 3).map((r: any, i: number) => (
                  <div key={i} className="dic-region-item">
                    <span className="dic-region-rank">{i + 1}</span>
                    <span className="dic-region-name">
                      {r.region_name || r.name}
                    </span>
                    {r.total_score != null && (
                      <span className="dic-region-score">
                        {Number(r.total_score).toFixed(1)}
                      </span>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </DashboardMapLayout>

      <Modal isOpen={Boolean(selectedRegion)} onClose={handleClose}>
        <MahallaDetail data={regionInfo} onClose={handleClose} />
      </Modal>
    </div>
  );
}
