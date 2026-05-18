"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionRepository = void 0;
const database_1 = require("../../config/database");
exports.regionRepository = {
    findAll: async (q) => {
        const offset = (q.page - 1) * q.limit;
        const conds = [];
        const params = [];
        let idx = 1;
        if (q.search) {
            conds.push(`name ILIKE $${idx++}`);
            params.push(`%${q.search}%`);
        }
        if (q.sector) {
            conds.push(`sector = $${idx++}`);
            params.push(q.sector);
        }
        const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
        const [rows, count] = await Promise.all([
            database_1.db.query(`SELECT * FROM regions ${where} ORDER BY index ASC LIMIT $${idx} OFFSET $${idx + 1}`, [...params, q.limit, offset]),
            database_1.db.query(`SELECT COUNT(*) FROM regions ${where}`, params),
        ]);
        return { rows: rows.rows, total: parseInt(count.rows[0].count, 10) };
    },
    findById: async (id) => {
        const r = await database_1.db.query('SELECT * FROM regions WHERE id = $1', [id]);
        return r.rows[0] || null;
    },
    create: async (dto) => {
        const r = await database_1.db.query('INSERT INTO regions (name, sector) VALUES ($1, $2) RETURNING *', [dto.name, dto.sector]);
        return r.rows[0];
    },
    update: async (id, dto) => {
        const fields = Object.keys(dto);
        if (!fields.length)
            return exports.regionRepository.findById(id);
        const set = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
        const r = await database_1.db.query(`UPDATE regions SET ${set} WHERE id = $1 RETURNING *`, [id, ...Object.values(dto)]);
        return r.rows[0] || null;
    },
    delete: async (id) => {
        const r = await database_1.db.query('DELETE FROM regions WHERE id = $1', [id]);
        return (r.rowCount ?? 0) > 0;
    },
};
//# sourceMappingURL=region.repository.js.map