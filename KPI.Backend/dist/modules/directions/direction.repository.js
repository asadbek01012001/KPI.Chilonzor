"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directionRepository = void 0;
const database_1 = require("../../config/database");
exports.directionRepository = {
    findAll: async (q) => {
        const offset = (q.page - 1) * q.limit;
        const where = q.search ? 'WHERE name ILIKE $3' : '';
        const params = q.search ? [q.limit, offset, `%${q.search}%`] : [q.limit, offset];
        const countParams = q.search ? [`%${q.search}%`] : [];
        const [rows, count] = await Promise.all([
            database_1.db.query(`SELECT * FROM directions ${where} ORDER BY index ASC LIMIT $1 OFFSET $2`, params),
            database_1.db.query(`SELECT COUNT(*) FROM directions ${where}`, countParams),
        ]);
        return { rows: rows.rows, total: parseInt(count.rows[0].count, 10) };
    },
    findById: async (id) => {
        const r = await database_1.db.query('SELECT * FROM directions WHERE id = $1', [id]);
        return r.rows[0] || null;
    },
    create: async (dto) => {
        const r = await database_1.db.query('INSERT INTO directions (name) VALUES ($1) RETURNING *', [dto.name]);
        return r.rows[0];
    },
    update: async (id, dto) => {
        const r = await database_1.db.query('UPDATE directions SET name = $2 WHERE id = $1 RETURNING *', [id, dto.name]);
        return r.rows[0] || null;
    },
    delete: async (id) => {
        const r = await database_1.db.query('DELETE FROM directions WHERE id = $1', [id]);
        return (r.rowCount ?? 0) > 0;
    },
};
//# sourceMappingURL=direction.repository.js.map