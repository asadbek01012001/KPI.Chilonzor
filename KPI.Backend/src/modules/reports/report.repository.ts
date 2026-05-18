import { db } from '../../config/database';

const EXCLUDE_REGION_NO_ALIAS = `index != 56`;

export const reportRepository = {

  getAllMahallaReport: async (from?: string, to?: string, sector?: number, search?: string) => {
    const params: any[] = [];
    const sectorCondNoAlias= sector ? `AND sector = $${params.push(sector)}` : '';

    // Regionlar ro'yxati
    const regParams: any[] = [...params];
    const regSearch = search
      ? `AND LOWER(name) LIKE LOWER($${regParams.push('%' + search + '%')})`
      : '';
    const regRes = await db.query<any>(
      `SELECT id, name, sector FROM regions
       WHERE ${EXCLUDE_REGION_NO_ALIAS} ${sectorCondNoAlias} ${regSearch}
       ORDER BY index ASC`,
      regParams,
    );

    if (!regRes.rows.length) return [];

    const regionIds = regRes.rows.map((r: any) => r.id);

    // daily_region_scores — asosiy balllar
    const scoreParams: any[] = [];
    const dateCond = (() => {
      const conds: string[] = [];
      if (from) conds.push(`drs.date >= $${scoreParams.push(from)}`);
      if (to)   conds.push(`drs.date <= $${scoreParams.push(to)}`);
      return conds.length ? conds.join(' AND ') : 'TRUE';
    })();

    const scoreRes = await db.query<any>(`
      SELECT
        drs.region_id,
        COALESCE(SUM(drs.kpi_total),    0)::float AS kpi_total,
        COALESCE(SUM(drs.crimes_score), 0)::float AS crimes_total_score,
        COALESCE(SUM(drs.em102_score),  0)::float AS em_total_score,
        COALESCE(SUM(drs.total_score),  0)::float AS total_score,
        COALESCE(AVG(drs.average_rank), 0)::float AS average_rank
      FROM daily_region_scores drs
      WHERE ${dateCond}
        AND drs.region_id = ANY($${scoreParams.push(regionIds)})
      GROUP BY drs.region_id
    `, scoreParams);

    // daily_direction_scores — yo'nalish bo'yicha balllar
    const dirParams: any[] = [];
    const dirDateCond = (() => {
      const conds: string[] = [];
      if (from) conds.push(`dds.date >= $${dirParams.push(from)}`);
      if (to)   conds.push(`dds.date <= $${dirParams.push(to)}`);
      return conds.length ? conds.join(' AND ') : 'TRUE';
    })();

    const dirRes = await db.query<any>(`
      SELECT
        dds.region_id,
        dds.direction_id,
        d.name AS direction_name,
        COALESCE(SUM(dds.score), 0)::float AS score,
        ROUND(AVG(dds.rank))::int          AS rank
      FROM daily_direction_scores dds
      JOIN directions d ON d.id = dds.direction_id
      WHERE ${dirDateCond}
        AND dds.region_id = ANY($${dirParams.push(regionIds)})
      GROUP BY dds.region_id, dds.direction_id, d.name
      ORDER BY dds.region_id, d.name
    `, dirParams);

    // crimes — xom ma'lumotlar
    const crimeParams: any[] = [];
    const crimeDateCond = (() => {
      const conds: string[] = [];
      if (from) conds.push(`c.date >= $${crimeParams.push(from)}`);
      if (to)   conds.push(`c.date <= $${crimeParams.push(to)}`);
      return conds.length ? conds.join(' AND ') : 'TRUE';
    })();

    const crimeRes = await db.query<any>(`
      SELECT c.region_id,
        COALESCE(SUM(c.total_crimes),    0)::int AS total_crimes,
        COALESCE(SUM(c.minor_crimes),    0)::int AS minor_crimes,
        COALESCE(SUM(c.medium_crimes),   0)::int AS medium_crimes,
        COALESCE(SUM(c.serious_crimes),  0)::int AS serious_crimes,
        COALESCE(SUM(c.critical_crimes), 0)::int AS critical_crimes,
        MAX(c.minor_crimes_score)    AS minor_crimes_score,
        MAX(c.medium_crimes_score)   AS medium_crimes_score,
        MAX(c.serious_crimes_score)  AS serious_crimes_score,
        MAX(c.critical_crimes_score) AS critical_crimes_score
      FROM crimes c
      WHERE ${crimeDateCond}
        AND c.region_id = ANY($${crimeParams.push(regionIds)})
      GROUP BY c.region_id
    `, crimeParams);

    // emergency102 — xom ma'lumotlar
    const emParams: any[] = [];
    const emDateCond = (() => {
      const conds: string[] = [];
      if (from) conds.push(`e.date >= $${emParams.push(from)}`);
      if (to)   conds.push(`e.date <= $${emParams.push(to)}`);
      return conds.length ? conds.join(' AND ') : 'TRUE';
    })();

    const emRes = await db.query<any>(`
      SELECT e.region_id,
        COALESCE(SUM(e.total_calls_102), 0)::int AS total_calls_102,
        COALESCE(SUM(e.call_pi),         0)::int AS call_pi,
        COALESCE(SUM(e.iio_complaint),   0)::int AS iio_complaint,
        MAX(e.calls_102_score)     AS calls_102_score,
        MAX(e.pi_call_score)       AS pi_call_score,
        MAX(e.iio_complaint_score) AS iio_complaint_score
      FROM emergency102 e
      WHERE ${emDateCond}
        AND e.region_id = ANY($${emParams.push(regionIds)})
      GROUP BY e.region_id
    `, emParams);

    // Map qilish
    const scoreMap:  Record<string, any>   = {};
    const dirMap:    Record<string, any[]>  = {};
    const crimeMap:  Record<string, any>   = {};
    const emMap:     Record<string, any>   = {};

    for (const r of scoreRes.rows) scoreMap[r.region_id] = r;
    for (const r of crimeRes.rows) crimeMap[r.region_id] = r;
    for (const r of emRes.rows)    emMap[r.region_id]    = r;
    for (const r of dirRes.rows) {
      if (!dirMap[r.region_id]) dirMap[r.region_id] = [];
      dirMap[r.region_id].push({
        direction_id: r.direction_id,
        score: parseFloat(r.score) || 0,
        rank:  parseInt(r.rank)    || 0,
      });
    }

    // overall_rank — total_score bo'yicha
    const sorted = regRes.rows
      .map((r: any) => ({ id: r.id, total: parseFloat(scoreMap[r.id]?.total_score) || 0 }))
      .sort((a: any, b: any) => b.total - a.total);
    const rankMap: Record<string, number> = {};
    sorted.forEach((r: any, i: number) => { rankMap[r.id] = i + 1; });

    return regRes.rows
      .map((reg: any) => {
        const sc = scoreMap[reg.id]  || {};
        const cr = crimeMap[reg.id]  || {};
        const em = emMap[reg.id]     || {};
        return {
          region_id:          reg.id,
          region_name:        reg.name,
          sector:             reg.sector,
          overall_rank:       rankMap[reg.id] || 0,
          kpi_total:          parseFloat(sc.kpi_total)          || 0,
          crimes_total_score: parseFloat(sc.crimes_total_score) || 0,
          em_total_score:     parseFloat(sc.em_total_score)     || 0,
          total_score:        parseFloat(sc.total_score)        || 0,
          average_rank:       parseFloat(sc.average_rank)       || 0,
          directions:         dirMap[reg.id] || [],
          crimes: {
            total_crimes:          parseInt(cr.total_crimes)          || 0,
            minor_crimes:          parseInt(cr.minor_crimes)          || 0,
            medium_crimes:         parseInt(cr.medium_crimes)         || 0,
            serious_crimes:        parseInt(cr.serious_crimes)        || 0,
            critical_crimes:       parseInt(cr.critical_crimes)       || 0,
            minor_crimes_score:    parseFloat(cr.minor_crimes_score)  || 0,
            medium_crimes_score:   parseFloat(cr.medium_crimes_score) || 0,
            serious_crimes_score:  parseFloat(cr.serious_crimes_score)|| 0,
            critical_crimes_score: parseFloat(cr.critical_crimes_score)||0,
          },
          emergency102: {
            total_calls_102:     parseInt(em.total_calls_102)       || 0,
            call_pi:             parseInt(em.call_pi)               || 0,
            iio_complaint:       parseInt(em.iio_complaint)         || 0,
            calls_102_score:     parseFloat(em.calls_102_score)     || 0,
            pi_call_score:       parseFloat(em.pi_call_score)       || 0,
            iio_complaint_score: parseFloat(em.iio_complaint_score) || 0,
          },
        };
      })
      .sort((a: any, b: any) => b.total_score - a.total_score);
  },

  getMahallaReport: async (regionId: string, from?: string, to?: string) => {
    const regRes = await db.query<any>(`SELECT id, name, sector FROM regions WHERE id = $1`, [regionId]);
    if (!regRes.rows[0]) return null;
    const region = regRes.rows[0];

    const scoreParams: any[] = [regionId];
    const dateCond = (() => {
      const conds: string[] = [];
      if (from) conds.push(`drs.date >= $${scoreParams.push(from)}`);
      if (to)   conds.push(`drs.date <= $${scoreParams.push(to)}`);
      return conds.length ? conds.join(' AND ') : 'TRUE';
    })();

    const [scRes, dirRes, crRes, emRes] = await Promise.all([
      db.query<any>(`
        SELECT
          COALESCE(SUM(kpi_total),    0)::float AS kpi_total,
          COALESCE(SUM(crimes_score), 0)::float AS crimes_total_score,
          COALESCE(SUM(em102_score),  0)::float AS em_total_score,
          COALESCE(SUM(total_score),  0)::float AS total_score,
          COALESCE(AVG(average_rank), 0)::float AS average_rank
        FROM daily_region_scores drs
        WHERE drs.region_id = $1 AND ${dateCond}
      `, scoreParams),

      db.query<any>(`
        SELECT dds.direction_id, d.name AS direction_name,
          COALESCE(SUM(dds.score), 0)::float AS score,
          ROUND(AVG(dds.rank))::int           AS rank
        FROM daily_direction_scores dds
        JOIN directions d ON d.id = dds.direction_id
        WHERE dds.region_id = $1 AND ${dateCond.replace(/drs\./g, 'dds.')}
        GROUP BY dds.direction_id, d.name ORDER BY d.name
      `, scoreParams),

      db.query<any>(`
        SELECT
          COALESCE(SUM(total_crimes),    0)::int AS total_crimes,
          COALESCE(SUM(minor_crimes),    0)::int AS minor_crimes,
          COALESCE(SUM(medium_crimes),   0)::int AS medium_crimes,
          COALESCE(SUM(serious_crimes),  0)::int AS serious_crimes,
          COALESCE(SUM(critical_crimes), 0)::int AS critical_crimes,
          MAX(minor_crimes_score)    AS minor_crimes_score,
          MAX(medium_crimes_score)   AS medium_crimes_score,
          MAX(serious_crimes_score)  AS serious_crimes_score,
          MAX(critical_crimes_score) AS critical_crimes_score
        FROM crimes WHERE region_id = $1
          ${from ? `AND date >= '${from}'` : ''}
          ${to   ? `AND date <= '${to}'`   : ''}
      `, [regionId]),

      db.query<any>(`
        SELECT
          COALESCE(SUM(total_calls_102), 0)::int AS total_calls_102,
          COALESCE(SUM(call_pi),         0)::int AS call_pi,
          COALESCE(SUM(iio_complaint),   0)::int AS iio_complaint,
          MAX(calls_102_score)     AS calls_102_score,
          MAX(pi_call_score)       AS pi_call_score,
          MAX(iio_complaint_score) AS iio_complaint_score
        FROM emergency102 WHERE region_id = $1
          ${from ? `AND date >= '${from}'` : ''}
          ${to   ? `AND date <= '${to}'`   : ''}
      `, [regionId]),
    ]);

    const sc = scRes.rows[0] || {};
    const cr = crRes.rows[0] || {};
    const em = emRes.rows[0] || {};

    // overall_rank — daily_region_scores dan
    const rankRes = await db.query<any>(`
      SELECT COUNT(*) + 1 AS rank
      FROM (
        SELECT drs.region_id, SUM(drs.total_score) AS ts
        FROM daily_region_scores drs
        JOIN regions r ON r.id = drs.region_id AND r.index != 56
        WHERE TRUE
          ${from ? `AND drs.date >= '${from}'` : ''}
          ${to   ? `AND drs.date <= '${to}'`   : ''}
        GROUP BY drs.region_id
        HAVING SUM(drs.total_score) > (
          SELECT COALESCE(SUM(total_score), 0)
          FROM daily_region_scores
          WHERE region_id = $1
            ${from ? `AND date >= '${from}'` : ''}
            ${to   ? `AND date <= '${to}'`   : ''}
        )
      ) t
    `, [regionId]);

    return {
      region_id:          region.id,
      region_name:        region.name,
      sector:             region.sector,
      overall_rank:       parseInt(rankRes.rows[0]?.rank) || 1,
      kpi_total:          parseFloat(sc.kpi_total)          || 0,
      crimes_total_score: parseFloat(sc.crimes_total_score) || 0,
      em_total_score:     parseFloat(sc.em_total_score)     || 0,
      total_score:        parseFloat(sc.total_score)        || 0,
      average_rank:       parseFloat(sc.average_rank)       || 0,
      directions: dirRes.rows.map((d: any) => ({
        direction_id:   d.direction_id,
        direction_name: d.direction_name,
        score: parseFloat(d.score) || 0,
        rank:  parseInt(d.rank)    || 0,
      })),
      crimes: {
        total_crimes:          parseInt(cr.total_crimes)           || 0,
        minor_crimes:          parseInt(cr.minor_crimes)           || 0,
        medium_crimes:         parseInt(cr.medium_crimes)          || 0,
        serious_crimes:        parseInt(cr.serious_crimes)         || 0,
        critical_crimes:       parseInt(cr.critical_crimes)        || 0,
        minor_crimes_score:    parseFloat(cr.minor_crimes_score)   || 0,
        medium_crimes_score:   parseFloat(cr.medium_crimes_score)  || 0,
        serious_crimes_score:  parseFloat(cr.serious_crimes_score) || 0,
        critical_crimes_score: parseFloat(cr.critical_crimes_score)|| 0,
      },
      emergency102: {
        total_calls_102:     parseInt(em.total_calls_102)       || 0,
        call_pi:             parseInt(em.call_pi)               || 0,
        iio_complaint:       parseInt(em.iio_complaint)         || 0,
        calls_102_score:     parseFloat(em.calls_102_score)     || 0,
        pi_call_score:       parseFloat(em.pi_call_score)       || 0,
        iio_complaint_score: parseFloat(em.iio_complaint_score) || 0,
      },
    };
  },
};
