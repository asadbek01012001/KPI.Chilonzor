import { useState, useCallback } from "react";
import { polygonsData } from "../../constants/Polygons";

interface Props {
  readonly setRegion: (id: string) => void;
  readonly setSector?: (value: number) => void;
  readonly setSelected?: (value: string) => void;
  readonly sectorId?: number;
  readonly selected?: string;
  // rankings: sorted array of {region_id, rank} — rank=1 is best
  readonly rankings?: { region_id: string; rank: number }[];
  readonly totalCount?: number;
  // mode: 'mahalla' = top10/bottom10, 'iib' = top3/bottom3
  // mahalla: top10=green, bottom10=red
  // penalty: top10=red,   bottom10=green  (jinoyat/102 — ko'p = yomon)
  // iib:     top3=green,  bottom3=red
  readonly colorMode?: "mahalla" | "penalty" | "iib";
}

export default function ChilonzorMap({
  setRegion,
  setSector,
  sectorId,
  selected,
  setSelected,
  rankings = [],
  totalCount,
  colorMode,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const handleHover = useCallback((id: string) => setHovered(id), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const getRankColor = (regionId: string): string | null => {
    if (!rankings.length || !colorMode) return null;
    const entry = rankings.find((r) => r.region_id === regionId);
    if (!entry) return null;
    const total = totalCount ?? rankings.length;
    const rank = entry.rank;

    if (colorMode === "mahalla") {
      if (rank <= 10) return "green";
      if (rank > total - 10) return "red";
      return "yellow";
    }
    if (colorMode === "penalty") {
      if (rank <= 10) return "red";
      if (rank > total - 10) return "green";
      return "yellow";
    }
    if (colorMode === "iib") {
      if (rank <= 3) return "green";
      if (rank > total - 3) return "red";
      return "yellow";
    }
    return null;
  };

  const COLOR_MAP = {
    green:  { fill: "rgba(52,211,153,0.55)",  stroke: "#34d399" },
    red:    { fill: "rgba(248,113,113,0.55)",  stroke: "#f87171" },
    yellow: { fill: "rgba(251,191,36,0.45)",   stroke: "#fbbf24" },
    selected:{ fill: "rgba(255,200,0,0.65)",   stroke: "rgba(255,200,0,0.65)" },
    hovered: { fill: "rgba(200,170,50,0.55)",  stroke: "#FBB62C" },
    default: { fill: "rgba(140,120,30,0.40)",  stroke: "#FBB62C" },
  };

  const getColor = (id: string, _sectorId?: number, regionId?: string) => {
    const resolvedId = regionId || id;

    if (selected === resolvedId) return COLOR_MAP.selected;
    if (sectorId && _sectorId === sectorId) return { fill: "green", stroke: "#8d8d8d" };

    const rankColor = getRankColor(resolvedId);
    if (rankColor) return COLOR_MAP[rankColor as keyof typeof COLOR_MAP];

    if (hovered === id) return COLOR_MAP.hovered;
    return COLOR_MAP.default;
  };

  return (
    <div style={{ width: "100%", height: "94%", position: "relative", overflow: "hidden", fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        .map-poly { transition: fill 0.25s, stroke 0.25s, filter 0.25s; cursor: pointer; }
        .map-poly:hover { filter: drop-shadow(0 0 8px rgba(255,200,0,0.4)); }
        .map-label { pointer-events: none; user-select: none; transition: opacity 0.2s; }
      `}</style>

      <div style={{ position: "absolute", inset: 0, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.6) contrast(1.1)" }} />
      <div style={{ position: "absolute", inset: 0 }} />

      <svg viewBox="0 0 1400 1200" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}>
        <defs>
          <filter id="glow">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#d4a017" floodOpacity="0.3" />
          </filter>
        </defs>

        {polygonsData.map((p) => {
          const color = getColor(p.id, p.sector, p.regionId);
          const isSelected = selected === (p.regionId || p.id);
          const isHovered = hovered === p.id;
          return (
            <g key={p.id}>
              <polygon
                className="map-poly"
                points={p.points}
                fill={color.fill}
                stroke={color.stroke}
                strokeWidth={isSelected || isHovered ? 4 : 2}
                filter={isSelected ? "url(#glow)" : undefined}
                onMouseEnter={() => handleHover(p.id)}
                onMouseLeave={handleLeave}
                onClick={() => {
                  setSelected?.(p.regionId);
                  setRegion(p.regionId);
                  setSector?.(p.sector);
                }}
              />
              <text
                className="map-label"
                x={p.labelX}
                y={p.labelY}
                fontFamily="Segoe UI, sans-serif"
                fontSize={(p.fontSize ?? 8) + 2}
                fill="rgba(255,240,200,0.85)"
                textAnchor="middle"
                fontWeight="600"
                paintOrder="stroke"
                stroke="rgba(0,0,0,0.7)"
                strokeWidth="2.5px"
                strokeLinejoin="round"
                style={{ opacity: isHovered || isSelected ? 1 : 0.8 }}
              >
                {p.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
