/**
 * from/to optional date range helper.
 * Agar ikkalasi ham kelmasa — barcha yozuvlar olinadi (1=1).
 */
export const dateFilter = (from?: string, to?: string, col = 'date'): string => {
  if (from && to) return `${col} BETWEEN '${from}' AND '${to}'`;
  if (from)       return `${col} >= '${from}'`;
  if (to)         return `${col} <= '${to}'`;
  return '1=1';
};
