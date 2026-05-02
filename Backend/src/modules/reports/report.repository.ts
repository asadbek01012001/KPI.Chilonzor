import { db } from '../../config/database';
import { dateFilter } from '../../utils/dateFilter';

const EXCLUDE_REGION = `r.index != 56`;
const EXCLUDE_REGION_NO_ALIAS = `index != 56`;
const SCORE_EXPR = `CASE
          WHEN i.is_subtraction = true THEN
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
          ELSE i.score * iv.value
        END`;

export const reportRepository = {

  getAllMahallaReport: async (from?: string, to?: string, sector?: number, search?: string) => {
    const params: any[] = [];
    const sectorCond = sector ? `AND r.sector=$${params.push(sector)}` : '';

    const dirRes = await db.query<any>(`
      WITH all_pairs AS (
        SELECT r.id AS region_id, d.id AS direction_id, d.name AS direction_name
        FROM regions r CROSS JOIN directions d
        WHERE ${EXCLUDE_REGION} ${sectorCond}
      ),
      dir_scores AS (
        SELECT iv.region_id, iv.direction_id, SUM(${SCORE_EXPR}) AS dir_score
        FROM indicator_values iv
        JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

        WHERE ${dateFilter(from, to, 'iv.date')}
        GROUP BY iv.region_id, iv.direction_id
      ),
      combined AS (
        SELECT ap.region_id, ap.direction_id, ap.direction_name,
               COALESCE(ds.dir_score,0) AS dir_score
        FROM all_pairs ap
        LEFT JOIN dir_scores ds ON ds.region_id=ap.region_id AND ds.direction_id=ap.direction_id
      ),
      ranked AS (
        SELECT *,
          CASE WHEN dir_score=0 THEN 0
               ELSE RANK() OVER (PARTITION BY direction_id ORDER BY dir_score DESC)
          END AS dir_rank
        FROM combined
      )
      SELECT * FROM ranked ORDER BY region_id, direction_name
    `, params);

    // crimes va em ma'lumotlarini olish (penalty hisoblash uchun)
    const crimeAllParams: any[] = [...params];
    const crimeAllRes = await db.query<any>(`
      SELECT c.region_id,
        COALESCE(SUM(c.total_crimes),0)   AS total_crimes,
        COALESCE(SUM(c.minor_crimes),0)   AS minor_crimes,
        COALESCE(SUM(c.medium_crimes),0)  AS medium_crimes,
        COALESCE(SUM(c.serious_crimes),0) AS serious_crimes,
        COALESCE(SUM(c.critical_crimes),0) AS critical_crimes,
        -- score o'zgarmas, MAX bilan olamiz
        MAX(c.minor_crimes_score)    AS minor_crimes_score,
        MAX(c.medium_crimes_score)   AS medium_crimes_score,
        MAX(c.serious_crimes_score)  AS serious_crimes_score,
        MAX(c.critical_crimes_score) AS critical_crimes_score,
        -- jarima = count * score (har qator uchun hisoblab, keyin yig'amiz)
        COALESCE(SUM(c.minor_crimes   * c.minor_crimes_score),0)
        + COALESCE(SUM(c.medium_crimes  * c.medium_crimes_score),0)
        + COALESCE(SUM(c.serious_crimes * c.serious_crimes_score),0)
        + COALESCE(SUM(c.critical_crimes * c.critical_crimes_score),0) AS crimes_total_score
      FROM crimes c
      JOIN regions r ON r.id=c.region_id AND ${EXCLUDE_REGION}
      WHERE ${dateFilter(from, to, 'c.date')} ${sectorCond}
      GROUP BY c.region_id
    `, crimeAllParams);

    const emAllParams: any[] = [...params];
    const emAllRes = await db.query<any>(`
      SELECT e.region_id,
        COALESCE(SUM(e.total_calls_102),0) AS total_calls_102,
        COALESCE(SUM(e.call_pi),0)         AS call_pi,
        COALESCE(SUM(e.iio_complaint),0)   AS iio_complaint,
        -- score o'zgarmas, MAX bilan olamiz
        MAX(e.calls_102_score)     AS calls_102_score,
        MAX(e.pi_call_score)       AS pi_call_score,
        MAX(e.iio_complaint_score) AS iio_complaint_score,
        -- jarima: SUM(count) * MAX(score) — to'g'ri formula
        ROUND((
          COALESCE(SUM(e.total_calls_102), 0) * MAX(e.calls_102_score)
        + COALESCE(SUM(e.call_pi),         0) * MAX(e.pi_call_score)
        + COALESCE(SUM(e.iio_complaint),   0) * MAX(e.iio_complaint_score)
        )::numeric, 4) AS em_total_score
      FROM emergency102 e
      JOIN regions r ON r.id=e.region_id AND ${EXCLUDE_REGION}
      WHERE ${dateFilter(from, to, 'e.date')} ${sectorCond}
      GROUP BY e.region_id
    `, emAllParams);

    // crimeAllRes va emAllRes yuqorida bajarildi

    const regParams: any[] = [];
    const regSector = sector ? `AND sector=$${regParams.push(sector)}` : '';
    const regSearch = search ? `AND LOWER(name) LIKE LOWER($${regParams.push('%' + search + '%')})` : '';
    const regRes = await db.query<any>(
      `SELECT id, name, sector FROM regions WHERE ${EXCLUDE_REGION_NO_ALIAS} ${regSector} ${regSearch} ORDER BY index ASC`, regParams
    );

    const dirByRegion: Record<string, any[]> = {};
    for (const r of dirRes.rows) {
      if (!dirByRegion[r.region_id]) dirByRegion[r.region_id] = [];
      dirByRegion[r.region_id].push({
        direction_id: r.direction_id,
        score: parseFloat(r.dir_score)||0,
        rank:  parseInt(r.dir_rank)||0,
      });
    }

    const crimeMap: Record<string, any> = {};
    for (const r of crimeAllRes.rows) crimeMap[r.region_id] = {
      total_crimes: +r.total_crimes,
      minor_crimes: +r.minor_crimes,
      medium_crimes: +r.medium_crimes,
      serious_crimes: +r.serious_crimes,
      critical_crimes: +r.critical_crimes,
      minor_crimes_score: +r.minor_crimes_score,
      medium_crimes_score: +r.medium_crimes_score,
      serious_crimes_score: +r.serious_crimes_score,
      critical_crimes_score: +r.critical_crimes_score,
      crimes_total_score: +r.crimes_total_score,
    };

    const emMap: Record<string, any> = {};
    for (const r of emAllRes.rows) emMap[r.region_id] = {
      total_calls_102: +r.total_calls_102,
      call_pi: +r.call_pi,
      iio_complaint: +r.iio_complaint,
      calls_102_score: +r.calls_102_score,
      pi_call_score: +r.pi_call_score,
      iio_complaint_score: +r.iio_complaint_score,
      em_total_score: +r.em_total_score,
    };

    const defaultCrimes = { total_crimes:0, minor_crimes:0, medium_crimes:0, serious_crimes:0, critical_crimes:0, minor_crimes_score:0, medium_crimes_score:0, serious_crimes_score:0, critical_crimes_score:0, crimes_total_score:0 };
    const defaultEm    = { total_calls_102:0, call_pi:0, iio_complaint:0, calls_102_score:0, pi_call_score:0, iio_complaint_score:0, em_total_score:0 };

    const list = regRes.rows.map((reg: any) => {
      const dirs = dirByRegion[reg.id] || [];
      const active = dirs.filter((d: any) => d.score > 0);
      const kpi_total    = dirs.reduce((s: number, d: any) => s + d.score, 0);
      const average_rank = active.length ? active.reduce((s: number, d: any) => s + d.rank, 0) / active.length : 0;

      const c = crimeMap[reg.id] || defaultCrimes;
      const e = emMap[reg.id]    || defaultEm;

      const crimes_penalty = c.crimes_total_score || 0;

      const em_penalty = e.em_total_score || 0;

      const total_score = kpi_total
        - (kpi_total * crimes_penalty / 100)
        - (kpi_total * em_penalty     / 100);

      return {
        region_id: reg.id, region_name: reg.name, sector: reg.sector,
        overall_rank: 0,
        kpi_total: parseFloat(kpi_total.toFixed(4)),
        crimes_total_score: parseFloat(crimes_penalty.toFixed(4)),
        em_total_score: parseFloat(em_penalty.toFixed(4)),
        total_score: parseFloat(total_score.toFixed(4)),
        average_rank: parseFloat(average_rank.toFixed(2)),
        directions: dirs,
        crimes:       c,
        emergency102: e,
      };
    });

    // Ball yuqori = 1-o'rin (RANK: teng ball bo'lsa bir xil rank)
    const sorted = [...list].sort((a, b) => b.total_score - a.total_score);
    let rank = 1;
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i].total_score < sorted[i - 1].total_score) {
        rank = i + 1;
      }
      sorted[i].overall_rank = rank;
    }
    const rankMap: Record<string, number> = {};
    sorted.forEach(r => { rankMap[r.region_id] = r.overall_rank; });
    return list
      .map(r => ({ ...r, overall_rank: rankMap[r.region_id] }))
      .sort((a, b) => a.overall_rank - b.overall_rank);
  },

  getMahallaReport: async (regionId: string, from?: string, to?: string) => {
    const regRes = await db.query<any>('SELECT id, name, sector FROM regions WHERE id=$1', [regionId]);
    if (!regRes.rows[0]) return null;
    const region = regRes.rows[0];

    const dirRes = await db.query<any>(`
      WITH all_dirs AS (SELECT id AS direction_id, name AS direction_name FROM directions ORDER BY index ASC),
      dir_scores AS (
        SELECT iv.direction_id, SUM(${SCORE_EXPR}) AS dir_score
        FROM indicator_values iv
        JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

        WHERE iv.region_id=$1 AND ${dateFilter(from, to, 'iv.date')}
        GROUP BY iv.direction_id
      ),
      combined AS (
        SELECT ad.direction_id, ad.direction_name, COALESCE(ds.dir_score,0) AS dir_score
        FROM all_dirs ad LEFT JOIN dir_scores ds ON ds.direction_id=ad.direction_id
      ),
      all_region_dir AS (
        SELECT iv.region_id, iv.direction_id, SUM(${SCORE_EXPR}) AS dir_score
        FROM indicator_values iv
        JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

        JOIN regions r ON r.id = iv.region_id AND ${EXCLUDE_REGION}
        WHERE ${dateFilter(from, to, 'iv.date')}
        GROUP BY iv.region_id, iv.direction_id
      ),
      ranked AS (
        SELECT c.direction_id, c.direction_name, c.dir_score,
          CASE WHEN c.dir_score=0 THEN 0
               ELSE (SELECT COUNT(*)+1 FROM all_region_dir a
                     WHERE a.direction_id=c.direction_id AND a.dir_score>c.dir_score)
          END AS dir_rank
        FROM combined c
      )
      SELECT * FROM ranked ORDER BY direction_name
    `, [regionId]);

    const directions = dirRes.rows.map((r: any) => ({
      direction_id: r.direction_id,
      score: parseFloat(r.dir_score)||0,
      rank:  parseInt(r.dir_rank)||0,
    }));
    const kpi_total    = directions.reduce((s: number, d: any) => s + d.score, 0);
    const active       = directions.filter((d: any) => d.score > 0);
    const average_rank = active.length ? active.reduce((s: number, d: any) => s + d.rank, 0) / active.length : 0;

    const crimeRes = await db.query<any>(`
      SELECT
        COALESCE(SUM(total_crimes),0) AS total_crimes,
        COALESCE(SUM(minor_crimes),0) AS minor_crimes,
        COALESCE(SUM(medium_crimes),0) AS medium_crimes,
        COALESCE(SUM(serious_crimes),0) AS serious_crimes,
        COALESCE(SUM(critical_crimes),0) AS critical_crimes,
        COALESCE(SUM(total_crimes_score),0) AS total_crimes_score,
        COALESCE(SUM(minor_crimes_score),0) AS minor_crimes_score,
        COALESCE(SUM(medium_crimes_score),0) AS medium_crimes_score,
        COALESCE(SUM(serious_crimes_score),0) AS serious_crimes_score,
        COALESCE(SUM(critical_crimes_score),0) AS critical_crimes_score
      FROM crimes WHERE region_id=$1 AND ${dateFilter(from, to)}
    `, [regionId]);

    const emRes = await db.query<any>(`
      SELECT
        COALESCE(SUM(total_calls_102),0)  AS total_calls_102,
        COALESCE(SUM(call_pi),0)          AS call_pi,
        COALESCE(SUM(iio_complaint),0)    AS iio_complaint,
        MAX(calls_102_score)              AS calls_102_score,
        MAX(pi_call_score)                AS pi_call_score,
        MAX(iio_complaint_score)          AS iio_complaint_score,
        ROUND((
          COALESCE(SUM(total_calls_102), 0) * MAX(calls_102_score)
        + COALESCE(SUM(call_pi),         0) * MAX(pi_call_score)
        + COALESCE(SUM(iio_complaint),   0) * MAX(iio_complaint_score)
        )::numeric, 4) AS em_total_score
      FROM emergency102 WHERE region_id=$1 AND ${dateFilter(from, to)}
    `, [regionId]);

    const c = crimeRes.rows[0]; const e = emRes.rows[0];

    const crimes_penalty =
        (+c.minor_crimes   * +c.minor_crimes_score)
      + (+c.medium_crimes  * +c.medium_crimes_score)
      + (+c.serious_crimes * +c.serious_crimes_score)
      + (+c.critical_crimes * +c.critical_crimes_score);

    const em_penalty = parseFloat(e.em_total_score) || 0;

    const total_score = kpi_total
      - (kpi_total * crimes_penalty / 100)
      - (kpi_total * em_penalty     / 100);

    // overall_rank: shu regionning barcha regionlar orasidagi o'rni
    const overallRes = await db.query<any>(`
      WITH kpi AS (
        SELECT iv.region_id, SUM(${SCORE_EXPR}) AS kpi_score
        FROM indicator_values iv
        JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

        JOIN regions r ON r.id = iv.region_id AND ${EXCLUDE_REGION}
        WHERE ${dateFilter(from, to, 'iv.date')}
        GROUP BY iv.region_id
      ),
      crime_pen AS (
        SELECT region_id,
          SUM(total_crimes * total_crimes_score + minor_crimes * minor_crimes_score
            + medium_crimes * medium_crimes_score + serious_crimes * serious_crimes_score
            + critical_crimes * critical_crimes_score) AS penalty
        FROM crimes WHERE ${dateFilter(from, to)}
        GROUP BY region_id
      ),
      em_pen AS (
        SELECT region_id,
          SUM(total_calls_102) * MAX(calls_102_score)
          + SUM(call_pi)         * MAX(pi_call_score)
          + SUM(iio_complaint)   * MAX(iio_complaint_score) AS penalty
        FROM emergency102 WHERE ${dateFilter(from, to)}
        GROUP BY region_id
      ),
      totals AS (
        SELECT r.id AS region_id,
          COALESCE(kpi.kpi_score,0)
          - COALESCE(kpi.kpi_score,0) * COALESCE(cp.penalty,0) / 100
          - COALESCE(kpi.kpi_score,0) * COALESCE(ep.penalty,0) / 100
          AS total_score
        FROM regions r
        LEFT JOIN kpi      ON kpi.region_id = r.id
        LEFT JOIN crime_pen cp ON cp.region_id = r.id
        LEFT JOIN em_pen    ep ON ep.region_id = r.id
        WHERE ${EXCLUDE_REGION}
      ),
      ranked AS (SELECT *, RANK() OVER (ORDER BY total_score DESC) AS rank FROM totals)
      SELECT rank FROM ranked WHERE region_id=$1
    `, [regionId]);

    return {
      region_id: region.id, region_name: region.name, sector: region.sector,
      overall_rank: parseInt(overallRes.rows[0]?.rank)||0,
      kpi_total: parseFloat(kpi_total.toFixed(4)),
      crimes_total_score: parseFloat(crimes_penalty.toFixed(4)),
      em_total_score: parseFloat(em_penalty.toFixed(4)),
      total_score: parseFloat(total_score.toFixed(4)),
      average_rank: parseFloat(average_rank.toFixed(2)),
      directions,
      crimes: {
        total_crimes: +c.total_crimes, minor_crimes: +c.minor_crimes, medium_crimes: +c.medium_crimes,
        serious_crimes: +c.serious_crimes, critical_crimes: +c.critical_crimes,
        total_crimes_score: +c.total_crimes_score, minor_crimes_score: +c.minor_crimes_score,
        medium_crimes_score: +c.medium_crimes_score, serious_crimes_score: +c.serious_crimes_score,
        critical_crimes_score: +c.critical_crimes_score,
      },
      emergency102: {
        total_calls_102: +e.total_calls_102, call_pi: +e.call_pi, iio_complaint: +e.iio_complaint,
        calls_102_score: +e.calls_102_score, pi_call_score: +e.pi_call_score, iio_complaint_score: +e.iio_complaint_score,
      },
    };
  },
};
