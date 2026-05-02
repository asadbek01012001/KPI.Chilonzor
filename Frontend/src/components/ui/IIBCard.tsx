import "./assets/iib_card.scss";

// ─── Types ────────────────────────────────────────────────────────────────────
export type IIBCardTheme = "green" | "orange" | "blue" | "teal";

export interface IIBCardProps {
  title: string;
  count: number | string;
  score: number | string;
  rank?: number;
  label?: string;
  theme?: IIBCardTheme;
  isActive?: boolean;
  onClick?: () => void;
}

// ─── Theme cycle helper ───────────────────────────────────────────────────────
const THEMES: IIBCardTheme[] = ["green", "orange", "blue", "teal"];

export function getThemeByIndex(index: number): IIBCardTheme {
  return THEMES[index % THEMES.length];
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const HomeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10.707 2.293a1 1 0 0 1 1.414 0l9 9A1 1 0 0 1 20.414 13H19v8a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-5h-2v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8H3.586a1 1 0 0 1-.707-1.707l9-9z" />
  </svg>
);

// Bar chart icon — 3 bars with middle one tallest
const RankIcon = () => (
  <svg
    viewBox="0 8 18 10"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="10" width="4" height="7" rx="1" />
    <rect x="7" y="5" width="4" height="12" rx="1" />
    <rect x="13" y="8" width="4" height="9" rx="1" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
const IIBCard = ({
  title,
  count,
  score,
  rank,
  label = "Маҳаллар сони",
  theme = "green",
  isActive = false,
  onClick,
}: IIBCardProps) => {
  const classes = [
    "iib-card",
    `iib-card--${theme}`,
    isActive ? "iib-card--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} onClick={onClick}>
      <div className="iib-card__header">
        <div className="d-flex align-items-center gap-2">
          <div className="iib-card__icon-wrap">
            <HomeIcon />
          </div>
          <span className="iib-card__title">{title}</span>
        </div>
        <div className="iib-card__score">{Number(score).toFixed(1)}</div>
      </div>

      <div className="iib-card__count">{count}</div>

      <div className="iib-card__footer">
        <span className="iib-card__label">{label}</span>
        {rank !== undefined && (
          <div className="iib-card__rank">
            <span className="iib-card__rank-icon">
              <RankIcon />
            </span>
            <span className="iib-card__rank-text">{rank} ўрин</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IIBCard;
