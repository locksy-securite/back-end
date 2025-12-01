import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async findById(id: string) {
    const pool = (this.db as any).pool as import('pg').Pool;
    const r = await pool.query('SELECT id_user, email FROM users WHERE id_user = $1', [id]);
    if (r.rowCount === 0) throw new NotFoundException('User not found');
    return r.rows[0];
  }

  async deleteUser(id: string) {
    const pool = (this.db as any).pool as import('pg').Pool;
    await pool.query('DELETE FROM users WHERE id_user = $1', [id]);
    return { ok: true };
  }
}
