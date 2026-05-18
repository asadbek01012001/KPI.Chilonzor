"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWorkDoneExcel = generateWorkDoneExcel;
const exceljs_1 = __importDefault(require("exceljs"));
const FONT = 'Calibri';
const SZ = 11;
const HDR_BG = 'FF1F3864';
const HDR_FG = 'FFFFFFFF';
const PARENT_BG = 'FFD6E4F0';
const CHILD_BG = 'FFFFFFFF';
const TITLE_BG = 'FF2E4B7A';
const EVEN_BG = 'FFF5F8FF';
function setCell(ws, row, col, value, bgArgb, bold = false, fontArgb = '00000000', align = 'center', indent = 0) {
    const cell = ws.getCell(row, col);
    cell.value = value ?? '';
    cell.alignment = { horizontal: align, vertical: 'middle', wrapText: true, indent };
    cell.font = { bold, size: SZ, name: FONT, color: { argb: fontArgb } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } };
    cell.border = {
        top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        right: { style: 'thin', color: { argb: 'FFD0D0D0' } },
    };
}
// Matnning qancha qator egallashini taxminan hisoblash
function estimateRowHeight(text, colWidth, fontSize) {
    if (!text)
        return 18;
    // Har bir belgi ~0.6 * fontSize kenglik oladi (taxminan)
    const charWidth = fontSize * 0.55;
    const availableWidth = colWidth * 7; // Excel col width ~7 px per unit
    const charsPerLine = Math.floor(availableWidth / charWidth);
    if (charsPerLine <= 0)
        return 18;
    const lines = Math.ceil(text.length / charsPerLine);
    return Math.max(18, lines * (fontSize + 4));
}
async function generateWorkDoneExcel(directionName, indicators, regions, from, to) {
    const wb = new exceljs_1.default.Workbook();
    wb.creator = 'KPI System';
    const ws = wb.addWorksheet(directionName.slice(0, 31), {
        pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
    });
    const totalCols = 3 + regions.length;
    // Ustun kengliklari
    ws.getColumn(1).width = 5;
    ws.getColumn(2).width = 42;
    ws.getColumn(3).width = 8;
    for (let i = 0; i < regions.length; i++) {
        ws.getColumn(i + 4).width = 14;
    }
    // Sarlavha qatori
    ws.mergeCells(1, 1, 1, totalCols);
    const t = ws.getCell(1, 1);
    t.value = `${directionName}${from && to ? `  (${from} — ${to})` : ''}`;
    t.font = { bold: true, size: 13, name: FONT, color: { argb: HDR_FG } };
    t.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TITLE_BG } };
    t.alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getRow(1).height = 26;
    // Header qatori — region nomlari bo'yicha balandlik
    setCell(ws, 2, 1, 'No', HDR_BG, true, HDR_FG);
    setCell(ws, 2, 2, "Ko'rsatkich nomi", HDR_BG, true, HDR_FG, 'left');
    setCell(ws, 2, 3, 'Ball', HDR_BG, true, HDR_FG);
    let maxHeaderHeight = 40;
    for (let i = 0; i < regions.length; i++) {
        const name = regions[i].region_name ?? '';
        setCell(ws, 2, i + 4, name, HDR_BG, true, HDR_FG);
        const h = estimateRowHeight(name, 14, SZ);
        if (h > maxHeaderHeight)
            maxHeaderHeight = h;
    }
    ws.getRow(2).height = Math.min(maxHeaderHeight, 120); // max 120px
    // Ma'lumot qatorlari
    let rowIdx = 3;
    let num = 1;
    for (const ind of indicators) {
        const isParent = !ind.parent_id;
        const bg = isParent ? PARENT_BG : (num % 2 === 0 ? EVEN_BG : CHILD_BG);
        const valMap = {};
        for (const r of (ind.regions ?? [])) {
            valMap[r.region_id] = r.value ?? 0;
        }
        setCell(ws, rowIdx, 1, isParent ? num : '', bg, isParent);
        setCell(ws, rowIdx, 2, ind.indicator_name, bg, isParent, '00000000', 'left', isParent ? 0 : 2);
        setCell(ws, rowIdx, 3, ind.max_score || '', bg, isParent);
        for (let i = 0; i < regions.length; i++) {
            const val = valMap[regions[i].region_id];
            setCell(ws, rowIdx, i + 4, val ? val : '', bg);
        }
        // Ko'rsatkich nomiga qarab balandlik
        const nameHeight = estimateRowHeight(ind.indicator_name ?? '', 42, SZ);
        ws.getRow(rowIdx).height = Math.min(Math.max(isParent ? 22 : 18, nameHeight), 80);
        rowIdx++;
        if (isParent)
            num++;
    }
    ws.views = [{ state: 'frozen', xSplit: 3, ySplit: 2, activeCell: 'D3' }];
    return (await wb.xlsx.writeBuffer());
}
//# sourceMappingURL=generateWorkDoneExcel.js.map