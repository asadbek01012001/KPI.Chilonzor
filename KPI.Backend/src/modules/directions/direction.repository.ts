import { db } from '../../config/database';
import { Direction } from './direction.entity';
import { CreateDirectionDtoType, UpdateDirectionDtoType, DirectionPaginationDtoType } from './direction.dto';

export const directionRepository = {
  findAll: async (q: DirectionPaginationDtoType): Promise<{ rows: Direction[]; total: number }> => {
    const offset = (q.page - 1) * q.limit;
    const where = q.search ? 'WHERE name ILIKE $3' : '';
    const params = q.search ? [q.limit, offset, `%${q.search}%`] : [q.limit, offset];
    const countParams = q.search ? [`%${q.search}%`] : [];
    const [rows, count] = await Promise.all([
      db.query<Direction>(`SELECT * FROM directions ${where} ORDER BY index ASC LIMIT $1 OFFSET $2`, params),
      db.query<{ count: string }>(`SELECT COUNT(*) FROM directions ${where}`, countParams),
    ]);
    return { rows: rows.rows, total: parseInt(count.rows[0].count, 10) };
  },
  findById: async (id: string): Promise<Direction | null> => {
    const r = await db.query<Direction>('SELECT * FROM directions WHERE id = $1', [id]);
    return r.rows[0] || null;
  },
  create: async (dto: CreateDirectionDtoType): Promise<Direction> => {
    const r = await db.query<Direction>('INSERT INTO directions (name) VALUES ($1) RETURNING *', [dto.name]);
    return r.rows[0];
  },
  update: async (id: string, dto: UpdateDirectionDtoType): Promise<Direction | null> => {
    const r = await db.query<Direction>('UPDATE directions SET name = $2 WHERE id = $1 RETURNING *', [id, dto.name]);
    return r.rows[0] || null;
  },
  delete: async (id: string): Promise<boolean> => {
    const r = await db.query('DELETE FROM directions WHERE id = $1', [id]);
    return (r.rowCount ?? 0) > 0;
  },
};
