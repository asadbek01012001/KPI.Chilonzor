import "./assets/ranking.scss";

export interface RankingRow {
  region_id: string;
  rank: number;
  region_name: string;
  total_score: number;
  trend: "up" | "down";
}

interface Props {
  title: string;
  average: number;
  rows: RankingRow[];
  activeId: string;
  setRegion: (id: string) => void;
}

const DashbaordRegionsTable = ({
  title,
  average,
  rows,
  activeId,
  setRegion,
}: Props) => {
  return (
    <div className="ranking-card">
      <div className="ranking-header">
        <span className="title">{title}</span>
        <div className="avg">
          Жами:
          <span>{average.toFixed(1)}</span>
        </div>
      </div>

      <div className="uz_ranking-table">
        <div className="ranking-row header">
          <div>№</div>
          <div>Маҳалла номи</div>
          <div className="text-center">Тўплаган балли</div>
        </div>

        {rows.map((row, index) => (
          <div
            key={row.region_id}
            className={`ranking-row ${index % 2 === 0 ? "even" : "odd"} ${row.region_id === activeId ? "active_row" : ""}`}
            onClick={() => setRegion(row.region_id)}
          >
            <div className="rank">
              <span className={`arrow ${row.trend}`}>
                {row.trend === "up" ? "↑" : "↓"}
              </span>
              {index + 1}
            </div>

            <div className="name">{row.region_name}</div>
            <div className="score text-center">
              {row.total_score.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashbaordRegionsTable;
