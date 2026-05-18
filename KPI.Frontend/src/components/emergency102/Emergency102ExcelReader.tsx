import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import "./cwx-reader.scss";
import { useEmergency102Context } from "../../api/emergency102/Emergency102ApiContext";
import { useRegionContext } from "../../api/regions/RegionApiContext";
import { showToast } from "../ui/Toast";

const COL_B = 1;
const COL_C = 2;
const COL_W = 22;
const COL_X = 23;
const START_ROW = 3;

type CellVal = string | number | boolean | null;
interface RowData { B: CellVal; C: CellVal; W: CellVal; X: CellVal; }
interface AggregatedRow { region_id: string; region_name: string; total_calls_102: number; call_pi: number; iio_complaint: number; }
interface Props { onClose: () => void; onSaved?: () => void; }

const fmt = (v: CellVal) => (v == null ? "" : String(v));
const toNum = (v: CellVal) => { const n = Number(v); return isNaN(n) ? 0 : n; };

// Pozitsiya bo'yicha: rows[i] → regions[i]
function aggregateRows(rows: RowData[], regions: any[]): AggregatedRow[] {
  return rows.map((row, i) => {
    const region = regions[i];
    if (!region) return null;
    return {
      region_id:       region.id,
      region_name:     region.name,
      total_calls_102: toNum(row.C),
      call_pi:         toNum(row.W),
      iio_complaint:   toNum(row.X),
    };
  }).filter(Boolean) as AggregatedRow[];
}

// unmatchedCount uchun (endi hech kim topilmagan bo'lmaydi)
function matchRegion(_name: CellVal, _regions: any[]): any { return true; }

function sheetNameToDate(name: string): string | null {
  const m = name.match(/^(\d{2})\.(\d{2})$/);
  if (!m) return null;
  return `2026-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
}

const Emergency102ExcelReader: React.FC<Props> = ({ onClose, onSaved }) => {
  const [rows,        setRows]        = useState<RowData[]>([]);
  const [aggregated,  setAggregated]  = useState<AggregatedRow[]>([]);
  const [editingCell, setEditingCell] = useState<{ row: number; col: keyof RowData } | null>(null);
  const [editValue,   setEditValue]   = useState("");
  const [loading,     setLoading]     = useState(false);
  const [dragging,    setDragging]    = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fileName,    setFileName]    = useState("");
  const [sheets,      setSheets]      = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState("");
  const [regions,     setRegions]     = useState<any[]>([]);

  const { Emergency102Api } = useEmergency102Context();
  const { RegionApi }       = useRegionContext();
  const wbRef        = useRef<XLSX.WorkBook | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);
  const clickTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCount   = useRef(0);

  useEffect(() => {
    RegionApi.getAll()
      .then((res: any) => setRegions(Array.isArray(res) ? res : (res?.data || [])))
      .catch(console.log);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (rows.length && regions.length) setAggregated(aggregateRows(rows, regions));
  }, [rows, regions]);

  useEffect(() => {
    if (editingCell && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); }
  }, [editingCell]);

  const parseSheet = (wb: XLSX.WorkBook, sheetName: string) => {
    const ws = wb.Sheets[sheetName];
    const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: false }) as CellVal[][];
    setRows(raw.slice(START_ROW).filter((r) => r[COL_B] != null && String(r[COL_B]).trim() !== "")
      .map((r) => ({ B: r[COL_B] ?? null, C: r[COL_C] ?? null, W: r[COL_W] ?? null, X: r[COL_X] ?? null })));
    setEditingCell(null);
  };

  const parseFile = (file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: "array" });
        wbRef.current = wb;
        const names = wb.SheetNames;
        setSheets(names);
        setActiveSheet(names[0]);
        setFileName(file.name);
        parseSheet(wb, names[0]);
      } catch (err) {
        console.error(err);
        showToast("Excel faylni o'qishda xato yuz berdi", "error");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const switchSheet = (name: string) => {
    if (!wbRef.current || name === activeSheet) return;
    setActiveSheet(name);
    parseSheet(wbRef.current, name);
  };

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|xlsm|xlsb|ods|csv)$/i)) { showToast("Iltimos, Excel yoki CSV fayl yuklang", "error"); return; }
    parseFile(file);
  };

  const handleReset = () => {
    setRows([]); setAggregated([]); setFileName(""); setEditingCell(null);
    setSheets([]); setActiveSheet(""); wbRef.current = null;
  };

  const COLS: (keyof RowData)[] = ["B", "C", "W", "X"];

  const handleCellClick = (row: number, col: keyof RowData) => {
    clickCount.current++;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      if (clickCount.current >= 2) { setEditValue(rows[row]?.[col] != null ? String(rows[row][col]) : ""); setEditingCell({ row, col }); }
      clickCount.current = 0;
    }, 230);
  };

  const commitEdit = () => {
    if (!editingCell) return;
    const { row, col } = editingCell;
    setRows((prev) => { const next = [...prev]; next[row] = { ...next[row], [col]: editValue }; return next; });
    setEditingCell(null);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter")  { commitEdit(); return; }
    if (e.key === "Escape") { setEditingCell(null); return; }
    if (e.key === "Tab") {
      e.preventDefault(); commitEdit();
      if (editingCell) {
        const idx = COLS.indexOf(editingCell.col);
        if (idx + 1 < COLS.length) { const v = rows[editingCell.row]?.[COLS[idx + 1]]; setEditValue(v != null ? String(v) : ""); setEditingCell({ row: editingCell.row, col: COLS[idx + 1] }); }
      }
    }
  };

  const postData = async () => {
    // aggregated state async bo'lgani uchun rows dan to'g'ridan hisoblaymiz
    const current = aggregateRows(rows, regions);
    if (!current.length) { showToast("Yuborishga ma'lumot yo'q", "error"); return; }
    const dateStr = sheetNameToDate(activeSheet) ?? new Date().toISOString().slice(0, 10);
    const items = current
      .map((a) => ({ region_id: a.region_id, total_calls_102: a.total_calls_102, call_pi: a.call_pi, iio_complaint: a.iio_complaint, date: dateStr }));
    if (!items.length) { showToast("Yuborishga ma'lumot yo'q", "error"); return; }
    setSaving(true);
    try {
      await Emergency102Api.bulkCreate(items);
      setSaving(false);
      showToast(`${items.length} ta hudud saqlandi (${dateStr})`, "success");
    } catch (err: any) {
      console.error(err);
      setSaving(false);
      showToast("Saqlashda xatolik yuz berdi", "error");
    }
  };

  const hasData = fileName !== "";
  const unmatchedCount = rows.filter((r) => !matchRegion(r.B, regions)).length;
  const activeDateStr = sheetNameToDate(activeSheet) ?? activeSheet;

  return (
    <div className="cwx-reader" style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
      <div className="cwx-reader__header">
        <div className="cwx-reader__header-left">
          <div className="cwx-reader__header-badge"><span className="cwx-reader__header-dot" />B · C · W · X</div>
          <div>
            <div className="cwx-reader__header-title">102 Xizmat — Excel yuklash</div>
            <div className="cwx-reader__header-sub">B=Region · C=Jami 102 · W=PI norozi · X=IIO norozi</div>
          </div>
        </div>
        <div className="cwx-reader__meta">
          {hasData && (<>
            <span>📄 {fileName}</span>
            <span>{rows.length} qator</span>
            <span>{aggregated.length} hudud</span>
            {activeDateStr && <span style={{ color: "#00d4aa" }}>📅 {activeDateStr}</span>}
            {unmatchedCount > 0 && <span style={{ color: "#f87171", background: "#2e1a1a" }}>⚠ {unmatchedCount} topilmadi</span>}
          </>)}
          <span style={{ cursor: "pointer" }} onClick={() => { onSaved?.(); onClose(); }}>✕ Yopish</span>
        </div>
      </div>

      {loading && (<div className="cwx-reader__loading"><div className="cwx-reader__spinner" /><span>Fayl o'qilmoqda…</span></div>)}

      {!loading && !hasData && (
        <div className="cwx-reader__upload-zone" onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onClick={() => fileInputRef.current?.click()}>
          <div className={`cwx-reader__drop-area${dragging ? " dragging" : ""}`}>
            <div className="cwx-reader__upload-icon">📂</div>
            <div className="cwx-reader__upload-cols"><span>B</span><span>C</span><span>W</span><span>X</span></div>
            <div className="cwx-reader__upload-text">Excel fayl yuklang</div>
            <div className="cwx-reader__upload-hint">Faylni bu yerga tashlang yoki bosing<br /><strong>.xlsx · .xls · .xlsm · .csv</strong></div>
            <button className="cwx-reader__btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Fayl tanlash</button>
          </div>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.xlsm,.xlsb,.ods,.csv" className="cwx-reader__file-input"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
        </div>
      )}

      {!loading && hasData && !showPreview && (
        <>
          <div className="cwx-reader__toolbar">
            <div className="cwx-reader__toolbar-left">
              <div className="cwx-reader__toolbar-info">Jami: <strong>{rows.length}</strong> qator · <strong style={{ color: "#00d4aa" }}>{aggregated.length}</strong> hudud</div>
              {unmatchedCount > 0 && <div className="cwx-reader__toolbar-info" style={{ color: "#f87171" }}>· ⚠ {unmatchedCount} qatorda hudud topilmadi</div>}
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button className="cwx-reader__btn cwx-reader__btn--json" onClick={() => setShowPreview(true)}>👁 Natijani ko'rish ({aggregated.length})</button>
              <button className="cwx-reader__btn" onClick={postData} disabled={saving || !aggregated.length}>{saving ? "Saqlanmoqda…" : `Saqlash (${activeDateStr})`}</button>
              <button className="cwx-reader__btn cwx-reader__btn--secondary" onClick={handleReset}>✕ Faylni yopish</button>
            </div>
          </div>

          {sheets.length > 1 && (
            <div className="cwx-reader__sheets">
              {sheets.map((s) => (
                <button key={s} className={`cwx-reader__sheet-tab${s === activeSheet ? " cwx-reader__sheet-tab--active" : ""}`} onClick={() => switchSheet(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className="cwx-reader__table-wrapper">
            <table className="cwx-reader__table">
              <thead className="cwx-reader__thead">
                <tr>
                  <th className="cwx-reader__th cwx-reader__th--rownum">#</th>
                  <th className="cwx-reader__th cwx-reader__th--C" style={{ minWidth: 220 }}>B — Region</th>
                  <th className="cwx-reader__th cwx-reader__th--W">C — Jami 102 (0,05)</th>
                  <th className="cwx-reader__th cwx-reader__th--W">W — PI dan norozi (0,5)</th>
                  <th className="cwx-reader__th cwx-reader__th--X">X — IIO dan norozi (0,05)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => {
                  const regionMatched = !!matchRegion(row.B, regions);
                  return (
                    <tr key={ri} className="cwx-reader__tr" style={!regionMatched ? { background: "rgba(248,113,113,0.05)" } : undefined}>
                      <td className="cwx-reader__td cwx-reader__td--rownum"><span className="cwx-row-num">{START_ROW + ri + 2}</span></td>
                      {(["B", "C", "W", "X"] as (keyof RowData)[]).map((key) => {
                        const isEditing = editingCell?.row === ri && editingCell?.col === key;
                        const isBCol = key === "B";
                        return (
                          <td key={key} className={`cwx-reader__td${isEditing ? " cwx-reader__td--editing" : ""}`}
                            style={isBCol ? { color: regionMatched ? "#00d4aa" : "#f87171" } : undefined}
                            onClick={() => handleCellClick(ri, key)}>
                            {isEditing ? (
                              <input ref={inputRef} className="cwx-reader__cell-input" value={editValue}
                                onChange={(e) => setEditValue(e.target.value)} onBlur={commitEdit} onKeyDown={onKeyDown} />
                            ) : (
                              <span className="cwx-reader__cell-content">{fmt(row[key])}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {rows.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", padding: "48px", color: "#4a6080" }}>B ustunida region nomi bo'lgan qatorlar topilmadi</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && hasData && showPreview && (
        <>
          <div className="cwx-reader__toolbar">
            <div className="cwx-reader__toolbar-left">
              <div className="cwx-reader__toolbar-info">
                Saqlashga tayyor: <strong style={{ color: "#00d4aa" }}>{aggregated.length}</strong> ta hudud ·{" "}
                <strong style={{ color: "#0099ff" }}>{activeDateStr}</strong>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button className="cwx-reader__btn cwx-reader__btn--secondary" onClick={() => setShowPreview(false)}>← Orqaga</button>
              <button className="cwx-reader__btn" onClick={postData} disabled={saving || !aggregated.length}>{saving ? "Saqlanmoqda…" : `Saqlash (${aggregated.length} hudud)`}</button>
            </div>
          </div>
          <div className="cwx-reader__table-wrapper">
            <table className="cwx-reader__table">
              <thead className="cwx-reader__thead">
                <tr>
                  <th className="cwx-reader__th cwx-reader__th--rownum">#</th>
                  <th className="cwx-reader__th cwx-reader__th--C" style={{ minWidth: 220 }}>Hudud</th>
                  <th className="cwx-reader__th cwx-reader__th--B" style={{ color: "#e5e7eb" }}>Jami 102</th>
                  <th className="cwx-reader__th cwx-reader__th--B" style={{ color: "#facc15" }}>PI dan norozi</th>
                  <th className="cwx-reader__th cwx-reader__th--B" style={{ color: "#f87171" }}>IIO dan norozi</th>
                </tr>
              </thead>
              <tbody>
                {aggregated.map((a, i) => (
                  <tr key={i} className="cwx-reader__tr">
                    <td className="cwx-reader__td cwx-reader__td--rownum"><span className="cwx-row-num">{i + 1}</span></td>
                    <td className="cwx-reader__td"><span className="cwx-reader__cell-content" style={{ color: "#00d4aa" }}>{a.region_name}</span></td>
                    <td className="cwx-reader__td"><span className="cwx-reader__cell-content"><strong>{a.total_calls_102}</strong></span></td>
                    <td className="cwx-reader__td"><span className="cwx-reader__cell-content" style={{ color: "#facc15" }}>{a.call_pi}</span></td>
                    <td className="cwx-reader__td"><span className="cwx-reader__cell-content" style={{ color: "#f87171" }}>{a.iio_complaint}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Emergency102ExcelReader;