import React, { useState, useRef, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import "./cwx-reader.scss";
import { useCrimeContext } from "../../api/crimes/CrimeApiContext";
import { useRegionContext } from "../../api/regions/RegionApiContext";
import { showToast } from "../ui/Toast";

// ── Constants ─────────────────────────────────────────────────────────────────
// A=0 B=1 C=2 D=3 E=4 F=5 G=6 H=7 I=8 J=9 K=10 L=11 M=12 N=13 O=14 P=15 Q=16 R=17 S=18 T=19 U=20
const COL_F = 5; // Article (moddasi)
const COL_G = 6; // Part (qismi)
const COL_H = 7; // Paragraph (bandi)
const COL_J = 9; // Date (sanasi)
const COL_O = 14; // MFY (region nomi)
const COL_R = 17; // Toifasi
const COL_U = 20; // Comment (izoh)

const START_ROW = 5; // 0-based → 6-qatordan (Excel row 6)

// ── Toifa mapping — substring bo'yicha (case-insensitive) ─────────────────────
function matchToifa(raw: CellVal): CrimeKey | null {
  if (!raw) return null;
  // NFC normalize — visually identical Cyrillic chars may differ in unicode
  const s = String(raw).normalize("NFC").trim().toLowerCase();
  if (s.includes("ижтимоий")) return "minor_crimes";
  if (s.includes("унча")) return "medium_crimes";
  if (s.includes("ўта")) return "critical_crimes";
  if (s.includes("оғир")) return "serious_crimes";
  return null;
}

type CrimeKey =
  | "minor_crimes"
  | "medium_crimes"
  | "serious_crimes"
  | "critical_crimes";

// ── Types ─────────────────────────────────────────────────────────────────────
type CellVal = string | number | boolean | null;

interface RowData {
  F: CellVal; // Article
  G: CellVal; // Part
  H: CellVal; // Paragraph
  J: CellVal; // Date
  O: CellVal; // MFY
  R: CellVal; // Toifa
  U: CellVal; // Comment
  _matched?: boolean; // region topildimi
}

interface CrimeCount {
  minor_crimes: number;
  medium_crimes: number;
  serious_crimes: number;
  critical_crimes: number;
}

interface AggregatedCrime extends CrimeCount {
  region_id: string;
  region_name: string;
  date: string;
  total_crimes: number;
}

interface Props {
  onClose: () => void;
  onSaved?: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (v: CellVal) => (v == null ? "" : String(v));

// Sana formatlash: turli formatlardan YYYY-MM-DD ga
function parseDate(raw: CellVal): string {
  if (!raw) return "";
  const s = String(raw).trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // DD.MM.YYYY yoki D.M.YYYY
  const dmy = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dmy)
    return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;

  // MM/DD/YYYY
  const mdy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdy)
    return `${mdy[3]}-${mdy[1].padStart(2, "0")}-${mdy[2].padStart(2, "0")}`;

  // Excel serial number
  if (/^\d+(\.\d+)?$/.test(s)) {
    const d = XLSX.SSF.parse_date_code(Number(s));
    if (d)
      return `${d.y}-${String(d.m).padStart(2, "0")}-${String(d.d).padStart(2, "0")}`;
  }

  // Fallback: local date (timezone safe)
  const dt = new Date(s);
  if (!isNaN(dt.getTime())) {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  return s;
}

// Region nomi bo'yicha fuzzy matching
// Unicode normalize + МФЙ ni olib taqqoslash
function normName(s: string): string {
  return s
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/\s*мфй\s*$/i, "") // "МФЙ" qo'shimchasini olib tashlash
    .replace(/\s+/g, " ") // Ko'p bo'shliqlarni birlashtirish
    .trim();
}

function matchRegion(mfyName: CellVal, regions: any[]): any | null {
  if (!mfyName) return null;
  const name = normName(String(mfyName));
  const nameRaw = String(mfyName).normalize("NFC").trim().toLowerCase();

  // 1. To'liq aynan moslik (raw)
  let found = regions.find(
    (r) => r.name?.normalize("NFC").trim().toLowerCase() === nameRaw,
  );
  if (found) return found;

  // 2. МФЙ siz to'liq moslik
  found = regions.find((r) => normName(r.name ?? "") === name);
  if (found) return found;

  // 3. Qisman moslik (МФЙ siz)
  found = regions.find((r) => {
    const rn = normName(r.name ?? "");
    return rn === name || rn.includes(name) || name.includes(rn);
  });
  return found || null;
}

// ── Aggregation ───────────────────────────────────────────────────────────────
function aggregateRows(rows: RowData[], regions: any[]): AggregatedCrime[] {
  const map = new Map<string, AggregatedCrime>();

  rows.forEach((row) => {
    const date = parseDate(row.J);
    if (!date) return;

    const region = matchRegion(row.O, regions);
    if (!region) return;

    const field = matchToifa(row.R);

    const key = `${region.id}__${date}`;
    if (!map.has(key)) {
      map.set(key, {
        region_id: region.id,
        region_name: region.name,
        date,
        minor_crimes: 0,
        medium_crimes: 0,
        serious_crimes: 0,
        critical_crimes: 0,
        total_crimes: 0,
      });
    }

    const agg = map.get(key)!;
    agg.total_crimes += 1;
    // Toifa noma'lum bo'lsa ham total ga qo'shiladi, faqat kategoriyaga emas
    if (field) {
      agg[field] += 1;
    }
  });

  return Array.from(map.values()).sort((a, b) =>
    a.region_name.localeCompare(b.region_name),
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
const CrimesExcelReader: React.FC<Props> = ({ onClose, onSaved }) => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [aggregated, setAggregated] = useState<AggregatedCrime[]>([]);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: keyof RowData;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fileName, setFileName] = useState("");
  const [sheets, setSheets] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState("");
  const [regions, setRegions] = useState<any[]>([]);

  const { CrimeApi } = useCrimeContext();
  const { RegionApi } = useRegionContext();

  const wbRef = useRef<XLSX.WorkBook | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCount = useRef(0);

  useEffect(() => {
    RegionApi.getAll()
      .then((res: any) => {
        const list = Array.isArray(res) ? res : res?.data || [];
        setRegions(list);
      })
      .catch((e: any) => console.log(e));
  }, [RegionApi]);

  // Regions o'zgarganda aggregatsiya yangilanadi
  useEffect(() => {
    if (rows.length && regions.length) {
      setAggregated(aggregateRows(rows, regions));
    }
  }, [rows, regions]);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  // ── Parse ─────────────────────────────────────────────────────────────────
  const parseSheet = useCallback((wb: XLSX.WorkBook, sheetName: string) => {
    const ws = wb.Sheets[sheetName];
    const raw = XLSX.utils.sheet_to_json(ws, {
      header: 1,
      defval: null,
      raw: false,
    }) as CellVal[][];

    // START_ROW ni dinamik topish:
    // COL_O da "МФЙ" yoki sana (COL_J) bo'lgan birinchi qatordan boshlaymiz
    const firstDataIdx = raw.findIndex((r) => {
      const o = r[COL_O];
      const j = r[COL_J];
      if (!o && !j) return false;
      const oStr = String(o ?? "").trim();
      const jStr = String(j ?? "").trim();
      // МФЙ so'zi bor yoki sana formatiga o'xshaydi
      return (
        oStr.toLowerCase().includes("мфй") ||
        /\d{1,2}[.\/]\d{1,2}[.\/]\d{4}/.test(jStr) ||
        /^\d{4}-\d{2}-\d{2}$/.test(jStr) ||
        /^\d{5}$/.test(jStr) // Excel serial date
      );
    });

    const startIdx = firstDataIdx >= 0 ? firstDataIdx : START_ROW;

    const parsed: RowData[] = raw
      .slice(startIdx)
      .filter((r) => r[COL_O] != null && String(r[COL_O]).trim() !== "")
      .map((r) => ({
        F: r[COL_F] ?? null,
        G: r[COL_G] ?? null,
        H: r[COL_H] ?? null,
        J: r[COL_J] ?? null,
        O: r[COL_O] ?? null,
        R: r[COL_R] ?? null,
        U: r[COL_U] ?? null,
      }));

    setRows(parsed);
    setEditingCell(null);
  }, []);

  const parseFile = useCallback(
    (file: File) => {
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
    },
    [parseSheet],
  );

  const switchSheet = (name: string) => {
    if (!wbRef.current || name === activeSheet) return;
    setActiveSheet(name);
    parseSheet(wbRef.current, name);
  };

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|xlsm|xlsb|ods|csv)$/i)) {
      showToast("Iltimos, Excel yoki CSV fayl yuklang", "error");
      return;
    }
    parseFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const COLS: (keyof RowData)[] = ["F", "G", "H", "J", "O", "R", "U"];

  const handleCellClick = (row: number, col: keyof RowData) => {
    clickCount.current++;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      if (clickCount.current >= 2) {
        const v = rows[row]?.[col];
        setEditValue(v != null ? String(v) : "");
        setEditingCell({ row, col });
      }
      clickCount.current = 0;
    }, 230);
  };

  const commitEdit = () => {
    if (!editingCell) return;
    const { row, col } = editingCell;
    setRows((prev) => {
      const next = [...prev];
      next[row] = { ...next[row], [col]: editValue };
      return next;
    });
    setEditingCell(null);
  };

  const cancelEdit = () => setEditingCell(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitEdit();
      return;
    }
    if (e.key === "Escape") {
      cancelEdit();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      commitEdit();
      if (editingCell) {
        const idx = COLS.indexOf(editingCell.col);
        const nc = idx + 1;
        if (nc < COLS.length) {
          const v = rows[editingCell.row]?.[COLS[nc]];
          setEditValue(v != null ? String(v) : "");
          setEditingCell({ row: editingCell.row, col: COLS[nc] });
        }
      }
    }
  };

  const handleReset = () => {
    setRows([]);
    setAggregated([]);
    setFileName("");
    setEditingCell(null);
    setSheets([]);
    setActiveSheet("");
    wbRef.current = null;
  };

  const hasData = fileName !== "";

  // Nechta qator region topilmadi
  const unmatchedCount = rows.filter((r) => !matchRegion(r.O, regions)).length;
  const unknownToifa = rows.filter((r) => r.R && !matchToifa(r.R)).length;

  // ── Post ──────────────────────────────────────────────────────────────────
  const postData = useCallback(async () => {
    if (!aggregated.length) {
      showToast("Yuborishga ma'lumot yo'q", "error");
      return;
    }

    const items = aggregated.map((a) => ({
      region_id: a.region_id,
      date: a.date,
      total_crimes: a.total_crimes,
      minor_crimes: a.minor_crimes,
      medium_crimes: a.medium_crimes,
      serious_crimes: a.serious_crimes,
      critical_crimes: a.critical_crimes,
      total_crimes_score: 0,
      minor_crimes_score: 5,
      medium_crimes_score: 10,
      serious_crimes_score: 15,
      critical_crimes_score: 20,
    }));

    setSaving(true);
    try {
      await CrimeApi.bulkCreate(items);
      showToast(
        `${items.length} ta hudud jinoyat ma'lumotlari saqlandi`,
        "success",
      );
      handleReset();
      onSaved?.();
      onClose();
    } catch (err: any) {
      console.error(err);
      showToast("Saqlashda xatolik yuz berdi", "error");
    } finally {
      setSaving(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aggregated, CrimeApi]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="cwx-reader"
      style={{ position: "fixed", inset: 0, zIndex: 1000 }}
    >
      {/* Header */}
      <div className="cwx-reader__header">
        <div className="cwx-reader__header-left">
          <div className="cwx-reader__header-badge">
            <span className="cwx-reader__header-dot" />F · J · O · R
          </div>
          <div>
            <div className="cwx-reader__header-title">
              Jinoyatlar — Excel yuklash
            </div>
            <div className="cwx-reader__header-sub">
              F=Modda · G=Qism · H=Band · J=Sana · O=MFY · R=Toifa · U=Izoh · 2×
              tahrirlash
            </div>
          </div>
        </div>
        <div className="cwx-reader__meta">
          {hasData && (
            <>
              <span>📄 {fileName}</span>
              <span>{rows.length} qator</span>
              <span>{aggregated.length} hudud</span>
              {unmatchedCount > 0 && (
                <span
                  style={{
                    color: "#f87171",
                    borderColor: "#5a2d2d",
                    background: "#2e1a1a",
                  }}
                >
                  ⚠ {unmatchedCount} topilmadi
                </span>
              )}
            </>
          )}
          <span style={{ cursor: "pointer" }} onClick={onClose}>
            ✕ Yopish
          </span>
        </div>
      </div>

      {loading && (
        <div className="cwx-reader__loading">
          <div className="cwx-reader__spinner" />
          <span>Fayl o'qilmoqda…</span>
        </div>
      )}

      {/* Upload */}
      {!loading && !hasData && (
        <div
          className="cwx-reader__upload-zone"
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <div
            className={`cwx-reader__drop-area${dragging ? " dragging" : ""}`}
          >
            <div className="cwx-reader__upload-icon">📂</div>
            <div className="cwx-reader__upload-cols">
              <span>F</span>
              <span>J</span>
              <span>O</span>
              <span>R</span>
              <span>U</span>
            </div>
            <div className="cwx-reader__upload-text">Excel fayl yuklang</div>
            <div className="cwx-reader__upload-hint">
              Faylni bu yerga tashlang yoki bosing
              <br />
              <strong>.xlsx · .xls · .xlsm · .csv</strong> formatlar
              qo'llab-quvvatlanadi
            </div>
            <button
              className="cwx-reader__btn"
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
            className="cwx-reader__file-input"
            onChange={onFileChange}
          />
        </div>
      )}

      {/* Table */}
      {!loading && hasData && !showPreview && (
        <>
          {/* Toolbar */}
          <div className="cwx-reader__toolbar">
            <div className="cwx-reader__toolbar-left">
              <div className="cwx-reader__toolbar-info">
                Jami: <strong>{rows.length}</strong> qator ·{" "}
                <strong style={{ color: "#00d4aa" }}>
                  {aggregated.length}
                </strong>{" "}
                hudud
              </div>
              {unmatchedCount > 0 && (
                <div
                  className="cwx-reader__toolbar-info"
                  style={{ color: "#f87171" }}
                >
                  · ⚠ {unmatchedCount} qatorda hudud topilmadi
                </div>
              )}
              {unknownToifa > 0 && (
                <div
                  className="cwx-reader__toolbar-info"
                  style={{ color: "#fbbf24" }}
                >
                  · ⚠ {unknownToifa} qatorda noma'lum toifa
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                className="cwx-reader__btn cwx-reader__btn--json"
                onClick={() => setShowPreview(true)}
              >
                👁 Natijani ko'rish ({aggregated.length})
              </button>
              <button
                className="cwx-reader__btn"
                onClick={postData}
                disabled={saving || !aggregated.length}
              >
                {saving ? "Saqlanmoqda…" : "Saqlash"}
              </button>
              <button
                className="cwx-reader__btn cwx-reader__btn--secondary"
                onClick={handleReset}
              >
                ✕ Faylni yopish
              </button>
            </div>
          </div>

          {/* Sheet tabs */}
          {sheets.length > 1 && (
            <div className="cwx-reader__sheets">
              {sheets.map((s) => (
                <button
                  key={s}
                  className={`cwx-reader__sheet-tab${s === activeSheet ? " cwx-reader__sheet-tab--active" : ""}`}
                  onClick={() => switchSheet(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Raw rows table */}
          <div className="cwx-reader__table-wrapper">
            <table className="cwx-reader__table">
              <thead className="cwx-reader__thead">
                <tr>
                  <th className="cwx-reader__th cwx-reader__th--rownum">#</th>
                  <th className="cwx-reader__th cwx-reader__th--B">
                    F — Modda
                  </th>
                  <th className="cwx-reader__th cwx-reader__th--C">G — Qism</th>
                  <th className="cwx-reader__th cwx-reader__th--C">H — Band</th>
                  <th className="cwx-reader__th cwx-reader__th--W">J — Sana</th>
                  <th
                    className="cwx-reader__th cwx-reader__th--W"
                    style={{ minWidth: 200 }}
                  >
                    O — MFY
                  </th>
                  <th
                    className="cwx-reader__th cwx-reader__th--C"
                    style={{ minWidth: 220 }}
                  >
                    R — Toifa
                  </th>
                  <th
                    className="cwx-reader__th cwx-reader__th--X"
                    style={{ minWidth: 200 }}
                  >
                    U — Izoh
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row: any, ri) => {
                  const regionMatched = !!matchRegion(row.O, regions);
                  const toifaMatched = !!matchToifa(row.R);
                  const dateStr = parseDate(row.J);
                  const rowError = !regionMatched || !toifaMatched || !dateStr;

                  return (
                    <tr
                      key={ri}
                      className="cwx-reader__tr"
                      style={
                        rowError
                          ? { background: "rgba(248,113,113,0.05)" }
                          : undefined
                      }
                    >
                      <td className="cwx-reader__td cwx-reader__td--rownum">
                        <span className="cwx-row-num">{ri + 2}</span>
                      </td>
                      {(
                        ["F", "G", "H", "J", "O", "R", "U"] as (keyof RowData)[]
                      ).map((key) => {
                        const isEditing =
                          editingCell?.row === ri && editingCell?.col === key;
                        const isDateCol = key === "J";
                        const isMfyCol = key === "O";
                        const isToifaCol = key === "R";
                        const hasError =
                          (isMfyCol && !regionMatched) ||
                          (isToifaCol && !toifaMatched) ||
                          (isDateCol && !dateStr);

                        return (
                          <td
                            key={key}
                            className={`cwx-reader__td${isEditing ? " cwx-reader__td--editing" : ""}`}
                            style={{
                              ...(hasError ? { color: "#f87171" } : {}),
                              ...(isDateCol && dateStr
                                ? { color: "#00d4aa" }
                                : {}),
                            }}
                            onClick={() => handleCellClick(ri, key)}
                          >
                            {isEditing ? (
                              <input
                                ref={inputRef}
                                className="cwx-reader__cell-input"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={commitEdit}
                                onKeyDown={onKeyDown}
                              />
                            ) : (
                              <span className="cwx-reader__cell-content">
                                {isDateCol
                                  ? dateStr || fmt(row[key])
                                  : fmt(row[key])}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "48px",
                        color: "#4a6080",
                        fontSize: "13px",
                      }}
                    >
                      O ustunida MFY nomi bo'lgan qatorlar topilmadi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Preview — aggregated result */}
      {!loading && hasData && showPreview && (
        <>
          <div className="cwx-reader__toolbar">
            <div className="cwx-reader__toolbar-left">
              <div className="cwx-reader__toolbar-info">
                Saqlashga tayyor:{" "}
                <strong style={{ color: "#00d4aa" }}>
                  {aggregated.length}
                </strong>{" "}
                ta hudud
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                className="cwx-reader__btn cwx-reader__btn--secondary"
                onClick={() => setShowPreview(false)}
              >
                ← Orqaga
              </button>
              <button
                className="cwx-reader__btn"
                onClick={postData}
                disabled={saving || !aggregated.length}
              >
                {saving
                  ? "Saqlanmoqda…"
                  : `Saqlash (${aggregated.length} hudud)`}
              </button>
            </div>
          </div>

          <div className="cwx-reader__table-wrapper">
            <table className="cwx-reader__table">
              <thead className="cwx-reader__thead">
                <tr>
                  <th className="cwx-reader__th cwx-reader__th--rownum">#</th>
                  <th
                    className="cwx-reader__th cwx-reader__th--C"
                    style={{ minWidth: 220 }}
                  >
                    Hudud
                  </th>
                  <th className="cwx-reader__th cwx-reader__th--W">Sana</th>
                  <th
                    className="cwx-reader__th cwx-reader__th--B"
                    style={{ color: "#e5e7eb" }}
                  >
                    Jami
                  </th>
                  <th
                    className="cwx-reader__th cwx-reader__th--B"
                    style={{ color: "#4ade80" }}
                  >
                    Ижтимоий кам
                  </th>
                  <th
                    className="cwx-reader__th cwx-reader__th--B"
                    style={{ color: "#facc15" }}
                  >
                    Унча оғир эмас
                  </th>
                  <th
                    className="cwx-reader__th cwx-reader__th--B"
                    style={{ color: "#fb923c" }}
                  >
                    Оғир
                  </th>
                  <th
                    className="cwx-reader__th cwx-reader__th--B"
                    style={{ color: "#f87171" }}
                  >
                    Ўта оғир
                  </th>
                </tr>
              </thead>
              <tbody>
                {aggregated.map((a, i) => (
                  <tr key={i} className="cwx-reader__tr">
                    <td className="cwx-reader__td cwx-reader__td--rownum">
                      <span className="cwx-row-num">{i + 1}</span>
                    </td>
                    <td className="cwx-reader__td">
                      <span
                        className="cwx-reader__cell-content"
                        style={{ color: "#00d4aa" }}
                      >
                        {a.region_name}
                      </span>
                    </td>
                    <td className="cwx-reader__td">
                      <span className="cwx-reader__cell-content">{a.date}</span>
                    </td>
                    <td className="cwx-reader__td">
                      <span className="cwx-reader__cell-content">
                        <strong>{a.total_crimes}</strong>
                      </span>
                    </td>
                    <td className="cwx-reader__td">
                      <span
                        className="cwx-reader__cell-content"
                        style={{ color: "#4ade80" }}
                      >
                        {a.minor_crimes}
                      </span>
                    </td>
                    <td className="cwx-reader__td">
                      <span
                        className="cwx-reader__cell-content"
                        style={{ color: "#facc15" }}
                      >
                        {a.medium_crimes}
                      </span>
                    </td>
                    <td className="cwx-reader__td">
                      <span
                        className="cwx-reader__cell-content"
                        style={{ color: "#fb923c" }}
                      >
                        {a.serious_crimes}
                      </span>
                    </td>
                    <td className="cwx-reader__td">
                      <span
                        className="cwx-reader__cell-content"
                        style={{ color: "#f87171" }}
                      >
                        {a.critical_crimes}
                      </span>
                    </td>
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

export default CrimesExcelReader;
