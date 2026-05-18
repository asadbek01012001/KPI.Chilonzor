"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const database_1 = require("../../config/database");
exports.userRepository = {
    findAll: async ({ page, limit, search }) => {
        const offset = (page - 1) * limit;
        const where = search ? `WHERE name ILIKE $3 OR email ILIKE $3` : '';
        const params = search ? [limit, offset, `%${search}%`] : [limit, offset];
        const [rows, countResult] = await Promise.all([
            database_1.db.query(`SELECT * FROM users ${where} ORDER BY created_at DESC LIMIT $1 OFFSET $2`, params),
            database_1.db.query(`SELECT COUNT(*) FROM users ${where}`, search ? [`%${search}%`] : []),
        ]);
        return { rows: rows.rows, total: parseInt(countResult.rows[0].count, 10) };
    },
    findById: async (id) => {
        const result = await database_1.db.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0] || null;
    },
    findByEmail: async (email) => {
        const result = await database_1.db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0] || null;
    },
    create: async (data) => {
        const result = await database_1.db.query(`INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4) RETURNING *`, [data.name, data.email, data.password_hash, data.role || 'user']);
        return result.rows[0];
    },
    update: async (id, data) => {
        const fields = Object.keys(data);
        if (!fields.length)
            return exports.userRepository.findById(id);
        const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
        const values = Object.values(data);
        const result = await database_1.db.query(`UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`, [id, ...values]);
        return result.rows[0] || null;
    },
    delete: async (id) => {
        const result = await database_1.db.query('DELETE FROM users WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    },
    updateRefreshToken: async (id, token) => {
        await database_1.db.query('UPDATE users SET refresh_token = $2 WHERE id = $1', [id, token]);
    },
};
//# sourceMappingURL=user.repository.js.map