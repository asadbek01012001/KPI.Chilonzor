import { db } from '../../config/database';
import { Region } from './region.entity';
import { CreateRegionDtoType, UpdateRegionDtoType, RegionPaginationDtoType } from './region.dto';

export const regionRepository = {
  findAll: async (q: RegionPaginationDtoType): Promise<{ rows: Region[]; total: number }> => {
    const offset = (q.page - 1) * q.limit;
    const conds: string[] = []; const params: unknown[] = []; let idx = 1;
    if (q.search) { conds.push(`name ILIKE $${idx++}`); params.push(`%${q.search}%`); }
    if (q.sector)  { conds.push(`sector = $${idx++}`);  params.push(q.sector); }
    const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
    const [rows, count] = await Promise.all([
      db.query<Region>(`SELECT * FROM regions ${where} ORDER BY index ASC LIMIT $${idx} OFFSET $${idx+1}`, [...params, q.limit, offset]),
      db.query<{ count: string }>(`SELECT COUNT(*) FROM regions ${where}`, params),
    ]);
    return { rows: rows.rows, total: parseInt(count.rows[0].count, 10) };
  },
  findById: async (id: string): Promise<Region | null> => {
    const r = await db.query<Region>('SELECT * FROM regions WHERE id = $1', [id]);
    return r.rows[0] || null;
  },
  create: async (dto: CreateRegionDtoType): Promise<Region> => {
    const r = await db.query<Region>('INSERT INTO regions (name, sector) VALUES ($1, $2) RETURNING *', [dto.name, dto.sector]);
    return r.rows[0];
  },
  update: async (id: string, dto: UpdateRegionDtoType): Promise<Region | null> => {
    const fields = Object.keys(dto);
    if (!fields.length) return regionRepository.findById(id);
    const set = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const r = await db.query<Region>(`UPDATE regions SET ${set} WHERE id = $1 RETURNING *`, [id, ...Object.values(dto)]);
    return r.rows[0] || null;
  },
  delete: async (id: string): Promise<boolean> => {
    const r = await db.query('DELETE FROM regions WHERE id = $1', [id]);
    return (r.rowCount ?? 0) > 0;
  },
};
