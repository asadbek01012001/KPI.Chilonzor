import { db } from "../../config/database";
import { Indicator } from "./indicator.entity";
import { CreateIndicatorDtoType, UpdateIndicatorDtoType, IndicatorPaginationDtoType } from "./indicator.dto";

export const indicatorRepository = {
  findAll: async (q: IndicatorPaginationDtoType): Promise<{ rows: (Indicator & { children: Indicator[] })[]; total: number }> => {
    const offset = (q.page - 1) * q.limit;
    const conds: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (q.direction_id) { conds.push(`direction_id = $${idx++}`); params.push(q.direction_id); }

    const where       = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
    const parentWhere = where ? `${where} AND parent_id IS NULL` : `WHERE parent_id IS NULL`;

    const parentsRes = await db.query<Indicator>(
      `SELECT * FROM indicators ${parentWhere} ORDER BY index ASC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, q.limit, offset],
    );
    const parentRows = parentsRes.rows;

    let childrenMap: Record<string, Indicator[]> = {};
    if (parentRows.length) {
      const parentIds = parentRows.map((p) => p.id);
      const childrenRes = await db.query<Indicator>(
        `SELECT * FROM indicators WHERE parent_id = ANY($1) ORDER BY index ASC`,
        [parentIds],
      );
      childrenMap = childrenRes.rows.reduce((acc, child) => {
        if (!acc[child.parent_id!]) acc[child.parent_id!] = [];
        acc[child.parent_id!].push(child);
        return acc;
      }, {} as Record<string, Indicator[]>);
    }

    const rowsWithChildren = parentRows.map((parent) => ({
      ...parent,
      children: childrenMap[parent.id] || [],
    }));

    const countRes = await db.query<{ count: string }>(
      `SELECT COUNT(*) FROM indicators ${parentWhere}`,
      params,
    );

    return { rows: rowsWithChildren, total: parseInt(countRes.rows[0].count, 10) };
  },

  // Barcha indikatorlar flat massiv — parent + children, index tartibida
  getFlatList: async (directionId: string): Promise<Indicator[]> => {
    const res = await db.query<Indicator>(
      `SELECT * FROM indicators WHERE direction_id = $1 AND is_active = true ORDER BY index ASC`,
      [directionId],
    );
    return res.rows;
  },

  findById: async (id: string): Promise<Indicator | null> => {
    const r = await db.query<Indicator>("SELECT * FROM indicators WHERE id = $1", [id]);
    return r.rows[0] || null;
  },

  create: async (dto: CreateIndicatorDtoType): Promise<Indicator> => {
    const r = await db.query<Indicator>(
      `INSERT INTO indicators (direction_id, parent_id, name, score, is_subtraction${dto.index !== undefined ? ", \"index\"" : ""})
       VALUES ($1, $2, $3, $4, $5${dto.index !== undefined ? ", $6" : ""}) RETURNING *`,
      dto.index !== undefined
        ? [dto.direction_id, dto.parent_id ?? null, dto.name, dto.score ?? 0, dto.is_subtraction ?? false, dto.index]
        : [dto.direction_id, dto.parent_id ?? null, dto.name, dto.score ?? 0, dto.is_subtraction ?? false],
    );
    return r.rows[0];
  },

  update: async (id: string, dto: UpdateIndicatorDtoType): Promise<Indicator | null> => {
    const fields = Object.keys(dto);
    if (!fields.length) return indicatorRepository.findById(id);
    const set = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");
    const r = await db.query<Indicator>(
      `UPDATE indicators SET ${set} WHERE id = $1 RETURNING *`,
      [id, ...Object.values(dto)],
    );
    return r.rows[0] || null;
  },

  delete: async (id: string): Promise<boolean> => {
    const r = await db.query("DELETE FROM indicators WHERE id = $1", [id]);
    return (r.rowCount ?? 0) > 0;
  },
};
