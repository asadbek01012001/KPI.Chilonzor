import { useParams } from "react-router-dom";
import "./assets/dashboard_table.scss";

export interface StatItem {
  label: string;
  percent: number;
  value: number;
  color: string;
}

export interface MahallaStat {
  id: number;
  name: string;
  rank: number;
  avgRank: number;
  sector: number;
  stats: StatItem[];
}

interface Props {
  readonly setRegion: (value: any) => void;
  readonly sectorId?: number;
  readonly type?: "increase" | "decrease";
  readonly rankingsData: MahallaStat[];
  readonly activeRegion?: string;
}

export default function DashboardRankingTable({
  setRegion,
  sectorId,
  type = "increase",
  rankingsData,
  activeRegion,
}: Props) {
  const { tab = "regions" } = useParams();

  const sortedByRank = sectorId
    ? [...rankingsData]
        .filter((item) => item.sector === sectorId)
        .sort((a, b) => a.rank - b.rank)
    : [...rankingsData].sort((a, b) => a.rank - b.rank);

  return (
    <div className="ranking-table">
      <div className="ranking-table__header">
        <div className="ranking-table__header-cell ranking-table__header-cell--rank">
          Ўрни
        </div>
        <div className="ranking-table__header-cell ranking-table__header-cell--name">
          Маҳалла номи
        </div>
        <div className="ranking-table__header-cell ranking-table__header-cell--score">
          <span className="ranking-table__header-line">
            {tab === "102"
              ? "Жами 102"
              : tab === "crimes"
                ? "Жами жиноятлар"
                : "Жами бал"}
          </span>
        </div>
        <div className="ranking-table__header-cell ranking-table__header-cell--score">
          <span className="ranking-table__header-line">Ўрта. ўрни</span>
        </div>
      </div>

      <div className="ranking-table__body">
        {sortedByRank.map((region: any, index) => {
          const limit = tab === "organs" ? 2 : 9;
          const length = tab === "organs" ? 3 : 10;
          const visualIndex =
            type === "decrease" ? sortedByRank.length - 1 - index : index;

          const isFirst = visualIndex <= limit;

          const isMiddle =
            visualIndex > limit && visualIndex < sortedByRank.length - length;

          const isSelected = activeRegion === region.region_id;

          return (
            <div
              key={index}
              className={`ranking-table__row ${isMiddle ? "ranking-table__row--middle" : isFirst ? "ranking-table__row--leader" : "ranking-table__row--last"} ${isSelected ? "ranking-table__row--selected" : ""} `}
              style={{
                animationDelay: `${index * 30}ms`,
              }}
              onClick={() => {
                setRegion(region);
              }}
            >
              <div className="ranking-table__cell ranking-table__cell--rank">
                <span className="ranking-table__rank-number">
                  {Boolean(index % 3 === 0) ? `↑${index + 1}` : `↓${index + 1}`}
                </span>
                <span className="ranking-table__rank-label">ўрин</span>
              </div>

              <div className="ranking-table__cell ranking-table__cell--name">
                {region.region_name}
              </div>

              <div className="ranking-table__cell ranking-table__cell--score">
                <div className="ranking-table__bar-wrapper">
                  <span className="ranking-table__score-value">
                    {Boolean(tab === "organs" || tab === "regions")
                      ? region?.total_score?.toFixed(1)
                      : region?.total}
                  </span>
                </div>
              </div>

              <div className="ranking-table__cell ranking-table__cell--score">
                <div className="ranking-table__bar-wrapper">
                  <span className="ranking-table__score-value">
                    {region?.average_rank?.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
