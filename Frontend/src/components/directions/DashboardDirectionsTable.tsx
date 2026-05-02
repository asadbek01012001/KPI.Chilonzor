import "./assets/score.scss";

export interface ScoreItem {
  direction_id: string;
  direction_name: string;
  indicator_count: number;
}

interface Props {
  items: ScoreItem[];
  activeId?: string;
  setRegion: (id: string) => void;
}

const DashboardDirectionsTable = ({ items, activeId, setRegion }: Props) => {
  return (
    <div className="score-list">
      {items.map((item, index) => (
        <div
          key={item.direction_id}
          className={`score-list__row 
            ${index % 2 === 0 ? "even" : "odd"}
            ${item.direction_id === activeId ? "active" : ""}
          `}
          onClick={() => setRegion(item.direction_id)}
        >
          <div className="score-list__left">
            <span className="dot" />
            <span className="title">{item.direction_name}</span>
          </div>

          <div className="score-list__right">{item.indicator_count}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardDirectionsTable;
