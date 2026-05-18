import { useState, useCallback, useMemo } from "react";
import { polygonsData } from "../../constants/Polygons";

interface Props {
  readonly setRegion: (id: string) => void;
  readonly setSector?: (value: number) => void;
  readonly setSelected?: (value: string) => void;
  readonly sectorId?: number;
  readonly selected?: string;
  readonly rankings?: { region_id: string; rank: number }[];
  readonly totalCount?: number;
  readonly colorMode?: "mahalla" | "penalty" | "iib";
  readonly isOrgansType?: boolean;
  readonly viewBox?: string;
}

function computeArea(points: string): number {
  const pts = points
    .trim()
    .split(/\s+/)
    .map((p) => {
      const [x, y] = p.split(",").map(Number);
      return { x, y };
    });
  let area = 0;
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += pts[i].x * pts[j].y;
    area -= pts[j].x * pts[i].y;
  }
  return Math.abs(area / 2);
}

function areaFontSize(area: number): number {
  if (area > 8000) return 22;
  if (area > 4000) return 19;
  if (area > 1500) return 16;
  if (area > 600) return 14;
  return 12;
}

interface LabelItem {
  id: string;
  cx: number;
  cy: number;
  ox: number;
  oy: number;
  hw: number; // half-width
  hh: number; // half-height
}

function resolveCollisions(
  items: { id: string; x: number; y: number; text: string; fontSize: number }[],
): Map<string, { cx: number; cy: number; ox: number; oy: number }> {
  const PAD = 5;
  const pts: LabelItem[] = items.map((item) => ({
    id: item.id,
    cx: item.x,
    cy: item.y,
    ox: item.x,
    oy: item.y,
    hw: (item.text.length * item.fontSize * 0.58) / 2,
    hh: (item.fontSize * 1.25) / 2,
  }));

  for (let iter = 0; iter < 120; iter++) {
    let moved = false;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i];
        const b = pts[j];
        const dx = b.cx - a.cx;
        const dy = b.cy - a.cy;
        const overlapX = a.hw + b.hw + PAD - Math.abs(dx);
        const overlapY = a.hh + b.hh + PAD - Math.abs(dy);

        if (overlapX > 0 && overlapY > 0) {
          moved = true;
          if (overlapX < overlapY) {
            const push = overlapX / 2;
            const sign = dx >= 0 ? 1 : -1;
            a.cx -= sign * push;
            b.cx += sign * push;
          } else {
            const push = overlapY / 2;
            const sign = dy >= 0 ? 1 : -1;
            a.cy -= sign * push;
            b.cy += sign * push;
          }
        }
      }
    }
    if (!moved) break;
  }

  const result = new Map<
    string,
    { cx: number; cy: number; ox: number; oy: number }
  >();
  pts.forEach((p) =>
    result.set(p.id, { cx: p.cx, cy: p.cy, ox: p.ox, oy: p.oy }),
  );
  return result;
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
  isOrgansType = false,
  viewBox = "0 0 1400 1200",
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const handleHover = useCallback((id: string) => setHovered(id), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const areaMap = useMemo(() => {
    const m: Record<string, number> = {};
    polygonsData.forEach((p) => {
      m[p.id] = computeArea(p.points);
    });
    return m;
  }, []);

  const labelPositions = useMemo(
    () =>
      resolveCollisions(
        polygonsData.map((p) => ({
          id: p.id,
          x: p.labelX,
          y: p.labelY,
          text: p.name,
          fontSize: areaFontSize(areaMap[p.id] ?? 0),
        })),
      ),
    [areaMap],
  );

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
    green: { fill: "rgba(52,211,153,0.55)", stroke: "#34d399" },
    red: { fill: "rgba(248,113,113,0.55)", stroke: "#f87171" },
    yellow: { fill: "rgba(251,191,36,0.45)", stroke: "#fbbf24" },
    selected: { fill: "rgba(255,200,0,0.65)", stroke: "rgba(255,200,0,0.65)" },
    hovered: { fill: "rgba(200,170,50,0.55)", stroke: "#FBB62C" },
    default: { fill: "rgba(140,120,30,0.40)", stroke: "#FBB62C" },
  };

  const getColor = (id: string, _sectorId?: number, regionId?: string) => {
    const rid = regionId || id;
    if (selected === rid) return COLOR_MAP.selected;
    const rankColor = getRankColor(rid);
    if (rankColor) return COLOR_MAP[rankColor as keyof typeof COLOR_MAP];
    if (!colorMode && sectorId && _sectorId === sectorId)
      return { fill: "rgba(52,211,153,0.35)", stroke: "#34d399" };
    if (hovered === id) return COLOR_MAP.hovered;
    return COLOR_MAP.default;
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        .map-poly { transition: fill 0.25s, stroke 0.25s, filter 0.25s; cursor: pointer; }
        .map-poly:hover { filter: drop-shadow(0 0 8px rgba(255,200,0,0.4)); }
        .map-label { pointer-events: none; user-select: none; transition: opacity 0.2s; }
        .map-leader { pointer-events: none; }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.6) contrast(1.1)",
        }}
      />
      <div style={{ position: "absolute", inset: 0 }} />

      <svg
        viewBox={viewBox}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      >
        <defs>
          <filter id="glow">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="3"
              floodColor="#d4a017"
              floodOpacity="0.3"
            />
          </filter>
        </defs>

        {/* Polygons */}
        {polygonsData.map((p) => {
          if (isOrgansType && p.sector != sectorId) return null; // Hide labels for organs type when sector is selected
          const color = getColor(p.id, p.sector, p.regionId);
          const isSelected = selected === (p.regionId || p.id);
          const isHovered = hovered === p.id;
          return (
            <polygon
              key={p.id}
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
          );
        })}

        {/* Leader lines + Labels (rendered after polygons so they appear on top) */}
        {polygonsData.map((p) => {
          if (isOrgansType && p.sector != sectorId) return null; // Hide labels for organs type when sector is selected
          const pos = labelPositions.get(p.id);
          if (!pos) return null;
          const isHovered = hovered === p.id;
          const isSelected = selected === (p.regionId || p.id);
          const fontSize = areaFontSize(areaMap[p.id] ?? 0);
          const moved = Math.hypot(pos.cx - pos.ox, pos.cy - pos.oy) > 8;

          return (
            <g key={p.id}>
              {moved && (
                <line
                  className="map-leader"
                  x1={pos.ox}
                  y1={pos.oy}
                  x2={pos.cx}
                  y2={pos.cy}
                  stroke="rgba(255,240,200,0.35)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              )}
              <text
                className="map-label"
                x={pos.cx}
                y={pos.cy}
                fontFamily="Segoe UI, sans-serif"
                fontSize={fontSize}
                fill="rgba(255,240,200,0.95)"
                textAnchor="middle"
                dominantBaseline="middle"
                paintOrder="stroke"
                stroke="rgba(0,0,0,0.85)"
                strokeWidth="2.5px"
                strokeLinejoin="round"
                style={{ opacity: isHovered || isSelected ? 1 : 0.9 }}
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
