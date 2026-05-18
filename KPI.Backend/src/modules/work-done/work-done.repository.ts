import { db } from '../../config/database';
import { dateFilter } from '../../utils/dateFilter';

const EXCLUDE_REGION = `r.index != 56`;
const EXCLUDE_REGION_NO_ALIAS = `index != 56`;

export const workDoneRepository = {

  getByDirection: async (directionId: string, from?: string, to?: string) => {
    const indRes = await db.query<any>(`
      SELECT id, name, parent_id, score AS max_score
      FROM indicators
      WHERE direction_id = $1 AND is_active = true
      ORDER BY index ASC
    `, [directionId]);

    if (!indRes.rows.length) return [];

    const valRes = await db.query<any>(`
      SELECT
        iv.indicator_id,
        iv.region_id,
        r.name   AS region_name,
        r.sector,
        COALESCE(SUM(
          CASE WHEN i.is_subtraction = true THEN
            i.score * GREATEST(0,
              iv.value - COALESCE((
                SELECT SUM(iv2.value)
                FROM indicator_values iv2
                JOIN indicators i2 ON i2.id = iv2.indicator_id AND i2.is_active = true
                WHERE i2.parent_id = i.id
                  AND iv2.region_id = iv.region_id
                  AND iv2.date = iv.date
              ), 0)
            )
          ELSE i.score * iv.value END
        ), 0) AS score,
        COALESCE(SUM(iv.value), 0) AS value
      FROM indicator_values iv
      JOIN regions r    ON r.id = iv.region_id AND ${EXCLUDE_REGION}
      JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

      WHERE iv.direction_id = $1
        AND ${dateFilter(from, to, 'iv.date')}
      GROUP BY iv.indicator_id, iv.region_id, r.name, r.sector
      ORDER BY iv.indicator_id, r.name
    `, [directionId]);

    const regRes = await db.query<any>(
      `SELECT id AS region_id, name AS region_name, sector FROM regions WHERE ${EXCLUDE_REGION_NO_ALIAS} ORDER BY index ASC`
    );

    const valMap: Record<string, Record<string, { score: number; value: number }>> = {};
    for (const r of valRes.rows) {
      if (!valMap[r.indicator_id]) valMap[r.indicator_id] = {};
      valMap[r.indicator_id][r.region_id] = {
        score: parseFloat(r.score) || 0,
        value: parseFloat(r.value) || 0,
      };
    }

    return indRes.rows.map((ind: any) => {
      const regionScores = valMap[ind.id] || {};
      const regions = regRes.rows.map((reg: any) => ({
        region_id:   reg.region_id,
        region_name: reg.region_name,
        sector:      reg.sector,
        score:       regionScores[reg.region_id]?.score ?? 0,
        value:       regionScores[reg.region_id]?.value ?? 0,
      }));
      return {
        indicator_id:   ind.id,
        indicator_name: ind.name,
        parent_id:      ind.parent_id,
        max_score:      parseFloat(ind.max_score) || 0,
        regions,
      };
    });
  },

  getByDirectionAndIndicator: async (directionId: string, indicatorId: string, from?: string, to?: string) => {
    const indRes = await db.query<any>(
      'SELECT id, name, parent_id, score AS max_score FROM indicators WHERE id=$1 AND direction_id=$2 AND is_active=true',
      [indicatorId, directionId]
    );
    if (!indRes.rows[0]) return null;
    const indicator = indRes.rows[0];

    const res = await db.query<any>(`
      SELECT
        r.id     AS region_id,
        r.name   AS region_name,
        r.sector,
        COALESCE(SUM(i.score * iv.value), 0) AS score,
        COALESCE(SUM(iv.value), 0)            AS value
      FROM regions r
      LEFT JOIN indicator_values iv
        ON iv.region_id = r.id
        AND iv.indicator_id = $1
        AND iv.direction_id = $2
        AND ${dateFilter(from, to, 'iv.date')}
      LEFT JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

      WHERE ${EXCLUDE_REGION_NO_ALIAS}
    `, [indicatorId, directionId]);

    return {
      indicator_id:   indicator.id,
      indicator_name: indicator.name,
      parent_id:      indicator.parent_id,
      max_score:      parseFloat(indicator.max_score) || 0,
      regions: res.rows.map((r: any) => ({
        region_id:   r.region_id,
        region_name: r.region_name,
        sector:      r.sector,
        score:       parseFloat(r.score) || 0,
        value:       parseFloat(r.value) || 0,
      })),
    };
  },
};
