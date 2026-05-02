import { dateFilter } from '../../utils/dateFilter';
import { db } from '../../config/database';
import { IndicatorValue } from './indicator-value.entity';
import { CreateIndicatorValueDtoType, UpdateIndicatorValueDtoType, IndicatorValuePaginationDtoType, BulkCreateIndicatorValueDtoType } from './indicator-value.dto';

export const indicatorValueRepository = {
  findAll: async (q: IndicatorValuePaginationDtoType): Promise<{ rows: IndicatorValue[]; total: number }> => {
    const offset = (q.page - 1) * q.limit;
    const conds: string[] = []; const params: unknown[] = []; let idx = 1;
    if (q.indicator_id) { conds.push(`indicator_id = $${idx++}`); params.push(q.indicator_id); }
    if (q.direction_id) { conds.push(`direction_id = $${idx++}`); params.push(q.direction_id); }
    if (q.region_id)    { conds.push(`region_id = $${idx++}`);    params.push(q.region_id); }
    if (q.date)         { conds.push(`date = $${idx++}`);         params.push(q.date); }
    if (q.from || q.to) { conds.push(dateFilter(q.from, q.to)); }
    const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
    const [rows, count] = await Promise.all([
      db.query<IndicatorValue>(`SELECT * FROM indicator_values ${where} ORDER BY date DESC LIMIT $${idx} OFFSET $${idx+1}`, [...params, q.limit, offset]),
      db.query<{ count: string }>(`SELECT COUNT(*) FROM indicator_values ${where}`, params),
    ]);
    return { rows: rows.rows, total: parseInt(count.rows[0].count, 10) };
  },
  findById: async (id: string): Promise<IndicatorValue | null> => {
    const r = await db.query<IndicatorValue>('SELECT * FROM indicator_values WHERE id = $1', [id]);
    return r.rows[0] || null;
  },
  create: async (dto: CreateIndicatorValueDtoType): Promise<IndicatorValue> => {
    const r = await db.query<IndicatorValue>(
      `INSERT INTO indicator_values (indicator_id, direction_id, region_id, score, value, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT ON CONSTRAINT uq_indicator_values_indicator_region_date
       DO UPDATE SET
         score        = EXCLUDED.score,
         value        = EXCLUDED.value,
         direction_id = EXCLUDED.direction_id,
         updated_at   = NOW()
       RETURNING *`,
      [dto.indicator_id, dto.direction_id, dto.region_id, dto.score ?? 0, dto.value ?? 0, dto.date]
    );
    return r.rows[0];
  },
  update: async (id: string, dto: UpdateIndicatorValueDtoType): Promise<IndicatorValue | null> => {
    const fields = Object.keys(dto);
    if (!fields.length) return indicatorValueRepository.findById(id);
    const set = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const r = await db.query<IndicatorValue>(`UPDATE indicator_values SET ${set} WHERE id = $1 RETURNING *`, [id, ...Object.values(dto)]);
    return r.rows[0] || null;
  },
  delete: async (id: string): Promise<boolean> => {
    const r = await db.query('DELETE FROM indicator_values WHERE id = $1', [id]);
    return (r.rowCount ?? 0) > 0;
  },

  bulkCreate: async (dto: BulkCreateIndicatorValueDtoType): Promise<{ inserted: number }> => {
    if (!dto.items.length) return { inserted: 0 };

    // Deduplicate: bir xil (indicator_id, region_id, date) bo'lsa oxirgisi qoladi
    const seen = new Map<string, typeof dto.items[0]>();
    for (const item of dto.items) {
      const key = `${item.indicator_id}__${item.region_id}__${item.date}`;
      seen.set(key, item);
    }
    const items = Array.from(seen.values());

    const values: unknown[] = [];
    const placeholders = items.map((item, i) => {
      const b = i * 6;
      values.push(item.indicator_id, item.direction_id, item.region_id, item.score ?? 0, item.value ?? 0, item.date);
      return `($${b+1}, $${b+2}, $${b+3}, $${b+4}, $${b+5}, $${b+6})`;
    }).join(', ');
    const r = await db.query(
      `INSERT INTO indicator_values (indicator_id, direction_id, region_id, score, value, date)
       VALUES ${placeholders}
       ON CONFLICT ON CONSTRAINT uq_indicator_values_indicator_region_date
       DO UPDATE SET
         score        = EXCLUDED.score,
         value        = EXCLUDED.value,
         direction_id = EXCLUDED.direction_id,
         updated_at   = NOW()`,
      values
    );
    return { inserted: r.rowCount ?? 0 };
  },
};