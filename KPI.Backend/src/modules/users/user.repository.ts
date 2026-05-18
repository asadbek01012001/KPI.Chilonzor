import { db } from '../../config/database';
import { User } from './user.entity';

interface FindAllOptions {
  page:   number;
  limit:  number;
  search?: string;
  role?:   string;
}

export const userRepository = {
  findAll: async ({ page, limit, search, role }: FindAllOptions): Promise<{ rows: User[]; total: number }> => {
    const offset = (page - 1) * limit;

    // Count query params (no limit/offset)
    const countParams: any[] = [];
    const countConds: string[] = [];
    if (search) {
      countConds.push(`(name ILIKE $${countParams.length + 1} OR email ILIKE $${countParams.length + 1})`);
      countParams.push(`%${search}%`);
    }
    if (role) {
      countConds.push(`role = $${countParams.length + 1}`);
      countParams.push(role);
    }
    const countWhere = countConds.length ? `WHERE ${countConds.join(' AND ')}` : '';

    // Data query params (limit=$1, offset=$2, then filters)
    const dataParams: any[] = [limit, offset];
    const dataConds: string[] = [];
    if (search) {
      dataConds.push(`(name ILIKE $${dataParams.length + 1} OR email ILIKE $${dataParams.length + 1})`);
      dataParams.push(`%${search}%`);
    }
    if (role) {
      dataConds.push(`role = $${dataParams.length + 1}`);
      dataParams.push(role);
    }
    const dataWhere = dataConds.length ? `WHERE ${dataConds.join(' AND ')}` : '';

    const [rows, countResult] = await Promise.all([
      db.query<User>(`SELECT * FROM users ${dataWhere} ORDER BY created_at DESC LIMIT $1 OFFSET $2`, dataParams),
      db.query<{ count: string }>(`SELECT COUNT(*) FROM users ${countWhere}`, countParams),
    ]);

    return { rows: rows.rows, total: parseInt(countResult.rows[0].count, 10) };
  },

  findById: async (id: string): Promise<User | null> => {
    const result = await db.query<User>('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  findByEmail: async (email: string): Promise<User | null> => {
    const result = await db.query<User>('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  create: async (data: {
    name: string; email: string; password_hash: string; role?: string;
  }): Promise<User> => {
    const result = await db.query<User>(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.name, data.email, data.password_hash, data.role || 'user']
    );
    return result.rows[0];
  },

  update: async (id: string, data: Partial<User>): Promise<User | null> => {
    const fields = Object.keys(data);
    if (!fields.length) return userRepository.findById(id);

    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const values    = Object.values(data);

    const result = await db.query<User>(
      `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0] || null;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await db.query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },

  updateRefreshToken: async (id: string, token: string | null): Promise<void> => {
    await db.query('UPDATE users SET refresh_token = $2 WHERE id = $1', [id, token]);
  },

  updateLastLogin: async (id: string): Promise<void> => {
    await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [id]);
  },
};
