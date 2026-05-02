import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import "./excel-reader.scss";
import { useParams } from "react-router-dom";
import { showToast } from "../ui/Toast";
import { useIndicatorContext } from "../../api/indicators/IndicatorApiContext";
import { useIndicatorValueContext } from "../../api/indicator-values/IndicatorValueApiContext";
import { useRegionContext } from "../../api/regions/RegionApiContext";

interface Props {
  onClose: () => void;
  onSaved?: () => void;
}

const fmt = (v: any) => (v == null ? "" : String(v));

function sheetNameToDate(name: string): string | null {
  const m = name.match(/^(\d{2})\.(\d{2})$/);
  if (!m) return null;
  return `2026-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
}

export default function ExcelReader({ onClose, onSaved }: Props) {
  const [fileName, setFileName] = useState("");
  const [sheets, setSheets] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[][]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [indicators, setIndicators] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);

  const bufferRef = useRef<ArrayBuffer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { tab = "2bf2251b-b58b-4d4a-96b9-451af302b7d4" } = useParams<{
    tab?: string;
  }>();
  const { IndicatorApi } = useIndicatorContext();
  const { IndicatorValueApi } = useIndicatorValueContext();
  const { RegionApi } = useRegionContext();

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const directionId =
      tab || window.location.pathname.split("/").filter(Boolean).pop() || "";
    if (!directionId) return;

    IndicatorApi.getFlatList(directionId)
      .then((res: any) => {
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setIndicators(list);
      })
      .catch(console.log);

    RegionApi.getAll()
      .then((res: any) =>
        setRegions(Array.isArray(res) ? res : (res?.data ?? [])),
      )
      .catch(console.log);
  }); // eslint-disable-line

  const parseSingleSheet = (buffer: ArrayBuffer, sheetName: string) => {
    setLoading(true);
    setTimeout(() => {
      try {
        const wb = XLSX.read(buffer, {
          type: "array",
          dense: true,
          cellDates: false,
          cellNF: false,
          cellHTML: false,
          sheets: sheetName,
        });

        const ws = wb.Sheets[sheetName];
        if (!ws) return;

        const raw: any[][] = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          defval: null,
          raw: true,
        }) as any[][];

        if (!raw.length) {
          setHeaders([]);
          setTableData([]);
          setActiveSheet(sheetName);
          return;
        }

        const maxCols = Math.min(
          raw.reduce((m, r) => Math.max(m, r.length), 0),
          60,
        );
        const hdrs = Array.from({ length: maxCols }, (_, i) =>
          raw[0]?.[i] != null ? String(raw[0][i]) : String.fromCharCode(65 + i),
        );
        const rows = raw
          .slice(1)
          .filter((r) => r[1] != null && String(r[1]).trim() !== "")
          .map((r) => Array.from({ length: maxCols }, (_, i) => r[i] ?? null));

        setHeaders(hdrs);
        setTableData(rows);
        setActiveSheet(sheetName);
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  const parseFile = (file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        bufferRef.current = buffer;

        const wbNames = XLSX.read(buffer, { type: "array", bookSheets: true });
        setFileName(file.name);
        setSheets(wbNames.SheetNames);
        setLoading(false);

        if (wbNames.SheetNames.length) {
          parseSingleSheet(buffer, wbNames.SheetNames[0]);
        }
      } catch {
        showToast("Excel faylni o'qishda xato", "error");
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const switchSheet = (name: string) => {
    if (!bufferRef.current) return;
    parseSingleSheet(bufferRef.current, name);
  };

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|xlsm|xlsb|ods|csv)$/i)) {
      showToast("Iltimos, Excel yoki CSV fayl yuklang", "error");
      return;
    }
    parseFile(file);
  };

  const handleReset = () => {
    setFileName("");
    setSheets([]);
    setActiveSheet("");
    setHeaders([]);
    setTableData([]);
    bufferRef.current = null;
  };

  const postIndicators = async () => {
    if (!indicators.length) {
      showToast("Indikatorlar yuklanmadi", "error");
      return;
    }
    if (!regions.length) {
      showToast("Hududlar yuklanmadi", "error");
      return;
    }
    if (!activeSheet) {
      showToast("Sheet tanlanmadi", "error");
      return;
    }

    const dateStr =
      sheetNameToDate(activeSheet) ?? new Date().toISOString().slice(0, 10);

    const items: any[] = [];

    tableData.forEach((row, rowIndex) => {
      const indicator = indicators[rowIndex];
      if (!indicator) return;

      // Col D (index 3) dan boshlab — regions bo'yicha
      // Col C (index 2) = Jami — o'tkazib yuboriladi
      regions.forEach((region, regionIndex) => {
        const colIndex = regionIndex + 3; // D=3, E=4, F=5...
        const rawVal = row[colIndex];
        if (rawVal == null || rawVal === "") return;
        const value = Number(String(rawVal).replace(",", "."));
        if (isNaN(value)) return;
        items.push({
          indicator_id: indicator.id,
          direction_id: tab,
          region_id: region.id,
          value,
          score: indicator.score || 0,
          date: dateStr,
        });
      });
    });

    if (!items.length) {
      showToast("Yuborishga ma'lumot yo'q", "error");
      return;
    }

    setSaving(true);
    try {
      const CHUNK = 400;
      for (let i = 0; i < items.length; i += CHUNK) {
        await IndicatorValueApi.bulkCreate(items.slice(i, i + CHUNK));
      }
      setSaving(false);
      showToast(`${items.length} ta ma'lumot saqlandi (${dateStr})`, "success");
      onSaved?.();
    } catch (err) {
      console.error(err);
      setSaving(false);
      showToast("Saqlashda xatolik yuz berdi", "error");
    }
  };

  const hasData = !!fileName;
  const activeDateStr = sheetNameToDate(activeSheet) ?? activeSheet;

  return (
    <div
      className="excel-reader"
      style={{ position: "fixed", inset: 0, zIndex: 1000 }}
    >
      <div className="excel-reader__header">
        <div className="excel-reader__header-left">
          <div className="excel-reader__header-icon">📊</div>
          <div>
            <div className="excel-reader__header-title">Excel Reader</div>
            <div className="excel-reader__header-subtitle">
              Sheet = sana · Ko'rsatkich × Hudud
            </div>
          </div>
        </div>
        <div className="excel-reader__meta">
          {hasData && (
            <>
              <span>📄 {fileName}</span>
              <span>{sheets.length} kun</span>
              <span>{tableData.length} qator</span>
              {activeDateStr && (
                <span style={{ color: "#00d4aa" }}>📅 {activeDateStr}</span>
              )}
            </>
          )}
          <button
            className="excel-reader__btn excel-reader__btn--secondary"
            style={{ padding: "6px 16px", fontSize: "13px" }}
            onClick={onClose}
          >
            ✕ Yopish
          </button>
        </div>
      </div>

      {loading && (
        <div className="excel-reader__loading">
          <div className="excel-reader__spinner" />
          <span>O'qilmoqda…</span>
        </div>
      )}

      {!loading && !hasData && (
        <div
          className="excel-reader__upload-zone"
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <div
            className={`excel-reader__drop-area${dragging ? " dragging" : ""}`}
          >
            <div className="excel-reader__upload-icon">📂</div>
            <div className="excel-reader__upload-text">Excel fayl yuklang</div>
            <div className="excel-reader__upload-hint">
              Har bir sheet = bitta kun
              <br />
              <strong>.xlsx · .xls · .xlsm</strong>
            </div>
            <button
              className="excel-reader__btn"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Fayl tanlash
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.xlsm,.xlsb,.ods,.csv"
            className="excel-reader__file-input"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {!loading && hasData && (
        <>
          <div className="excel-reader__toolbar">
            <div className="excel-reader__toolbar-left">
              <div className="excel-reader__toolbar-info">
                <strong>{tableData.length}</strong> qator ·{" "}
                {activeDateStr && (
                  <span style={{ color: "#00d4aa" }}>📅 {activeDateStr}</span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                className="excel-reader__btn excel-reader__btn--json"
                onClick={postIndicators}
                disabled={saving}
              >
                {saving ? "Saqlanmoqda…" : `Saqlash (${activeDateStr})`}
              </button>
              <button
                className="excel-reader__btn excel-reader__btn--secondary"
                onClick={handleReset}
              >
                ✕ Faylni yopish
              </button>
            </div>
          </div>

          {sheets.length > 0 && (
            <div
              className="excel-reader__sheets"
              style={{ overflowX: "auto", whiteSpace: "nowrap" }}
            >
              {sheets.map((s) => (
                <button
                  key={s}
                  className={`excel-reader__sheet-tab${s === activeSheet ? " excel-reader__sheet-tab--active" : ""}`}
                  onClick={() => switchSheet(s)}
                  style={{ minWidth: "60px" }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="excel-reader__table-wrapper">
            <table className="excel-reader__table">
              <thead className="excel-reader__thead">
                <tr>
                  <th className="excel-reader__th excel-reader__th--rownum">
                    #
                  </th>
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      className={`excel-reader__th${i < 3 ? " excel-reader__th--f" + (i + 1) : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.slice(0, 100).map((row, ri) => (
                  <tr key={ri} className="excel-reader__tr">
                    <td className="excel-reader__td excel-reader__td--rownum">
                      <span className="row-num">{ri + 2}</span>
                    </td>
                    {row.map((cell, ci) => (
                      <td key={ci} className="excel-reader__td">
                        <span className="excel-reader__cell-content">
                          {fmt(cell)}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
                {tableData.length === 0 && (
                  <tr>
                    <td
                      colSpan={headers.length + 1}
                      style={{
                        textAlign: "center",
                        padding: "48px",
                        color: "#6b7394",
                      }}
                    >
                      Ma'lumot topilmadi
                    </td>
                  </tr>
                )}
                {tableData.length > 100 && (
                  <tr>
                    <td
                      colSpan={headers.length + 1}
                      style={{
                        textAlign: "center",
                        padding: "8px",
                        color: "#6b7394",
                        fontSize: "12px",
                      }}
                    >
                      Ko'rsatilmoqda 100 / {tableData.length} — saqlashda
                      hammasi yuboriladi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
