import React, { useState, useRef, useLayoutEffect } from "react";
import "./assets/emergency_table.scss";

interface EmergencyRow {
  id: number;
  region_name: string;
  total_calls_102: string;
  call_pi: string;
  iio_complaint: string;
}

interface Totals {
  total_calls_102: number;
  call_pi: number;
  iio_complaint: number;
  grand_total: number;
}

interface Props {
  readonly data: any[];
  readonly totals?: Totals | null;
  readonly handleBlur: (value: any) => void;
}

const FIELDS: (keyof EmergencyRow)[] = [
  "total_calls_102",
  "call_pi",
  "iio_complaint",
];

export default function EmergencyTable({ data, totals, handleBlur }: Props) {
  const [editing, setEditing] = useState<{
    id: number;
    field: keyof EmergencyRow;
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
    total_total_calls_102: data.reduce(
      (s, r) => s + (Number(r.total_calls_102) || 0),
      0,
    ),
    total_call_pi: data.reduce((s, r) => s + (Number(r.call_pi) || 0), 0),
    total_iio_complaint: data.reduce(
      (s, r) => s + (Number(r.iio_complaint) || 0),
      0,
    ),
  };

  const grandTotal =
    (t.total_total_calls_102 ?? 0) +
    (t.total_call_pi ?? 0) +
    (t.total_iio_complaint ?? 0);

  return (
    <div className="emg-container">
      <table className="emg-main-table">
        <thead>
          <tr ref={firstRowRef} className="emg-thead-row-1">
            <th className="emg-sticky-col emg-col-tr" rowSpan={2}>
              T.R
            </th>
            <th className="emg-sticky-col emg-col-name" rowSpan={2}>
              Маҳалла номи
            </th>
            <th className="emg-col-data emg-row-span" rowSpan={2}>
              Жами
            </th>
            <th colSpan={3} className="emg-col-sundan">
              Шундан
            </th>
          </tr>
          <tr className="emg-thead-row-2">
            <th className="emg-col-data" style={{ top: `${subHeaderTop}px` }}>
              Жами "102"
              <br />
              -0,1%
            </th>
            <th className="emg-col-data" style={{ top: `${subHeaderTop}px` }}>
              П.И ни чақириш
              <br />
              -1%
            </th>
            <th className="emg-col-data" style={{ top: `${subHeaderTop}px` }}>
              ИИОдан норози
              <br />
              -1%
            </th>
          </tr>
        </thead>
        <tbody>
          {data
            .sort((a, b) => b.total_calls - a.total_calls)
            .map((row, index) => (
              <tr key={row.id}>
                <td className="emg-sticky-col emg-col-tr">{index + 1}</td>
                <td className="emg-sticky-col emg-col-name">
                  {row.region_name}
                </td>
                <td className="emg-col-data">
                  {Number(row.total_calls_102 || 0) +
                    Number(row.call_pi || 0) +
                    Number(row.iio_complaint || 0)}
                </td>
                {FIELDS.map((field) => (
                  <td
                    key={field}
                    onDoubleClick={() => setEditing({ id: row.id, field })}
                    className={
                      editing?.id === row.id && editing?.field === field
                        ? "emg-is-editing"
                        : "emg-col-data"
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
          <tr style={{ fontWeight: 700, background: "rgba(255,255,255,0.04)" }}>
            <td className="emg-sticky-col emg-col-tr" colSpan={2}>
              Жами
            </td>
            <td className="emg-col-data">{grandTotal}</td>
            <td className="emg-col-data">{t.total_total_calls_102}</td>
            <td className="emg-col-data">{t.total_call_pi}</td>
            <td className="emg-col-data">{t.total_iio_complaint}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
