import "./assets/indicator.scss";

export interface IndicatorRow {
  indicator_id: string;
  index: string;
  indicator_name: string;
  total_value: number;
  achieved_score: number;
}

interface Props {
  title: string;
  average: number;
  rows: IndicatorRow[];
}

const DashboardIndicatorTable = ({ title, average, rows }: Props) => {
  return (
    <div className="indicator-card">
      {/* HEADER */}
      <div className="indicator-header">
        <span className="indicator-title">{title}</span>

        <div className="indicator-avg">
          Жами:
          <span>{average.toFixed(1)}</span>
        </div>
      </div>

      {/* TABLE */}
      <div className="indicator-table">
        <div className="indicator-row header">
          <div>№</div>
          <div>Кўрсаткич</div>
          <div className="text-center">Тўплаган балли</div>
        </div>

        {rows.map((row, i) => (
          <div
            key={row.indicator_id}
            className={`indicator-row ${i % 2 === 0 ? "even" : "odd"}`}
          >
            <div className="col-index">{i + 1}</div>
            <div className="col-title">{row.indicator_name}</div>
            <div className="col-score text-center">
              {row.achieved_score.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardIndicatorTable;
