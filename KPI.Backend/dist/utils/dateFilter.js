"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateFilter = void 0;
/**
 * from/to optional date range helper.
 * Agar ikkalasi ham kelmasa — barcha yozuvlar olinadi (1=1).
 */
const dateFilter = (from, to, col = 'date') => {
    if (from && to)
        return `${col} BETWEEN '${from}' AND '${to}'`;
    if (from)
        return `${col} >= '${from}'`;
    if (to)
        return `${col} <= '${to}'`;
    return '1=1';
};
exports.dateFilter = dateFilter;
//# sourceMappingURL=dateFilter.js.map