"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indicatorValueRepository = void 0;
const dateFilter_1 = require("../../utils/dateFilter");
const database_1 = require("../../config/database");
exports.indicatorValueRepository = {
    findAll: async (q) => {
        const offset = (q.page - 1) * q.limit;
        const conds = [];
        const params = [];
        let idx = 1;
        if (q.indicator_id) {
            conds.push(`indicator_id = $${idx++}`);
            params.push(q.indicator_id);
        }
        if (q.direction_id) {
            conds.push(`direction_id = $${idx++}`);
            params.push(q.direction_id);
        }
        if (q.region_id) {
            conds.push(`region_id = $${idx++}`);
            params.push(q.region_id);
        }
        if (q.date) {
            conds.push(`date = $${idx++}`);
            params.push(q.date);
        }
        if (q.from || q.to) {
            conds.push((0, dateFilter_1.dateFilter)(q.from, q.to));
        }
        const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
        const [rows, count] = await Promise.all([
            database_1.db.query(`SELECT * FROM indicator_values ${where} ORDER BY date DESC LIMIT $${idx} OFFSET $${idx + 1}`, [...params, q.limit, offset]),
            database_1.db.query(`SELECT COUNT(*) FROM indicator_values ${where}`, params),
        ]);
        return { rows: rows.rows, total: parseInt(count.rows[0].count, 10) };
    },
    findById: async (id) => {
        const r = await database_1.db.query('SELECT * FROM indicator_values WHERE id = $1', [id]);
        return r.rows[0] || null;
    },
    create: async (dto) => {
        const r = await database_1.db.query(`INSERT INTO indicator_values (indicator_id, direction_id, region_id, score, value, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT ON CONSTRAINT uq_indicator_values_indicator_region_date
       DO UPDATE SET
         score        = EXCLUDED.score,
         value        = EXCLUDED.value,
         direction_id = EXCLUDED.direction_id,
         updated_at   = NOW()
       RETURNING *`, [dto.indicator_id, dto.direction_id, dto.region_id, dto.score ?? 0, dto.value ?? 0, dto.date]);
        return r.rows[0];
    },
    update: async (id, dto) => {
        const fields = Object.keys(dto);
        if (!fields.length)
            return exports.indicatorValueRepository.findById(id);
        const set = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
        const r = await database_1.db.query(`UPDATE indicator_values SET ${set} WHERE id = $1 RETURNING *`, [id, ...Object.values(dto)]);
        return r.rows[0] || null;
    },
    delete: async (id) => {
        const r = await database_1.db.query('DELETE FROM indicator_values WHERE id = $1', [id]);
        return (r.rowCount ?? 0) > 0;
    },
    deleteByDate: async (date) => {
        const r = await database_1.db.query('DELETE FROM indicator_values WHERE date = $1', [date]);
        return r.rowCount ?? 0;
    },
    bulkCreate: async (dto) => {
        if (!dto.items.length)
            return { inserted: 0 };
        // Deduplicate: bir xil (indicator_id, region_id, date) bo'lsa oxirgisi qoladi
        const seen = new Map();
        for (const item of dto.items) {
            const key = `${item.indicator_id}__${item.region_id}__${item.date}`;
            seen.set(key, item);
        }
        const items = Array.from(seen.values());
        const values = [];
        const placeholders = items.map((item, i) => {
            const b = i * 6;
            values.push(item.indicator_id, item.direction_id, item.region_id, item.score ?? 0, item.value ?? 0, item.date);
            return `($${b + 1}, $${b + 2}, $${b + 3}, $${b + 4}, $${b + 5}, $${b + 6})`;
        }).join(', ');
        const r = await database_1.db.query(`INSERT INTO indicator_values (indicator_id, direction_id, region_id, score, value, date)
       VALUES ${placeholders}
       ON CONFLICT ON CONSTRAINT uq_indicator_values_indicator_region_date
       DO UPDATE SET
         score        = EXCLUDED.score,
         value        = EXCLUDED.value,
         direction_id = EXCLUDED.direction_id,
         updated_at   = NOW()`, values);
        return { inserted: r.rowCount ?? 0 };
    },
};
//# sourceMappingURL=indicator-value.repository.js.map