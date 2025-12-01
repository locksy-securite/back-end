import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Pool, QueryResult } from 'pg';

// Définition du type User
interface User {
  id_user: string;
  email: string;
}

// Type local pour accéder proprement au pool sans 'any'
interface DBWithPool {
  pool: Pool;
}

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  // Accès typé au pool PostgreSQL
  private get pool(): Pool {
    return (this.db as unknown as DBWithPool).pool;
  }

  async findById(id: string): Promise<User> {
    // typer la requête avec le type User pour éviter un QueryResult<any>
    const r: QueryResult<User> = await this.pool.query<User>(
      'SELECT id_user, email FROM users WHERE id_user = $1',
      [id]
    );

    if (r.rowCount === 0) throw new NotFoundException('User not found');
    return r.rows[0];
  }

  async deleteUser(id: string): Promise<{ ok: boolean }> {
    await this.pool.query('DELETE FROM users WHERE id_user = $1', [id]);
    return { ok: true };
  }
}
