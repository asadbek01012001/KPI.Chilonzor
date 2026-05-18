"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRepository = void 0;
const database_1 = require("../../config/database");
const dateFilter_1 = require("../../utils/dateFilter");
// "Boshqa" region (index=56) rankingdan chiqarilsin
const EXCLUDE_REGION = `r.index != 56`;
// Ball: indicators.score * indicator_values.value, faqat is_active=true indikatorlar
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
exports.dashboardRepository = {
    getMahalla: async (regionId, from, to) => {
        const regRes = await database_1.db.query('SELECT id, name, sector FROM regions WHERE id=$1', [regionId]);
        if (!regRes.rows[0])
            return null;
        const region = regRes.rows[0];
        const dirRes = await database_1.db.query(`
      WITH all_dirs AS (SELECT id AS direction_id, name AS direction_name FROM directions ORDER BY index ASC),
      dir_scores AS (
        SELECT iv.direction_id, SUM(${SCORE_EXPR}) AS dir_score
        FROM indicator_values iv
        JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

        WHERE iv.region_id=$1 AND ${(0, dateFilter_1.dateFilter)(from, to, 'iv.date')}
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
        WHERE ${(0, dateFilter_1.dateFilter)(from, to, 'iv.date')}
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
        const directions = dirRes.rows.map((r) => ({
            direction_id: r.direction_id,
            score: parseFloat(r.dir_score) || 0,
            rank: parseInt(r.dir_rank) || 0,
        }));
        const kpi_total = directions.reduce((s, d) => s + d.score, 0);
        const activeDirs = directions.filter((d) => d.score > 0);
        const average_rank = activeDirs.length
            ? activeDirs.reduce((s, d) => s + d.rank, 0) / activeDirs.length : 0;
        const crimeRes = await database_1.db.query(`
      SELECT
        COALESCE(SUM(total_crimes),0)   AS total_crimes,
        COALESCE(SUM(minor_crimes),0)   AS minor_crimes,
        COALESCE(SUM(medium_crimes),0)  AS medium_crimes,
        COALESCE(SUM(serious_crimes),0) AS serious_crimes,
        COALESCE(SUM(critical_crimes),0) AS critical_crimes,
        MAX(minor_crimes_score)    AS minor_crimes_score,
        MAX(medium_crimes_score)   AS medium_crimes_score,
        MAX(serious_crimes_score)  AS serious_crimes_score,
        MAX(critical_crimes_score) AS critical_crimes_score,
        COALESCE(SUM(minor_crimes   * minor_crimes_score),0)
        + COALESCE(SUM(medium_crimes  * medium_crimes_score),0)
        + COALESCE(SUM(serious_crimes * serious_crimes_score),0)
        + COALESCE(SUM(critical_crimes * critical_crimes_score),0) AS crimes_total_score
      FROM crimes WHERE region_id=$1 AND ${(0, dateFilter_1.dateFilter)(from, to)}
    `, [regionId]);
        const emRes = await database_1.db.query(`
      SELECT
        COALESCE(SUM(total_calls_102),0) AS total_calls_102,
        COALESCE(SUM(call_pi),0)         AS call_pi,
        COALESCE(SUM(iio_complaint),0)   AS iio_complaint,
        MAX(calls_102_score)     AS calls_102_score,
        MAX(pi_call_score)       AS pi_call_score,
        MAX(iio_complaint_score) AS iio_complaint_score,
        COALESCE(SUM(total_calls_102 * calls_102_score),0)
        + COALESCE(SUM(call_pi       * pi_call_score),0)
        + COALESCE(SUM(iio_complaint * iio_complaint_score),0) AS em_total_score
      FROM emergency102 WHERE region_id=$1 AND ${(0, dateFilter_1.dateFilter)(from, to)}
    `, [regionId]);
        const c = crimeRes.rows[0];
        const e = emRes.rows[0];
        const crimes_penalty = +c.crimes_total_score || 0;
        const em_penalty = +e.em_total_score || 0;
        // jarima foiz sifatida: kpi_total dan crimes_penalty % va em_penalty % ayiriladi
        const total_score = kpi_total
            - (kpi_total * crimes_penalty / 100)
            - (kpi_total * em_penalty / 100);
        return {
            region_id: region.id, region_name: region.name, sector: region.sector,
            kpi_total: parseFloat(kpi_total.toFixed(4)),
            total_score: parseFloat(total_score.toFixed(4)),
            average_rank: parseFloat(average_rank.toFixed(2)),
            directions,
            crimes: {
                total_crimes: +c.total_crimes,
                minor_crimes: +c.minor_crimes, medium_crimes: +c.medium_crimes,
                serious_crimes: +c.serious_crimes, critical_crimes: +c.critical_crimes,
                minor_crimes_score: +c.minor_crimes_score,
                medium_crimes_score: +c.medium_crimes_score,
                serious_crimes_score: +c.serious_crimes_score,
                critical_crimes_score: +c.critical_crimes_score,
                crimes_total_score: +c.crimes_total_score,
            },
            emergency102: {
                total_calls_102: +e.total_calls_102, call_pi: +e.call_pi, iio_complaint: +e.iio_complaint,
                calls_102_score: +e.calls_102_score, pi_call_score: +e.pi_call_score,
                iio_complaint_score: +e.iio_complaint_score,
                em_total_score: +e.em_total_score,
            },
        };
    },
    getAllMahalla: async (from, to, sector) => {
        const params = [];
        const sectorCond = sector ? `AND r.sector=$${params.push(sector)}` : '';
        const dateConds = [];
        if (from)
            dateConds.push(`drs.date >= $${params.push(from)}`);
        if (to)
            dateConds.push(`drs.date <= $${params.push(to)}`);
        const dateWhere = dateConds.length ? dateConds.join(' AND ') : 'TRUE';
        const res = await database_1.db.query(`
      SELECT r.id AS region_id, r.name AS region_name, r.sector,
        COALESCE(SUM(drs.kpi_total),   0)::float AS kpi_total,
        COALESCE(SUM(drs.total_score), 0)::float AS total_score,
        COALESCE(AVG(drs.average_rank),0)::float AS average_rank,
        RANK() OVER (ORDER BY COALESCE(SUM(drs.total_score),0) DESC) AS overall_rank
      FROM regions r
      LEFT JOIN daily_region_scores drs ON drs.region_id = r.id AND ${dateWhere}
      WHERE r.index != 56 ${sectorCond}
      GROUP BY r.id, r.name, r.sector
      ORDER BY overall_rank
    `, params);
        return res.rows.map((r) => ({
            region_id: r.region_id,
            region_name: r.region_name,
            sector: r.sector,
            kpi_total: parseFloat(r.kpi_total) || 0,
            total_score: parseFloat(r.total_score) || 0,
            overall_rank: parseInt(r.overall_rank) || 0,
            average_rank: parseFloat(r.average_rank) || 0,
        }));
    },
    topCrimes: async (from, to) => {
        const params = [];
        const dateConds = [];
        if (from)
            dateConds.push(`c.date >= $${params.push(from)}`);
        if (to)
            dateConds.push(`c.date <= $${params.push(to)}`);
        const dateWhere = dateConds.length ? dateConds.join(' AND ') : 'TRUE';
        const res = await database_1.db.query(`
      SELECT r.id AS region_id, r.name AS region_name, r.sector,
        COALESCE(SUM(c.total_crimes),    0)::int AS total_crimes,
        COALESCE(SUM(c.minor_crimes),    0)::int AS minor_crimes,
        COALESCE(SUM(c.medium_crimes),   0)::int AS medium_crimes,
        COALESCE(SUM(c.serious_crimes),  0)::int AS serious_crimes,
        COALESCE(SUM(c.critical_crimes), 0)::int AS critical_crimes,
        COALESCE(SUM(
          c.minor_crimes   * c.minor_crimes_score
        + c.medium_crimes  * c.medium_crimes_score
        + c.serious_crimes * c.serious_crimes_score
        + c.critical_crimes* c.critical_crimes_score), 0)::float AS crime_penalty,
        RANK() OVER (ORDER BY COALESCE(SUM(c.total_crimes),0) DESC) AS crimes_rank
      FROM regions r
      LEFT JOIN crimes c ON c.region_id = r.id AND ${dateWhere}
      WHERE r.index != 56
      GROUP BY r.id, r.name, r.sector
      ORDER BY crimes_rank
    `, params);
        return res.rows.map((r) => ({
            region_id: r.region_id,
            region_name: r.region_name,
            sector: r.sector,
            rank: parseInt(r.crimes_rank) || 0,
            total_crimes: parseInt(r.total_crimes) || 0,
            minor_crimes: parseInt(r.minor_crimes) || 0,
            medium_crimes: parseInt(r.medium_crimes) || 0,
            serious_crimes: parseInt(r.serious_crimes) || 0,
            critical_crimes: parseInt(r.critical_crimes) || 0,
            penalty_score: parseFloat(r.crime_penalty) || 0,
        }));
    },
    top102: async (from, to) => {
        const params = [];
        const dateConds = [];
        if (from)
            dateConds.push(`e.date >= $${params.push(from)}`);
        if (to)
            dateConds.push(`e.date <= $${params.push(to)}`);
        const dateWhere = dateConds.length ? dateConds.join(' AND ') : 'TRUE';
        const res = await database_1.db.query(`
      SELECT r.id AS region_id, r.name AS region_name, r.sector,
        COALESCE(SUM(e.total_calls_102), 0)::int AS total_calls_102,
        COALESCE(SUM(e.call_pi),         0)::int AS call_pi,
        COALESCE(SUM(e.iio_complaint),   0)::int AS iio_complaint,
        COALESCE(
          SUM(e.total_calls_102) * MAX(e.calls_102_score)
        + SUM(e.call_pi)         * MAX(e.pi_call_score)
        + SUM(e.iio_complaint)   * MAX(e.iio_complaint_score), 0)::float AS em_penalty,
        RANK() OVER (ORDER BY COALESCE(SUM(e.total_calls_102+e.call_pi+e.iio_complaint),0) DESC) AS em_rank
      FROM regions r
      LEFT JOIN emergency102 e ON e.region_id = r.id AND ${dateWhere}
      WHERE r.index != 56
      GROUP BY r.id, r.name, r.sector
      ORDER BY em_rank
    `, params);
        return res.rows.map((r) => ({
            region_id: r.region_id,
            region_name: r.region_name,
            sector: r.sector,
            rank: parseInt(r.em_rank) || 0,
            total_calls_102: parseInt(r.total_calls_102) || 0,
            call_pi: parseInt(r.call_pi) || 0,
            iio_complaint: parseInt(r.iio_complaint) || 0,
            penalty_score: parseFloat(r.em_penalty) || 0,
        }));
    },
    sectorSummary: async (from, to) => {
        const params = [];
        const dateConds = [];
        if (from)
            dateConds.push(`drs.date >= $${params.push(from)}`);
        if (to)
            dateConds.push(`drs.date <= $${params.push(to)}`);
        const dateWhere = dateConds.length ? dateConds.join(' AND ') : 'TRUE';
        const res = await database_1.db.query(`
      SELECT r.sector,
        COUNT(DISTINCT r.id)::int               AS region_count,
        COALESCE(SUM(drs.kpi_total),   0)::float AS kpi_score,
        COALESCE(SUM(drs.crimes_score),0)::float AS crime_score,
        COALESCE(SUM(drs.em102_score), 0)::float AS em_score
      FROM regions r
      LEFT JOIN daily_region_scores drs ON drs.region_id = r.id AND ${dateWhere}
      WHERE r.index != 56
      GROUP BY r.sector ORDER BY r.sector
    `, params);
        return res.rows.map((r) => ({
            sector: parseInt(r.sector),
            region_count: parseInt(r.region_count) || 0,
            kpi_score: parseFloat(r.kpi_score) || 0,
            crime_score: parseFloat(r.crime_score) || 0,
            em_score: parseFloat(r.em_score) || 0,
        }));
    },
    sectorRegions: async (from, to) => {
        const params = [];
        const dateConds = [];
        if (from)
            dateConds.push(`drs.date >= $${params.push(from)}`);
        if (to)
            dateConds.push(`drs.date <= $${params.push(to)}`);
        const dateWhere = dateConds.length ? dateConds.join(' AND ') : 'TRUE';
        const res = await database_1.db.query(`
      SELECT r.id AS region_id, r.name AS region_name, r.sector,
        COALESCE(SUM(drs.kpi_total),   0)::float AS kpi_total,
        COALESCE(SUM(drs.total_score), 0)::float AS total_score,
        COALESCE(AVG(drs.average_rank),0)::float AS average_rank,
        RANK() OVER (ORDER BY COALESCE(SUM(drs.total_score),0) DESC) AS overall_rank
      FROM regions r
      LEFT JOIN daily_region_scores drs ON drs.region_id = r.id AND ${dateWhere}
      WHERE r.index != 56
      GROUP BY r.id, r.name, r.sector
      ORDER BY r.sector, overall_rank
    `, params);
        const sectorMap = {};
        for (const r of res.rows) {
            const s = parseInt(r.sector);
            if (!sectorMap[s])
                sectorMap[s] = { sector: s, regions: [] };
            sectorMap[s].regions.push({
                region_id: r.region_id,
                region_name: r.region_name,
                kpi_total: parseFloat(r.kpi_total) || 0,
                total_score: parseFloat(r.total_score) || 0,
                overall_rank: parseInt(r.overall_rank) || 0,
                average_rank: parseFloat(r.average_rank) || 0,
            });
        }
        return Object.values(sectorMap).sort((a, b) => a.sector - b.sector);
    },
    directionsWithCount: async (from, to) => {
        const res = await database_1.db.query(`
      SELECT d.id AS direction_id, d.name AS direction_name,
             COUNT(DISTINCT i.id) AS indicator_count
      FROM directions d
      LEFT JOIN indicators i ON i.direction_id=d.id AND i.is_active = true
      GROUP BY d.id, d.name, d.index
      ORDER BY d.index ASC
    `, []);
        return res.rows.map((r) => ({
            direction_id: r.direction_id,
            direction_name: r.direction_name,
            indicator_count: parseInt(r.indicator_count) || 0,
        }));
    },
    regionsByDirection: async (directionId, from, to) => {
        const res = await database_1.db.query(`
      WITH scores AS (
        SELECT iv.region_id, SUM(${SCORE_EXPR}) AS total_score
        FROM indicator_values iv
        JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

        WHERE iv.direction_id=$1 AND ${(0, dateFilter_1.dateFilter)(from, to, 'iv.date')}
        GROUP BY iv.region_id
      ),
      all_regions AS (
        SELECT r.id AS region_id, r.name AS region_name, r.sector,
               COALESCE(s.total_score,0) AS total_score
        FROM regions r LEFT JOIN scores s ON s.region_id=r.id
        WHERE ${EXCLUDE_REGION}
      ),
      ranked AS (SELECT *, RANK() OVER (ORDER BY total_score DESC) AS rank FROM all_regions)
      SELECT * FROM ranked ORDER BY rank
    `, [directionId]);
        return res.rows.map((r) => ({
            region_id: r.region_id, region_name: r.region_name, sector: r.sector,
            total_score: parseFloat(r.total_score) || 0, rank: parseInt(r.rank) || 0,
        }));
    },
    indicatorsByDirectionAndRegion: async (directionId, regionId, from, to) => {
        const res = await database_1.db.query(`
      SELECT
        i.id             AS indicator_id,
        i.name           AS indicator_name,
        i.parent_id,
        i.is_subtraction,
        i.score          AS max_score,
        COALESCE(SUM(iv.value), 0) AS total_value,
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
        ), 0) AS achieved_score
      FROM indicators i
      LEFT JOIN indicator_values iv
        ON iv.indicator_id = i.id AND iv.region_id = $2 AND ${(0, dateFilter_1.dateFilter)(from, to, 'iv.date')}
      WHERE i.direction_id = $1
        AND i.is_active = true

      GROUP BY i.id, i.name, i.parent_id, i.is_subtraction, i.score, i.index
      ORDER BY i.index ASC
    `, [directionId, regionId]);
        return res.rows.map((r) => ({
            indicator_id: r.indicator_id,
            indicator_name: r.indicator_name,
            parent_id: r.parent_id,
            is_subtraction: r.is_subtraction,
            max_score: parseFloat(r.max_score) || 0,
            achieved_score: parseFloat(r.achieved_score) || 0,
            total_value: parseFloat(r.total_value) || 0,
        }));
    },
    regionSummary: async (regionId, from, to) => {
        const regRes = await database_1.db.query('SELECT id, name, sector FROM regions WHERE id=$1', [regionId]);
        if (!regRes.rows[0])
            return null;
        const region = regRes.rows[0];
        const dirRes = await database_1.db.query(`
      WITH this_region AS (
        SELECT iv.direction_id, SUM(${SCORE_EXPR}) AS dir_score
        FROM indicator_values iv
        JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

        WHERE iv.region_id=$1 AND ${(0, dateFilter_1.dateFilter)(from, to, 'iv.date')}
        GROUP BY iv.direction_id
      ),
      all_regions_dir AS (
        SELECT iv.region_id, iv.direction_id, SUM(${SCORE_EXPR}) AS dir_score
        FROM indicator_values iv
        JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

        JOIN regions r ON r.id = iv.region_id AND r.index != 56
        WHERE ${(0, dateFilter_1.dateFilter)(from, to, 'iv.date')}
        GROUP BY iv.region_id, iv.direction_id
      )
      SELECT d.id AS direction_id, d.name AS direction_name,
             COALESCE(tr.dir_score, 0) AS score,
             CASE WHEN COALESCE(tr.dir_score, 0) = 0 THEN 0
               ELSE (SELECT COUNT(*)+1 FROM all_regions_dir a
                     WHERE a.direction_id = d.id AND a.dir_score > COALESCE(tr.dir_score, 0))
             END AS rank
      FROM directions d
      LEFT JOIN this_region tr ON tr.direction_id = d.id
      GROUP BY d.id, d.name, d.index, tr.dir_score
      ORDER BY d.index ASC
    `, [regionId]);
        const crimeRes = await database_1.db.query(`
      SELECT
        COALESCE(SUM(total_crimes),0)    AS total_crimes,
        COALESCE(SUM(minor_crimes),0)    AS minor_crimes,
        COALESCE(SUM(medium_crimes),0)   AS medium_crimes,
        COALESCE(SUM(serious_crimes),0)  AS serious_crimes,
        COALESCE(SUM(critical_crimes),0) AS critical_crimes,
        MAX(minor_crimes_score)    AS minor_crimes_score,
        MAX(medium_crimes_score)   AS medium_crimes_score,
        MAX(serious_crimes_score)  AS serious_crimes_score,
        MAX(critical_crimes_score) AS critical_crimes_score,
        COALESCE(SUM(minor_crimes   * minor_crimes_score),0)
        + COALESCE(SUM(medium_crimes  * medium_crimes_score),0)
        + COALESCE(SUM(serious_crimes * serious_crimes_score),0)
        + COALESCE(SUM(critical_crimes * critical_crimes_score),0) AS crimes_total_score
      FROM crimes WHERE region_id=$1 AND ${(0, dateFilter_1.dateFilter)(from, to)}
    `, [regionId]);
        const emRes = await database_1.db.query(`
      SELECT
        COALESCE(SUM(total_calls_102),0) AS total_calls_102,
        COALESCE(SUM(call_pi),0)         AS call_pi,
        COALESCE(SUM(iio_complaint),0)   AS iio_complaint,
        MAX(calls_102_score)     AS calls_102_score,
        MAX(pi_call_score)       AS pi_call_score,
        MAX(iio_complaint_score) AS iio_complaint_score,
        COALESCE(SUM(total_calls_102 * calls_102_score),0)
        + COALESCE(SUM(call_pi       * pi_call_score),0)
        + COALESCE(SUM(iio_complaint * iio_complaint_score),0) AS em_total_score
      FROM emergency102 WHERE region_id=$1 AND ${(0, dateFilter_1.dateFilter)(from, to)}
    `, [regionId]);
        const directions = dirRes.rows.map((r) => ({
            direction_id: r.direction_id,
            direction_name: r.direction_name,
            score: parseFloat(r.score) || 0,
            rank: parseInt(r.rank) || 0,
        }));
        const c = crimeRes.rows[0];
        const e = emRes.rows[0];
        const kpi_total = directions.reduce((s, d) => s + d.score, 0);
        const crimes_penalty = +c.crimes_total_score || 0;
        const em_penalty = +e.em_total_score || 0;
        const total_score = kpi_total
            - (kpi_total * crimes_penalty / 100)
            - (kpi_total * em_penalty / 100);
        // Umumiy reytingdagi o'rin
        const rankRes = await database_1.db.query(`
      WITH kpi AS (
        SELECT iv.region_id, SUM(${SCORE_EXPR}) AS kpi_score
        FROM indicator_values iv
        JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

        JOIN regions r ON r.id = iv.region_id AND r.index != 56
        WHERE ${(0, dateFilter_1.dateFilter)(from, to, 'iv.date')}
        GROUP BY iv.region_id
      ),
      crime_pen AS (
        SELECT region_id,
          COALESCE(SUM(minor_crimes * minor_crimes_score),0)
          + COALESCE(SUM(medium_crimes * medium_crimes_score),0)
          + COALESCE(SUM(serious_crimes * serious_crimes_score),0)
          + COALESCE(SUM(critical_crimes * critical_crimes_score),0) AS penalty
        FROM crimes WHERE ${(0, dateFilter_1.dateFilter)(from, to)} GROUP BY region_id
      ),
      em_pen AS (
        SELECT region_id,
          COALESCE(SUM(total_calls_102 * calls_102_score),0)
          + COALESCE(SUM(call_pi * pi_call_score),0)
          + COALESCE(SUM(iio_complaint * iio_complaint_score),0) AS penalty
        FROM emergency102 WHERE ${(0, dateFilter_1.dateFilter)(from, to)} GROUP BY region_id
      ),
      totals AS (
        SELECT r.id AS region_id,
          COALESCE(k.kpi_score,0)
          - COALESCE(k.kpi_score,0) * COALESCE(cp.penalty,0) / 100
          - COALESCE(k.kpi_score,0) * COALESCE(ep.penalty,0) / 100 AS total_score
        FROM regions r
        LEFT JOIN kpi k        ON k.region_id  = r.id
        LEFT JOIN crime_pen cp ON cp.region_id = r.id
        LEFT JOIN em_pen    ep ON ep.region_id = r.id
        WHERE r.index != 56
      ),
      ranked AS (SELECT *, RANK() OVER (ORDER BY total_score DESC) AS rank FROM totals)
      SELECT rank FROM ranked WHERE region_id = $1
    `, [regionId]);
        return {
            region_id: region.id,
            region_name: region.name,
            sector: region.sector,
            region_rank: parseInt(rankRes.rows[0]?.rank) || 0,
            kpi_total: parseFloat(kpi_total.toFixed(4)),
            total_score: parseFloat(total_score.toFixed(4)),
            crimes: {
                total_crimes: +c.total_crimes,
                minor_crimes: +c.minor_crimes, medium_crimes: +c.medium_crimes,
                serious_crimes: +c.serious_crimes, critical_crimes: +c.critical_crimes,
                minor_crimes_score: +c.minor_crimes_score,
                medium_crimes_score: +c.medium_crimes_score,
                serious_crimes_score: +c.serious_crimes_score,
                critical_crimes_score: +c.critical_crimes_score,
                crimes_total_score: +c.crimes_total_score,
            },
            emergency102: {
                total_calls_102: +e.total_calls_102, call_pi: +e.call_pi, iio_complaint: +e.iio_complaint,
                calls_102_score: +e.calls_102_score, pi_call_score: +e.pi_call_score,
                iio_complaint_score: +e.iio_complaint_score,
                em_total_score: +e.em_total_score,
            },
            directions,
        };
    },
    info: async (from, to) => {
        // 1. Indicators soni
        const indRes = await database_1.db.query(`
      SELECT
        COUNT(*) FILTER (WHERE parent_id IS NULL) AS parent_count,
        COUNT(*) FILTER (WHERE parent_id IS NOT NULL) AS child_count,
        COUNT(*) AS total_count
      FROM indicators WHERE is_active = true
    `);
        // 2. Regions va directions soni
        const countRes = await database_1.db.query(`
      SELECT
        (SELECT COUNT(*) FROM regions WHERE index != 56) AS regions_count,
        (SELECT COUNT(*) FROM directions) AS directions_count
    `);
        // 3. O'rtacha ish bajarilishi: barcha active indikatorlarning max ball summi va
        //    haqiqatda to'plangan ball summining nisbati (%)
        const avgRes = await database_1.db.query(`
      WITH max_possible AS (
        SELECT SUM(i.score) AS total_max
        FROM indicators i
        WHERE i.is_active = true AND i.parent_id IS NULL
      ),
      achieved AS (
        SELECT SUM(${SCORE_EXPR}) AS total_achieved
        FROM indicator_values iv
        JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

        JOIN regions r ON r.id = iv.region_id AND r.index != 56
        WHERE ${(0, dateFilter_1.dateFilter)(from, to, 'iv.date')}
      ),
      region_count AS (
        SELECT COUNT(*) AS cnt FROM regions WHERE index != 56
      )
      SELECT
        CASE WHEN mp.total_max > 0 AND rc.cnt > 0
          THEN ROUND((a.total_achieved / (mp.total_max * rc.cnt) * 100)::numeric, 2)
          ELSE 0
        END AS avg_completion
      FROM max_possible mp, achieved a, region_count rc
    `);
        // 4. Lider MFY - eng yuqori total_score li region
        const leaderRes = await database_1.db.query(`
      WITH kpi AS (
        SELECT iv.region_id, SUM(${SCORE_EXPR}) AS kpi_score
        FROM indicator_values iv
        JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

        WHERE ${(0, dateFilter_1.dateFilter)(from, to, 'iv.date')}
        GROUP BY iv.region_id
      ),
      crime_pen AS (
        SELECT region_id,
          COALESCE(SUM(minor_crimes * minor_crimes_score),0)
          + COALESCE(SUM(medium_crimes * medium_crimes_score),0)
          + COALESCE(SUM(serious_crimes * serious_crimes_score),0)
          + COALESCE(SUM(critical_crimes * critical_crimes_score),0) AS penalty
        FROM crimes WHERE ${(0, dateFilter_1.dateFilter)(from, to)}
        GROUP BY region_id
      ),
      em_pen AS (
        SELECT region_id,
          COALESCE(SUM(total_calls_102 * calls_102_score),0)
          + COALESCE(SUM(call_pi * pi_call_score),0)
          + COALESCE(SUM(iio_complaint * iio_complaint_score),0) AS penalty
        FROM emergency102 WHERE ${(0, dateFilter_1.dateFilter)(from, to)}
        GROUP BY region_id
      ),
      totals AS (
        SELECT r.id, r.name,
          COALESCE(k.kpi_score, 0)
          - COALESCE(k.kpi_score, 0) * COALESCE(cp.penalty, 0) / 100
          - COALESCE(k.kpi_score, 0) * COALESCE(ep.penalty, 0) / 100 AS total_score
        FROM regions r
        LEFT JOIN kpi k      ON k.region_id  = r.id
        LEFT JOIN crime_pen cp ON cp.region_id = r.id
        LEFT JOIN em_pen    ep ON ep.region_id = r.id
        WHERE r.index != 56
      )
      SELECT id AS region_id, name AS region_name, total_score
      FROM totals
      ORDER BY total_score DESC
      LIMIT 1
    `);
        const ind = indRes.rows[0];
        const cnt = countRes.rows[0];
        const avg = avgRes.rows[0];
        const leader = leaderRes.rows[0] || null;
        return {
            indicators: {
                parent_count: parseInt(ind.parent_count) || 0,
                child_count: parseInt(ind.child_count) || 0,
                total_count: parseInt(ind.total_count) || 0,
            },
            regions_count: parseInt(cnt.regions_count) || 0,
            directions_count: parseInt(cnt.directions_count) || 0,
            avg_completion: parseFloat(avg.avg_completion) || 0,
            leader: leader ? {
                region_id: leader.region_id,
                region_name: leader.region_name,
                total_score: parseFloat(leader.total_score) || 0,
            } : null,
        };
    },
    // Chart 1: Region bo'yicha vaqt oralig'ida ball dinamikasi (max 10 ta interval)
    // Yordamchi: max 10 ta vaqt intervalini yasash
    _buildIntervals(from, to) {
        const fmt = (d) => d.toISOString().slice(0, 10);
        const fromMs = new Date(from).getTime();
        const toMs = new Date(to).getTime();
        const totalMs = toMs - fromMs;
        const COUNT = 20;
        const intervals = [];
        for (let i = 0; i < COUNT; i++) {
            const startMs = fromMs + Math.round((totalMs * i) / COUNT);
            const endMs = fromMs + Math.round((totalMs * (i + 1)) / COUNT) - (i < COUNT - 1 ? 86400000 : 0);
            const startDate = new Date(startMs);
            const endDate = new Date(Math.min(endMs, toMs));
            intervals.push({ from: fmt(startDate), to: fmt(endDate), label: fmt(startDate) });
        }
        const intervalDays = Math.max(1, Math.round(totalMs / COUNT / 86400000));
        return { intervals, intervalDays };
    },
    // Chart 1: MFY umumiy ball dinamikasi — vaqt bo'yicha (max 10 interval)
    // GET /dashboard/chart/region/:regionId/timeline?from=&to=
    chartRegion: async (regionId, from, to) => {
        const { intervals, intervalDays } = exports.dashboardRepository._buildIntervals(from, to);
        const result = await Promise.all(intervals.map(async (intv) => {
            const res = await database_1.db.query(`
        WITH kpi AS (
          SELECT COALESCE(SUM(${SCORE_EXPR}), 0) AS kpi_score
          FROM indicator_values iv
          JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

          WHERE iv.region_id = $1 AND iv.date BETWEEN $2 AND $3
        ),
        crime_pen AS (
          SELECT COALESCE(
            SUM(minor_crimes * minor_crimes_score) +
            SUM(medium_crimes * medium_crimes_score) +
            SUM(serious_crimes * serious_crimes_score) +
            SUM(critical_crimes * critical_crimes_score), 0) AS penalty
          FROM crimes WHERE region_id = $1 AND date BETWEEN $2 AND $3
        ),
        em_pen AS (
          SELECT COALESCE(
            SUM(total_calls_102 * calls_102_score) +
            SUM(call_pi * pi_call_score) +
            SUM(iio_complaint * iio_complaint_score), 0) AS penalty
          FROM emergency102 WHERE region_id = $1 AND date BETWEEN $2 AND $3
        )
        SELECT kpi.kpi_score,
          kpi.kpi_score - kpi.kpi_score * cp.penalty / 100
                        - kpi.kpi_score * ep.penalty / 100 AS total_score
        FROM kpi, crime_pen cp, em_pen ep
      `, [regionId, intv.from, intv.to]);
            const row = res.rows[0];
            return {
                label: intv.label,
                from: intv.from,
                to: intv.to,
                kpi_score: parseFloat(row?.kpi_score) || 0,
                total_score: parseFloat(row?.total_score) || 0,
            };
        }));
        return { region_id: regionId, interval_days: intervalDays, data: result };
    },
    // Chart 2: Yo'nalish bo'yicha vaqt intervalida ball dinamikasi (max 10 interval)
    // GET /dashboard/chart/direction/:directionId?from=&to=
    chartDirection: async (directionId, from, to) => {
        const { intervals, intervalDays } = exports.dashboardRepository._buildIntervals(from, to);
        const dir = await database_1.db.query('SELECT id, name FROM directions WHERE id=$1', [directionId]);
        const result = await Promise.all(intervals.map(async (intv) => {
            const res = await database_1.db.query(`
        SELECT COALESCE(SUM(${SCORE_EXPR}), 0) AS score
        FROM indicator_values iv
        JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

        JOIN regions r ON r.id = iv.region_id AND r.index != 56
        WHERE iv.direction_id = $1 AND iv.date BETWEEN $2 AND $3
      `, [directionId, intv.from, intv.to]);
            return {
                label: intv.label,
                from: intv.from,
                to: intv.to,
                score: parseFloat(res.rows[0]?.score) || 0,
            };
        }));
        return {
            direction_id: directionId,
            direction_name: dir.rows[0]?.name || '',
            interval_days: intervalDays,
            data: result,
        };
    },
    // Chart 3: Tuman umumiy — vaqt intervalida umumiy ball dinamikasi (max 10 interval)
    // GET /dashboard/chart/district?from=&to=
    chartDistrict: async (from, to) => {
        const { intervals, intervalDays } = exports.dashboardRepository._buildIntervals(from, to);
        const result = await Promise.all(intervals.map(async (intv) => {
            const res = await database_1.db.query(`
        WITH kpi AS (
          SELECT iv.region_id, SUM(${SCORE_EXPR}) AS kpi_score
          FROM indicator_values iv
          JOIN indicators i ON i.id = iv.indicator_id AND i.is_active = true

          JOIN regions r ON r.id = iv.region_id AND r.index != 56
          WHERE iv.date BETWEEN $1 AND $2
          GROUP BY iv.region_id
        ),
        crime_pen AS (
          SELECT region_id,
            COALESCE(SUM(minor_crimes * minor_crimes_score) +
                     SUM(medium_crimes * medium_crimes_score) +
                     SUM(serious_crimes * serious_crimes_score) +
                     SUM(critical_crimes * critical_crimes_score), 0) AS penalty
          FROM crimes WHERE date BETWEEN $1 AND $2 GROUP BY region_id
        ),
        em_pen AS (
          SELECT region_id,
            COALESCE(SUM(total_calls_102 * calls_102_score) +
                     SUM(call_pi * pi_call_score) +
                     SUM(iio_complaint * iio_complaint_score), 0) AS penalty
          FROM emergency102 WHERE date BETWEEN $1 AND $2 GROUP BY region_id
        )
        SELECT
          COALESCE(SUM(k.kpi_score), 0) AS total_kpi,
          COALESCE(SUM(
            k.kpi_score - k.kpi_score * COALESCE(cp.penalty,0) / 100
                        - k.kpi_score * COALESCE(ep.penalty,0) / 100
          ), 0) AS total_score
        FROM kpi k
        LEFT JOIN crime_pen cp ON cp.region_id = k.region_id
        LEFT JOIN em_pen    ep ON ep.region_id = k.region_id
      `, [intv.from, intv.to]);
            return {
                label: intv.label,
                from: intv.from,
                to: intv.to,
                total_kpi: parseFloat(res.rows[0]?.total_kpi) || 0,
                total_score: parseFloat(res.rows[0]?.total_score) || 0,
            };
        }));
        return { interval_days: intervalDays, data: result };
    },
};
//# sourceMappingURL=dashboard.repository.js.map