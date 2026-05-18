import React, {
  useState,
  useMemo,
  useCallback,
  JSX,
} from "react";
import "./assets/indicator_table.scss";

interface Direction {
  key: string;
  title: string;
  maxBall?: number;
  score: string;
}

interface MahallData {
  rank: number;
  name: string;
  [key: string]: any;
}

interface IndicatorTableProps {
  directions: Direction[];
  tableData: MahallData[];
  mode?: "oneDay" | "timePeriod";
  onSelectDistrict?: (name: string) => void;
  onCellChange?: (
    rowRank: string,
    dirKey: string,
    score: number,
    value: number | null,
  ) => void;
}

export function WorkDoneBaseTable({
  directions,
  tableData,
  mode = "timePeriod",
  onSelectDistrict,
  onCellChange,
}: IndicatorTableProps) {
  const [hovCol, setHovCol] = useState<number | null>(null);

  const formatValue = (val: number | null | undefined) => {
    if (val === null || val === undefined) return "";
    return String(val);
  };

  const maxMap = useMemo(() => {
    const map: Record<string, number> = {};
    directions.forEach((dir: any) => {
      const vals = tableData.map((row) => {
        const idx = dir?.regions?.findIndex((r: any) => r.region_id === row?.id);
        return idx !== undefined && idx !== -1 ? (dir.regions[idx]?.value ?? 0) : 0;
      });
      map[dir.indicator_id ?? dir.key] = Math.max(0, ...vals);
    });
    return map;
  }, [directions, tableData]);

  const getCellClass = useCallback(
    (dirKey: string, score: number | null, ci: number): string => {
      const classes: string[] = [];
      if (hovCol === ci) classes.push("is-col-hover");
      if (score === null || score === undefined) return classes.join(" ");
      const maxVal = maxMap[dirKey] || 0;
      if (score === maxVal && score > 1)       classes.push("is-top-1");
      else if (score >= maxVal * 0.7 && score > 1) classes.push("is-top-3");
      else if (score <= 0.3)                   classes.push("is-dim");
      return classes.join(" ");
    },
    [hovCol, maxMap],
  );

  const showInput = mode === "oneDay";

  return (
    <div className="ind-table">
      <div className="ind-table__scroll">
        <table className="it-table">
          <thead className="it-thead">
            <tr>
              <th className="it-th it-th--index">No</th>
              <th className="it-th it-th--name">Кўрсаткич номи</th>
              <th className="it-th it-th--ball">Балл</th>
              {tableData.map((row, ci) => (
                <th
                  key={ci}
                  className="it-th"
                  style={{ background: hovCol === ci ? "#1e2a42" : undefined }}
                  onClick={() => onSelectDistrict?.(row.name)}
                  onMouseEnter={() => setHovCol(ci)}
                  onMouseLeave={() => setHovCol(null)}
                >
                  <span className="it-th__text">{row.name}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {(directions as any[]).reduce((allRows: JSX.Element[], dir: any, ri: number) => {
              const rowParity = ri % 2 === 0 ? "it-row--even" : "it-row--odd";
              const dirKey    = dir.indicator_id ?? dir.key;

              allRows.push(
                <tr
                  key={`row-${ri}`}
                  className={`it-row ${rowParity}`}
                >
                  <td className="it-td it-td--index">{ri + 1}</td>
                  <td className="it-td it-td--name">{dir.indicator_name}</td>
                  <td className="it-td it-td--ball">{dir.max_score}</td>

                  {tableData.map((row, ci) => {
                    const regionIdx = dir?.regions?.findIndex(
                      (item: any) => item.region_id === row?.id,
                    ) ?? -1;
                    const score = regionIdx !== -1 ? dir.regions[regionIdx]?.value : null;

                    return (
                      <td
                        key={`${ri}-${ci}`}
                        className={`it-td ${getCellClass(dirKey, score, ci)}`}
                        onMouseEnter={() => setHovCol(ci)}
                        onMouseLeave={() => setHovCol(null)}
                      >
                        {showInput ? (
                          <input
                            type="text"
                            className="it-td__input"
                            defaultValue={formatValue(score)}
                            onBlur={(e) => {
                              const parsed = parseFloat(e.target.value.replace(",", "."));
                              if (onCellChange && dir && row) {
                                onCellChange(
                                  dir.indicator_id,
                                  row.id,
                                  dir.max_score,
                                  !isNaN(parsed) ? parsed : null,
                                );
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                            }}
                          />
                        ) : (
                          formatValue(score)
                        )}
                      </td>
                    );
                  })}
                </tr>,
              );

              // Children rows
              if (dir.children && dir.children.length > 0) {
                dir.children.forEach((child: any, childIndex: number) => {
                  const childKey      = child.indicator_id ?? child.key;
                  const childRowIndex = `${ri}-${childIndex}`;
                  const childParity   = (ri + childIndex + 1) % 2 === 0 ? "it-row--even" : "it-row--odd";

                  allRows.push(
                    <tr
                      key={`child-${childRowIndex}`}
                      className={`it-row ${childParity} it-row--child`}
                    >
                      <td className="it-td it-td--index it-td--child-index"></td>
                      <td className="it-td it-td--name it-td--child-name">
                        {child.indicator_name}
                      </td>
                      <td className="it-td it-td--ball it-td--child-ball">
                        {child.max_score ?? child.score}
                      </td>

                      {tableData.map((row, ci) => {
                        const regionIdx = child?.regions?.findIndex(
                          (item: any) => item.region_id === row?.id,
                        ) ?? -1;
                        const score = regionIdx !== -1 ? child.regions[regionIdx]?.value : null;

                        return (
                          <td
                            key={`${childRowIndex}-${ci}`}
                            className={`it-td ${getCellClass(childKey, score, ci)} it-td--child-data`}
                            onMouseEnter={() => setHovCol(ci)}
                            onMouseLeave={() => setHovCol(null)}
                          >
                            {showInput ? (
                              <input
                                type="text"
                                className="it-td__input"
                                defaultValue={formatValue(score)}
                                onBlur={(e) => {
                                  const parsed = parseFloat(e.target.value.replace(",", "."));
                                  if (onCellChange && child && row) {
                                    onCellChange(
                                      child.indicator_id,
                                      row.id,
                                      child.max_score,
                                      !isNaN(parsed) ? parsed : null,
                                    );
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                                }}
                              />
                            ) : (
                              formatValue(score)
                            )}
                          </td>
                        );
                      })}
                    </tr>,
                  );
                });
              }

              return allRows;
            }, [])}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkDoneBaseTable;
