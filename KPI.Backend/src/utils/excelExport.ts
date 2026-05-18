import ExcelJS from 'exceljs';

const fmt = (val: number | null | undefined): string => {
  if (val === null || val === undefined) return '';
  return parseFloat(val.toFixed(1)).toString().replace('.', ',');
};

// Ranglar
const YELLOW    = 'FFFFF0AA';
const CYAN      = 'FFB2EBF2';
const RED_HDR   = 'FFFFCCCC';
const WHITE     = 'FFFFFFFF';
const TOP_BG    = 'FFD6EAD0'; // och yashil - top 10
const BOTTOM_BG = 'FFFADADD'; // och qizil  - bottom 10
const MID_BG    = 'FFFDF6E3'; // och sariq  - o'rtalar

const FONT_NAME = 'Calibri';
const FONT_SIZE = 14;

function cell(
  ws: ExcelJS.Worksheet,
  row: number,
  col: number,
  value: any,
  bgColor = WHITE,
  bold = false,
  align: ExcelJS.Alignment['horizontal'] = 'center',
) {
  const c = ws.getCell(row, col);
  c.value = value;
  c.alignment = { horizontal: align, vertical: 'middle', wrapText: true };
  c.font = { bold, size: FONT_SIZE, name: FONT_NAME };
  c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
  c.border = {
    top:    { style: 'thin' },
    left:   { style: 'thin' },
    bottom: { style: 'thin' },
    right:  { style: 'thin' },
  };
}

export async function generateReportExcel(
  tableData: any[],
  directions: any[],
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'KPI System';
  const ws = wb.addWorksheet('Hisobot', {
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
  });

  // ── Ustunlar kengligi ──────────────────────────────────────────────────────
  const fixedCols = [
    16,  // rank  (+40px ekvivalent)
    32,  // name
    16,  // kpi_total
    16,  // average_rank
    18,  // crimes jarima
    18,  // 102 jarima
    16,  // qoldiq
  ];
  const dirCols = directions.flatMap(() => [14, 10]); // ball, o'rni
  const tailCols = [13, 13, 13, 13, 13, 13, 13, 13]; // 102 + crimes

  const allWidths = [...fixedCols, ...dirCols, ...tailCols];
  allWidths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });

  // ── 1-qator: asosiy sarlavhalar (rowSpan=2 bo'lganlar) ──────────────────────
  const ROW1 = 1;
  const ROW2 = 2;

  // Fixed ustunlar - rowSpan 2 (merge)
  const fixed: [number, string, string][] = [
    [1, "Эгаллаган ўрни",                                              YELLOW],
    [2, "Маҳалла номи",                                                YELLOW],
    [3, "Жами тўплаган балл",                                          YELLOW],
    [4, "Жами йўналишлар бўйича ўртача ўрни",                          YELLOW],
    [5, "Олдинги олиш мумкин бўлган жиноят бўйича жарима",             RED_HDR],
    [6, "\"102\" бўйича қўлланилган жарима",                           YELLOW],
    [7, "Жарима фоизларидан сўнг қолган балл",                         CYAN  ],
  ];
  for (const [col, text, color] of fixed) {
    cell(ws, ROW1, col, text, color, true);
    ws.mergeCells(ROW1, col, ROW2, col);
  }

  // Yo'nalishlar (colSpan=2) - col 8 dan
  let colCursor = 8;
  for (const dir of directions) {
    cell(ws, ROW1, colCursor, dir.name, CYAN, true);
    ws.mergeCells(ROW1, colCursor, ROW1, colCursor + 1);
    cell(ws, ROW2, colCursor,     'балл',  CYAN, true);
    cell(ws, ROW2, colCursor + 1, 'ўрни',  CYAN, true);
    colCursor += 2;
  }

  // 102 umumiy (rowSpan=2)
  cell(ws, ROW1, colCursor, "Жами \"102\" -0,1%", YELLOW, true);
  ws.mergeCells(ROW1, colCursor, ROW2, colCursor);
  colCursor++;

  // шундан (colSpan=2)
  const sUndan1Col = colCursor;
  cell(ws, ROW1, colCursor, 'шундан', YELLOW, true);
  ws.mergeCells(ROW1, colCursor, ROW1, colCursor + 1);
  cell(ws, ROW2, colCursor,     'П.И ни чақириш -1%',  YELLOW, true);
  cell(ws, ROW2, colCursor + 1, 'ИИОдан норози -1%',   YELLOW, true);
  colCursor += 2;

  // Жами жиноят (rowSpan=2)
  cell(ws, ROW1, colCursor, "Жами олдини олиш мумкин бўлган жиноят (ЖК 47 моддаси)", YELLOW, true);
  ws.mergeCells(ROW1, colCursor, ROW2, colCursor);
  colCursor++;

  // шундан (colSpan=4)
  cell(ws, ROW1, colCursor, 'шундан', YELLOW, true);
  ws.mergeCells(ROW1, colCursor, ROW1, colCursor + 3);
  const crimeSubHeaders = [
    'ижтимоий хавфи катта бўлмаган',
    'унча оғир бўлмаган жиноят',
    'оғир жиноят',
    'ўта оғир жиноят ҳар бирига',
  ];
  for (const h of crimeSubHeaders) {
    cell(ws, ROW2, colCursor, h, YELLOW, true);
    colCursor++;
  }

  ws.getRow(ROW1).height = 100;
  ws.getRow(ROW2).height = 100;

  // ── Ma'lumot qatorlari ─────────────────────────────────────────────────────
  tableData.forEach((row: any, idx: number) => {
    const isTop10    = row.overall_rank <= 10;
    const isBottom10 = row.overall_rank > tableData.length - 10;
    // 1-55 qatorlarga rang, qolganlariga oq
    const inRange = idx < 55;
    const bg = inRange
      ? (isTop10 ? TOP_BG : isBottom10 ? BOTTOM_BG : MID_BG)
      : WHITE;
    const dataRow = idx + 3;

    let c = 1;
    cell(ws, dataRow, c++, `${row.overall_rank} - ўрин`,   bg, false, 'center');
    cell(ws, dataRow, c++, row.region_name,                 bg, false, 'left');
    cell(ws, dataRow, c++, fmt(row.kpi_total),              bg);
    cell(ws, dataRow, c++, fmt(row.average_rank),           bg);
    cell(ws, dataRow, c++, `-${fmt(row.crimes_total_score)}%`, bg);
    cell(ws, dataRow, c++, `-${fmt(row.em_total_score)}%`,  bg);
    cell(ws, dataRow, c++, fmt(row.total_score),            bg);

    // Yo'nalishlar — ular ham bg rangini oladi
    for (const dir of directions) {
      const found = row.directions?.find((d: any) => d.direction_id === dir.id);
      cell(ws, dataRow, c++, fmt(found?.score), bg);
      cell(ws, dataRow, c++, found?.rank ?? '', bg);
    }

    // 102
    cell(ws, dataRow, c++, fmt(row?.emergency102?.total_calls_102), bg);
    cell(ws, dataRow, c++, fmt(row?.emergency102?.call_pi),          bg);
    cell(ws, dataRow, c++, fmt(row?.emergency102?.iio_complaint),    bg);

    // Crimes
    cell(ws, dataRow, c++, fmt(row?.crimes?.total_crimes),    bg);
    cell(ws, dataRow, c++, fmt(row?.crimes?.minor_crimes),    bg);
    cell(ws, dataRow, c++, fmt(row?.crimes?.medium_crimes),   bg);
    cell(ws, dataRow, c++, fmt(row?.crimes?.serious_crimes),  bg);
    cell(ws, dataRow, c++, fmt(row?.crimes?.critical_crimes), bg);

    ws.getRow(dataRow).height = 22;
  });

  const buf = await wb.xlsx.writeBuffer();
  return buf as unknown as Buffer;
}
