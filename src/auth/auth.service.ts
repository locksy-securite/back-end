import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import jwt, { SignOptions } from 'jsonwebtoken';
import { randomBytes, timingSafeEqual } from 'crypto';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class AuthService {
  private jwtSecret: string;
  private jwtExpiry: string;
  private refreshExpiryDays: number;

  constructor(private readonly db: DatabaseService) {
    this.jwtSecret = process.env.JWT_SECRET ?? 'change_this_secret';
    this.jwtExpiry = process.env.JWT_EXPIRY ?? '15m';
    this.refreshExpiryDays = Number(process.env.REFRESH_EXP_DAYS ?? 30);
  }

  // Accès au pool PostgreSQL
  private get pool(): Pool {
    return (this.db as any).pool as Pool;
  }

  // Wrapper typé pour toutes les requêtes PostgreSQL
  private async query<T extends object>(
    text: string,
    params: any[] = []
  ): Promise<QueryResult<T>> {
    const result = await this.pool.query(text, params);
    return result as QueryResult<T>; // rowCount et rows reconnus
  }

  // Génère un sel aléatoire
  generateSalt(len = 16): string {
    return randomBytes(len).toString('hex');
  }

  // Génère un JWT avec expiresIn sûr
  private signToken(payload: Record<string, unknown>): string {
    const expiresIn: string = this.jwtExpiry?.trim() || '15m'; // Force string
    return jwt.sign(payload, this.jwtSecret, { expiresIn } as SignOptions);
  }

  // Enregistrement d'un utilisateur
  async register(email: string, passwordHashHex: string, saltHex: string) {
    const r = await this.query<{ id_user: string }>(
      'SELECT id_user FROM users WHERE email = $1',
      [email]
    );

    if (r.rows.length > 0) throw new ConflictException('User already exists');

    await this.query(
      'INSERT INTO users(email, password_hash, salt) VALUES ($1, $2::bytea, $3::bytea)',
      [email, Buffer.from(passwordHashHex, 'hex'), Buffer.from(saltHex, 'hex')]
    );

    return { ok: true };
  }

  // Récupère le sel d'un utilisateur
  async getSalt(email: string): Promise<string | null> {
    const r = await this.query<{ salt: Buffer }>(
      'SELECT salt FROM users WHERE email = $1',
      [email]
    );

    if (r.rows.length === 0) return null;
    return r.rows[0].salt.toString('hex');
  }

  // Création d'un refresh token
  async createRefreshToken(userId: string): Promise<string> {
    const token = jwt.sign({ sub: userId, type: 'refresh' }, this.jwtSecret, {
      expiresIn: `${this.refreshExpiryDays}d`,
    });

    await this.query('INSERT INTO refresh_tokens(user_id, token) VALUES ($1, $2)', [
      userId,
      token,
    ]);

    return token;
  }

  // Connexion
  async login(email: string, passwordHashHex: string) {
    const r = await this.query<{ id_user: string; password_hash: Buffer }>(
      'SELECT id_user, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (r.rows.length === 0) throw new UnauthorizedException('Invalid credentials');

    const stored = r.rows[0].password_hash;
    const incoming = Buffer.from(passwordHashHex, 'hex');

    if (stored.length !== incoming.length || !timingSafeEqual(stored, incoming)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userId = r.rows[0].id_user;
    const token = this.signToken({ sub: userId });
    const refreshToken = await this.createRefreshToken(userId);

    return { token, refreshToken };
  }

  // Rafraîchissement du token
  async refresh(refreshToken: string) {
    let payload: any;
    try {
      payload = jwt.verify(refreshToken, this.jwtSecret) as any;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const r = await this.query<{ id: string }>(
      'SELECT id FROM refresh_tokens WHERE token = $1',
      [refreshToken]
    );

    if (r.rows.length === 0) throw new UnauthorizedException('Invalid refresh token');

    const userId = payload.sub;
    const token = this.signToken({ sub: userId });
    return { token };
  }

  // Déconnexion
  async logout(refreshToken: string) {
    await this.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    return { ok: true };
  }
}
