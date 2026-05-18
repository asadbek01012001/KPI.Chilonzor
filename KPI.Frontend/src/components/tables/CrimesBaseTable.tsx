import React, { useLayoutEffect, useRef, useState } from "react";
import "./assets/crimes_table.scss";

interface TableRow {
  id: number;
  name: string;
  allPreventableArticleCount: string;
  countPrevLittleSocialRisk: string;
  countPrevNotHeavy: string;
  countPrevHeavy: string;
  countPrevVeryHeavy: string;
}

interface Totals {
  total_crimes: number;
  minor_crimes: number;
  medium_crimes: number;
  serious_crimes: number;
  critical_crimes: number;
}

interface Props {
  readonly data: any[];
  readonly totals?: Totals | null;
  readonly handleBlur: (value: any) => void;
}

const FIELDS: (keyof TableRow)[] = [
  "allPreventableArticleCount",
  "countPrevLittleSocialRisk",
  "countPrevNotHeavy",
  "countPrevHeavy",
  "countPrevVeryHeavy",
];

export default function CrimesTable({ data, totals, handleBlur }: Props) {
  const [editing, setEditing] = useState<{
    id: number;
    field: keyof TableRow;
  } | null>(null);
  const firstRowRef = useRef<HTMLTableRowElement>(null);
  const [subHeaderTop, setSubHeaderTop] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (firstRowRef.current)
        setSubHeaderTop(firstRowRef.current.offsetHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (firstRowRef.current) observer.observe(firstRowRef.current);
    return () => observer.disconnect();
  }, [data]);

  const t: any = totals ?? {
    total_total_crimes: data.reduce(
      (s, r) => s + (Number(r.total_crimes) || 0),
      0,
    ),
    total_minor_crimes: data.reduce(
      (s, r) => s + (Number(r.minor_crimes) || 0),
      0,
    ),
    total_medium_crimes: data.reduce(
      (s, r) => s + (Number(r.medium_crimes) || 0),
      0,
    ),
    total_serious_crimes: data.reduce(
      (s, r) => s + (Number(r.serious_crimes) || 0),
      0,
    ),
    total_critical_crimes: data.reduce(
      (s, r) => s + (Number(r.critical_crimes) || 0),
      0,
    ),
  };

  return (
    <div className="cr-container">
      <table className="cr-simple-table">
        <thead>
          <tr ref={firstRowRef}>
            <th className="cr-sticky-col cr-col-tr" rowSpan={2}>
              T.R
            </th>
            <th className="cr-sticky-col cr-col-name" rowSpan={2}>
              Маҳалла номи
            </th>
            <th className="cr-col-total" rowSpan={2}>
              Жами
            </th>
            <th className="cr-col-data" colSpan={4}>
              Шундан
            </th>
          </tr>
          <tr>
            <th className="cr-col-data" style={{ top: subHeaderTop }}>
              Ижтимоий хавфи катта бўлмаган
              <br />
              -5%
            </th>
            <th className="cr-col-data" style={{ top: subHeaderTop }}>
              Унча оғир бўлмаган жиноят
              <br />
              -10%
            </th>
            <th className="cr-col-data" style={{ top: subHeaderTop }}>
              Оғир жиноят
              <br />
              -15%
            </th>
            <th className="cr-col-data" style={{ top: subHeaderTop }}>
              Ўта оғир жиноят
              <br />
              -20%
            </th>
          </tr>
        </thead>
        <tbody>
          {data
            .sort((a, b) => b.total_crimes - a.total_crimes)
            .map((row, index) => (
              <tr key={row.id}>
                <td className="cr-sticky-col cr-col-tr">{index + 1}</td>
                <td className="cr-sticky-col cr-col-name">{row.mfyName}</td>
                {FIELDS.map((field) => (
                  <td
                    key={field}
                    onDoubleClick={() => setEditing({ id: row.id, field })}
                    className={
                      editing?.id === row.id && editing?.field === field
                        ? "is-editing"
                        : field === "allPreventableArticleCount"
                          ? "cr-col-total"
                          : "cr-col-data"
                    }
                  >
                    {editing?.id === row.id && editing?.field === field ? (
                      <input
                        autoFocus
                        defaultValue={row[field]}
                        onBlur={(e) => {
                          handleBlur({ ...row, [field]: e.target.value });
                          setEditing(null);
                        }}
                        onKeyDown={(e) =>
                          e.key === "Enter" && e.currentTarget.blur()
                        }
                      />
                    ) : (
                      row[field]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          {/* Totals row */}
          {/* <tr style={{ fontWeight: 700, background: "rgba(255,255,255,0.04)" }}>
            <td className="cr-sticky-col cr-col-tr" colSpan={2}>
              Жами
            </td>
            <td className="cr-col-total">{t.total_total_crimes}</td>
            <td className="cr-col-data">{t.total_minor_crimes}</td>
            <td className="cr-col-data">{t.total_medium_crimes}</td>
            <td className="cr-col-data">{t.total_serious_crimes}</td>
            <td className="cr-col-data">{t.total_critical_crimes}</td>
          </tr> */}
        </tbody>
      </table>
    </div>
  );
}
