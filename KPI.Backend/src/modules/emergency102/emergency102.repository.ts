import { dateFilter } from '../../utils/dateFilter';
import { db } from '../../config/database';
import { Emergency102 } from './emergency102.entity';
import { CreateEmergency102DtoType, UpdateEmergency102DtoType, Emergency102PaginationDtoType, BulkCreateEmergency102DtoType } from './emergency102.dto';

export const emergency102Repository = {
  findAll: async (q: Emergency102PaginationDtoType): Promise<{ rows: any[]; total: number; totals: any }> => {
    const offset = (q.page - 1) * q.limit;
    const joinConds: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (q.region_id) { joinConds.push(`e.region_id = $${idx++}`); params.push(q.region_id); }
    if (q.date)      { joinConds.push(`e.date = $${idx++}`);      params.push(q.date); }
    if (q.from || q.to) { joinConds.push(dateFilter(q.from, q.to, 'e.date')); }

    const joinFilter  = joinConds.length ? `AND ${joinConds.join(' AND ')}` : '';
    const regionConds = q.region_id ? `WHERE r.id = $1` : '';

    const [rows, count] = await Promise.all([
      db.query<any>(`
        SELECT
          r.id   AS region_id,
          r.name AS region_name,
          r.sector,
          MAX(e.calls_102_score)     AS calls_102_score,
          MAX(e.pi_call_score)       AS pi_call_score,
          MAX(e.iio_complaint_score) AS iio_complaint_score,
          COALESCE(SUM(e.total_calls_102),0) AS total_calls_102,
          COALESCE(SUM(e.call_pi),0)         AS call_pi,
          COALESCE(SUM(e.iio_complaint),0)   AS iio_complaint,
          COALESCE(SUM(e.total_calls_102 * e.calls_102_score),0)
          + COALESCE(SUM(e.call_pi       * e.pi_call_score),0)
          + COALESCE(SUM(e.iio_complaint * e.iio_complaint_score),0) AS em_total_score
        FROM regions r
        LEFT JOIN emergency102 e ON e.region_id = r.id ${joinFilter}
        ${regionConds}
        GROUP BY r.id, r.name, r.sector
        ORDER BY r.index ASC
        LIMIT $${idx} OFFSET $${idx + 1}
      `, [...params, q.limit, offset]),
      db.query<{ count: string }>(`SELECT COUNT(*) FROM regions ${regionConds}`, q.region_id ? [q.region_id] : []),
    ]);

    // Ustunlar bo'yicha jami — flat fieldlar
    const totalsRes = await db.query<any>(`
      SELECT
        COALESCE(SUM(e.total_calls_102),0)::int AS total_total_calls_102,
        COALESCE(SUM(e.call_pi),0)::int         AS total_call_pi,
        COALESCE(SUM(e.iio_complaint),0)::int   AS total_iio_complaint
      FROM emergency102 e
      ${joinConds.length ? `WHERE ${joinConds.map(c => c.replace(/e\./g, '')).join(' AND ')}` : ''}
    `, params);

    return {
      rows: rows.rows,
      total: parseInt(count.rows[0].count, 10),
      totals: totalsRes.rows[0],
    };
  },

  findById: async (id: string): Promise<Emergency102 | null> => {
    const r = await db.query<Emergency102>('SELECT * FROM emergency102 WHERE id = $1', [id]);
    return r.rows[0] || null;
  },

  create: async (dto: CreateEmergency102DtoType): Promise<Emergency102> => {
    const r = await db.query<Emergency102>(
      `INSERT INTO emergency102
         (region_id,total_calls_102,call_pi,iio_complaint,calls_102_score,pi_call_score,iio_complaint_score,date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [dto.region_id,dto.total_calls_102,dto.call_pi,dto.iio_complaint,
       dto.calls_102_score,dto.pi_call_score,dto.iio_complaint_score,dto.date],
    );
    return r.rows[0];
  },

  update: async (id: string, dto: UpdateEmergency102DtoType): Promise<Emergency102 | null> => {
    const fields = Object.keys(dto);
    if (!fields.length) return emergency102Repository.findById(id);
    const set = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const r = await db.query<Emergency102>(`UPDATE emergency102 SET ${set} WHERE id = $1 RETURNING *`, [id, ...Object.values(dto)]);
    return r.rows[0] || null;
  },

  delete: async (id: string): Promise<boolean> => {
    const r = await db.query('DELETE FROM emergency102 WHERE id = $1', [id]);
    return (r.rowCount ?? 0) > 0;
  },

  bulkCreate: async (dto: BulkCreateEmergency102DtoType): Promise<{ inserted: number }> => {
    if (!dto.items.length) return { inserted: 0 };

    // Bulkdagi barcha sanalar uchun avvalgi yozuvlarni o'chirish
    const dates = [...new Set(dto.items.map((i: any) => i.date))];
    await db.query(
      `DELETE FROM emergency102 WHERE date = ANY($1::date[])`,
      [dates],
    );

    // Yangi ma'lumotlarni insert qilish
    const values: unknown[] = [];
    const placeholders = dto.items.map((item: any, i: number) => {
      const b = i * 8;
      values.push(
        item.region_id, item.total_calls_102, item.call_pi, item.iio_complaint,
        item.calls_102_score ?? 0, item.pi_call_score ?? 0, item.iio_complaint_score ?? 0, item.date,
      );
      return `($${b+1},$${b+2},$${b+3},$${b+4},$${b+5},$${b+6},$${b+7},$${b+8})`;
    }).join(', ');

    const r = await db.query(
      `INSERT INTO emergency102
         (region_id,total_calls_102,call_pi,iio_complaint,calls_102_score,pi_call_score,iio_complaint_score,date)
       VALUES ${placeholders}`,
      values,
    );
    return { inserted: r.rowCount ?? 0 };
  },
};
