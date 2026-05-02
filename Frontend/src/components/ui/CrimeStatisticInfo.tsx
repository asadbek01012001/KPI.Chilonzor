interface Props {
  readonly icon?: string;
  readonly iconVariant?: string;
  readonly name?: string;
  readonly score?: string;
  readonly barWidth?: number;
  readonly value?: number;
}

export default function CrimeStatisticInfo({
  icon,
  iconVariant,
  name,
  score,
  barWidth,
  value,
}: Props) {
  return (
    <div className="mdc-stat-card">
      <div className="mdc-stat-card-top">
        <span className={`mdc-stat-icon mdc-stat-icon--${iconVariant}`}>
          {icon}
        </span>
        <span className="mdc-stat-card-label">{name}</span>
      </div>
      <div className="mdc-stat-card-bottom">
        <span className="mdc-stat-pct">{score}</span>
        <div className="mdc-stat-bar-wrap">
          <div
            className={`mdc-stat-bar mdc-stat-bar--${iconVariant}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <span className="mdc-stat-val">{value}</span>
      </div>
    </div>
  );
}
