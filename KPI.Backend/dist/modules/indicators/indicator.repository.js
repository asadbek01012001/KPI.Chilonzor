"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indicatorRepository = void 0;
const database_1 = require("../../config/database");
exports.indicatorRepository = {
    findAll: async (q) => {
        const offset = (q.page - 1) * q.limit;
        const conds = [];
        const params = [];
        let idx = 1;
        if (q.direction_id) {
            conds.push(`direction_id = $${idx++}`);
            params.push(q.direction_id);
        }
        const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
        const parentWhere = where ? `${where} AND parent_id IS NULL` : `WHERE parent_id IS NULL`;
        const parentsRes = await database_1.db.query(`SELECT * FROM indicators ${parentWhere} ORDER BY index ASC LIMIT $${idx} OFFSET $${idx + 1}`, [...params, q.limit, offset]);
        const parentRows = parentsRes.rows;
        let childrenMap = {};
        if (parentRows.length) {
            const parentIds = parentRows.map((p) => p.id);
            const childrenRes = await database_1.db.query(`SELECT * FROM indicators WHERE parent_id = ANY($1) ORDER BY index ASC`, [parentIds]);
            childrenMap = childrenRes.rows.reduce((acc, child) => {
                if (!acc[child.parent_id])
                    acc[child.parent_id] = [];
                acc[child.parent_id].push(child);
                return acc;
            }, {});
        }
        const rowsWithChildren = parentRows.map((parent) => ({
            ...parent,
            children: childrenMap[parent.id] || [],
        }));
        const countRes = await database_1.db.query(`SELECT COUNT(*) FROM indicators ${parentWhere}`, params);
        return { rows: rowsWithChildren, total: parseInt(countRes.rows[0].count, 10) };
    },
    // Barcha indikatorlar flat massiv — parent + children, index tartibida
    getFlatList: async (directionId) => {
        const res = await database_1.db.query(`SELECT * FROM indicators WHERE direction_id = $1 AND is_active = true ORDER BY index ASC`, [directionId]);
        return res.rows;
    },
    findById: async (id) => {
        const r = await database_1.db.query("SELECT * FROM indicators WHERE id = $1", [id]);
        return r.rows[0] || null;
    },
    create: async (dto) => {
        const r = await database_1.db.query(`INSERT INTO indicators (direction_id, parent_id, name, score, is_subtraction${dto.index !== undefined ? ", \"index\"" : ""})
       VALUES ($1, $2, $3, $4, $5${dto.index !== undefined ? ", $6" : ""}) RETURNING *`, dto.index !== undefined
            ? [dto.direction_id, dto.parent_id ?? null, dto.name, dto.score ?? 0, dto.is_subtraction ?? false, dto.index]
            : [dto.direction_id, dto.parent_id ?? null, dto.name, dto.score ?? 0, dto.is_subtraction ?? false]);
        return r.rows[0];
    },
    update: async (id, dto) => {
        const fields = Object.keys(dto);
        if (!fields.length)
            return exports.indicatorRepository.findById(id);
        const set = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");
        const r = await database_1.db.query(`UPDATE indicators SET ${set} WHERE id = $1 RETURNING *`, [id, ...Object.values(dto)]);
        return r.rows[0] || null;
    },
    delete: async (id) => {
        const r = await database_1.db.query("DELETE FROM indicators WHERE id = $1", [id]);
        return (r.rowCount ?? 0) > 0;
    },
};
//# sourceMappingURL=indicator.repository.js.map