import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  JSX,
} from "react";
import "./assets/indicator_table.scss";

interface DirectionScore {
  score: number | null;
  orni: number | null;
}

interface MahallData {
  rank: number;
  name: string;
  [key: string]: any;
}

interface Direction {
  key: string;
  title: string;
  maxBall?: number;
  score: string;
}

interface IndicatorTableProps {
  directions: Direction[];
  tableData: MahallData[];
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
  onSelectDistrict,
  onCellChange,
}: IndicatorTableProps) {
  const [, setHovRow] = useState<number | null>(null);
  const [hovCol, setHovCol] = useState<number | null>(null);
  const [editCell, setEditCell] = useState<{ ri: number; ci: number } | null>(
    null,
  );
  const [editValue, setEditValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editCell]);

  const formatValue = (val: number | null) => {
    if (val === null || val === undefined) return "";
    return String(val);
  };

  const maxMap = useMemo(() => {
    const map: Record<string, number> = {};
    directions.forEach((dir) => {
      const vals = tableData.map((row) => {
        const d = row[dir.key] as DirectionScore | undefined;
        return d?.score ?? 0;
      });
      map[dir.key] = Math.max(...vals);
    });
    return map;
  }, [directions, tableData]);

  const getCellClass = useCallback(
    (dirKey: string, ball: number | null, ci: number): string => {
      const classes: string[] = [];
      if (hovCol === ci) classes.push("is-col-hover");
      if (ball === null || ball === undefined) return classes.join(" ");
      const maxVal = maxMap[dirKey] || 0;

      if (ball === maxVal && ball > 1) {
        classes.push("is-top-1");
      } else if (ball >= maxVal * 0.7 && ball > 1) {
        classes.push("is-top-3");
      } else if (ball <= 0.3) {
        classes.push("is-dim");
      }
      return classes.join(" ");
    },
    [hovCol, maxMap],
  );

  const handleDoubleClick = (
    ri: number,
    ci: number,
    currentValue: number | null,
  ) => {
    setEditCell({ ri, ci });
    setEditValue(
      currentValue !== null && currentValue !== undefined
        ? currentValue.toString()
        : "",
    );
  };

  const handleBlur = () => {
    if (editCell) {
      const { ri, ci } = editCell;
      const dir: any = directions[ri];
      const row = tableData[ci];
      const parsed =
        editValue.trim() === ""
          ? null
          : parseFloat(editValue.replace(",", "."));

      if (onCellChange && dir && row) {
        onCellChange(
          dir?.indicator_id,
          row?.id,
          dir?.max_score,
          parsed !== null && !isNaN(parsed) ? parsed : null,
        );
      }
    }
    setEditCell(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setEditCell(null);
      setEditValue("");
    }
  };

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
                  style={{
                    background: hovCol === ci ? "#1e2a42" : undefined,
                  }}
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
            {directions.reduce((allRows: JSX.Element[], dir: any, ri: any) => {
              const rowParity = ri % 2 === 0 ? "it-row--even" : "it-row--odd";

              allRows.push(
                <tr
                  key={ri}
                  className={`it-row ${rowParity}`}
                  onMouseEnter={() => setHovRow(ri)}
                  onMouseLeave={() => setHovRow(null)}
                >
                  <td className="it-td it-td--index">{ri + 1}</td>
                  <td className="it-td it-td--name">{dir.indicator_name}</td>
                  <td className="it-td it-td--ball">{dir.max_score}</td>

                  {tableData.map((row, ci) => {
                    const currentRegionIndex = dir?.regions?.findIndex(
                      (item: any) => item.region_id === row?.id,
                    );
                    const score = dir?.regions[currentRegionIndex]?.value;
                    const isEditing =
                      editCell?.ri === ri && editCell?.ci === ci;

                    return (
                      <td
                        key={`${ri}-${ci}`}
                        className={`it-td ${getCellClass(dir.key, score, ci)} ${isEditing ? "is-editing" : ""}`}
                        onDoubleClick={() => handleDoubleClick(ri, ci, score)}
                        onMouseEnter={() => setHovCol(ci)}
                        onMouseLeave={() => setHovCol(null)}
                      >
                        {isEditing ? (
                          <input
                            ref={inputRef}
                            type="text"
                            className="it-td__input"
                            value={editValue}
                            onChange={(e) =>
                              /^\d*$/.test(e.target.value) &&
                              setEditValue(e.target.value)
                            }
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                          />
                        ) : (
                          formatValue(score)
                        )}
                      </td>
                    );
                  })}
                </tr>,
              );

              // Children rows (if exist)
              if (dir.children && dir.children.length > 0) {
                dir.children.forEach((child: any, childIndex: any) => {
                  const childRowIndex: any = `${ri}-${childIndex}`;
                  const childRowParity =
                    (ri + childIndex + 1) % 2 === 0
                      ? "it-row--even"
                      : "it-row--odd";

                  allRows.push(
                    <tr
                      key={child.key}
                      className={`it-row ${childRowParity} it-row--child`}
                      onMouseEnter={() => setHovRow(childRowIndex)}
                      onMouseLeave={() => setHovRow(null)}
                    >
                      <td className="it-td it-td--index it-td--child-index"></td>
                      <td className="it-td it-td--name it-td--child-name">
                        {child.indicator_name}
                      </td>
                      <td className="it-td it-td--ball it-td--child-ball">
                        {child.score}
                      </td>

                      {tableData.map((row, ci) => {
                        const dirData = row[child.key] as
                          | DirectionScore
                          | undefined;
                        const score = dirData?.score ?? null;
                        const isEditing =
                          editCell?.ri === childRowIndex && editCell?.ci === ci;

                        return (
                          <td
                            key={`${childRowIndex}-${ci}`}
                            className={`it-td ${getCellClass(child.key, score, ci)} ${isEditing ? "is-editing" : ""} it-td--child-data`}
                            onDoubleClick={() =>
                              handleDoubleClick(childRowIndex, ci, score)
                            }
                            onMouseEnter={() => setHovCol(ci)}
                            onMouseLeave={() => setHovCol(null)}
                          >
                            {isEditing ? (
                              <input
                                ref={inputRef}
                                type="text"
                                className="it-td__input"
                                value={editValue}
                                onChange={(e) =>
                                  /^\d*$/.test(e.target.value) &&
                                  setEditValue(e.target.value)
                                }
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
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
