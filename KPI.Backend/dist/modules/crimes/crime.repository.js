"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crimeRepository = void 0;
const database_1 = require("../../config/database");
const dateFilter_1 = require("../../utils/dateFilter");
exports.crimeRepository = {
    findAll: async (q) => {
        const offset = (q.page - 1) * q.limit;
        const joinConds = [];
        const params = [];
        let idx = 1;
        if (q.region_id) {
            joinConds.push(`c.region_id = $${idx++}`);
            params.push(q.region_id);
        }
        if (q.date) {
            joinConds.push(`c.date = $${idx++}`);
            params.push(q.date);
        }
        if (q.from || q.to) {
            joinConds.push((0, dateFilter_1.dateFilter)(q.from, q.to, 'c.date'));
        }
        const joinFilter = joinConds.length ? `AND ${joinConds.join(' AND ')}` : '';
        const regionWhere = q.region_id ? `WHERE r.id = $1` : '';
        const [rows, count] = await Promise.all([
            database_1.db.query(`
        SELECT
          r.id   AS region_id,
          r.name AS region_name,
          r.sector,
          MAX(c.minor_crimes_score)    AS minor_crimes_score,
          MAX(c.medium_crimes_score)   AS medium_crimes_score,
          MAX(c.serious_crimes_score)  AS serious_crimes_score,
          MAX(c.critical_crimes_score) AS critical_crimes_score,
          COALESCE(SUM(c.total_crimes),0)    AS total_crimes,
          COALESCE(SUM(c.minor_crimes),0)    AS minor_crimes,
          COALESCE(SUM(c.medium_crimes),0)   AS medium_crimes,
          COALESCE(SUM(c.serious_crimes),0)  AS serious_crimes,
          COALESCE(SUM(c.critical_crimes),0) AS critical_crimes,
          COALESCE(SUM(c.minor_crimes   * c.minor_crimes_score),0)
          + COALESCE(SUM(c.medium_crimes  * c.medium_crimes_score),0)
          + COALESCE(SUM(c.serious_crimes * c.serious_crimes_score),0)
          + COALESCE(SUM(c.critical_crimes * c.critical_crimes_score),0) AS crimes_total_score
        FROM regions r
        LEFT JOIN crimes c ON c.region_id = r.id ${joinFilter}
        ${regionWhere}
        GROUP BY r.id, r.name, r.sector
        ORDER BY r.index ASC
        LIMIT $${idx} OFFSET $${idx + 1}
      `, [...params, q.limit, offset]),
            database_1.db.query(`SELECT COUNT(*) FROM regions ${regionWhere}`, q.region_id ? [q.region_id] : []),
        ]);
        // Ustunlar bo'yicha jami — flat fieldlar
        const totalsRes = await database_1.db.query(`
      SELECT
        COALESCE(SUM(c.total_crimes),0)::int    AS total_total_crimes,
        COALESCE(SUM(c.minor_crimes),0)::int    AS total_minor_crimes,
        COALESCE(SUM(c.medium_crimes),0)::int   AS total_medium_crimes,
        COALESCE(SUM(c.serious_crimes),0)::int  AS total_serious_crimes,
        COALESCE(SUM(c.critical_crimes),0)::int AS total_critical_crimes
      FROM crimes c
      ${joinConds.length ? `WHERE ${joinConds.map(c => c.replace(/c\./g, '')).join(' AND ')}` : ''}
    `, params);
        return {
            rows: rows.rows,
            total: parseInt(count.rows[0].count, 10),
            totals: totalsRes.rows[0],
        };
    },
    findById: async (id) => {
        const r = await database_1.db.query('SELECT * FROM crimes WHERE id = $1', [id]);
        return r.rows[0] || null;
    },
    create: async (dto) => {
        const r = await database_1.db.query(`INSERT INTO crimes
         (region_id,total_crimes,minor_crimes,medium_crimes,serious_crimes,critical_crimes,
          total_crimes_score,minor_crimes_score,medium_crimes_score,serious_crimes_score,critical_crimes_score,date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`, [dto.region_id, dto.total_crimes, dto.minor_crimes, dto.medium_crimes, dto.serious_crimes,
            dto.critical_crimes, dto.total_crimes_score, dto.minor_crimes_score, dto.medium_crimes_score,
            dto.serious_crimes_score, dto.critical_crimes_score, dto.date]);
        return r.rows[0];
    },
    update: async (id, dto) => {
        const fields = Object.keys(dto);
        if (!fields.length)
            return exports.crimeRepository.findById(id);
        const set = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
        const r = await database_1.db.query(`UPDATE crimes SET ${set} WHERE id = $1 RETURNING *`, [id, ...Object.values(dto)]);
        return r.rows[0] || null;
    },
    delete: async (id) => {
        const r = await database_1.db.query('DELETE FROM crimes WHERE id = $1', [id]);
        return (r.rowCount ?? 0) > 0;
    },
    bulkCreate: async (dto) => {
        if (!dto.items.length)
            return { inserted: 0 };
        // Bulkdagi barcha sanalar uchun avvalgi yozuvlarni o'chirish
        const dates = [...new Set(dto.items.map((i) => i.date))];
        await database_1.db.query(`DELETE FROM crimes WHERE date = ANY($1::date[])`, [dates]);
        // Yangi ma'lumotlarni insert qilish
        const values = [];
        const placeholders = dto.items.map((item, i) => {
            const b = i * 12;
            values.push(item.region_id, item.total_crimes, item.minor_crimes, item.medium_crimes, item.serious_crimes, item.critical_crimes, item.total_crimes_score, item.minor_crimes_score, item.medium_crimes_score, item.serious_crimes_score, item.critical_crimes_score, item.date);
            return `($${b + 1},$${b + 2},$${b + 3},$${b + 4},$${b + 5},$${b + 6},$${b + 7},$${b + 8},$${b + 9},$${b + 10},$${b + 11},$${b + 12})`;
        }).join(', ');
        const r = await database_1.db.query(`INSERT INTO crimes
         (region_id,total_crimes,minor_crimes,medium_crimes,serious_crimes,critical_crimes,
          total_crimes_score,minor_crimes_score,medium_crimes_score,serious_crimes_score,critical_crimes_score,date)
       VALUES ${placeholders}`, values);
        return { inserted: r.rowCount ?? 0 };
    },
};
//# sourceMappingURL=crime.repository.js.map