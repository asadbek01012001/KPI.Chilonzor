import "./assets/stat_card.scss";

export type StatCardProps = {
  value: string | number;
  label: string;
  percent?: number; // doira progress uchun
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning";
};

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  percent = 100,
  icon,
  variant = "default",
}) => {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-card__left">
        <div
          className="circle"
          style={{
            background: `conic-gradient(
              #36e3c9 ${percent * 3.6}deg,
              #1b2745 0deg
            )`,
          }}
        >
          <div className="circle__inner" />
        </div>
      </div>

      <div className="stat-card__content">
        <h3>{value}</h3>
        <span>{label}</span>
      </div>

      {icon && <div className="stat-card__icon">{icon}</div>}
    </div>
  );
};

export default StatCard;
