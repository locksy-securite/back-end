import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { randomBytes, timingSafeEqual } from 'crypto';

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

  private async query<T extends object>(sql: string, params: unknown[] = []) {
    return this.db['dataSource'].query(sql, params) as Promise<{ rows: T[] }>;
  }

  generateSalt(len = 16): string {
    return randomBytes(len).toString('hex');
  }

  private signToken(payload: Record<string, unknown>): string {
    const expiresIn: string = this.jwtExpiry?.trim() || '15m';
    return jwt.sign(payload, this.jwtSecret, { expiresIn } as SignOptions);
  }

  async register(email: string, passwordHashHex: string, saltHex: string) {
    const r = await this.db['dataSource'].query(
      'SELECT id_user FROM users WHERE email = $1',
      [email],
    );

    if (r.length > 0) throw new ConflictException('User already exists');

    await this.db['dataSource'].query(
      'INSERT INTO users(email, password_hash, salt) VALUES ($1::text, $2::bytea, $3::bytea)',
      [email, Buffer.from(passwordHashHex, 'hex'), Buffer.from(saltHex, 'hex')],
    );

    return { ok: true };
  }

  async getSalt(email: string): Promise<string | null> {
    const r = await this.db['dataSource'].query(
      'SELECT salt FROM users WHERE email = $1',
      [email],
    );

    if (r.length === 0) return null;
    return r[0].salt.toString('hex');
  }

  async login(email: string, passwordHashHex: string) {
    const r = await this.db['dataSource'].query(
      'SELECT id_user, password_hash FROM users WHERE email = $1',
      [email],
    );

    if (r.length === 0) throw new UnauthorizedException('Invalid credentials');

    const stored = r[0].password_hash;
    const incoming = Buffer.from(passwordHashHex, 'hex');

    if (stored.length !== incoming.length || !timingSafeEqual(stored, incoming)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userId = r[0].id_user;
    const token = this.signToken({ sub: userId });
    const refreshToken = await this.createRefreshToken(userId);

    return { token, refreshToken };
  }

 async createRefreshToken(userId: string) {
  const token = jwt.sign({ sub: userId, type: 'refresh' }, this.jwtSecret, {
    expiresIn: `${this.refreshExpiryDays}d`,
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + this.refreshExpiryDays);

  await this.db['dataSource'].query(
    `
    INSERT INTO refresh_tokens(user_id, token, "expiresAt", "createdAt")
    VALUES ($1, $2, $3, NOW())
    `,
    [userId, token, expiresAt],
  );

  return token;
}


  async refresh(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = jwt.verify(refreshToken, this.jwtSecret) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const r = await this.db['dataSource'].query(
      'SELECT id FROM refresh_tokens WHERE token = $1',
      [refreshToken],
    );

    if (r.length === 0) throw new UnauthorizedException('Invalid refresh token');

    const userId = payload.sub as string;
    const token = this.signToken({ sub: userId });
    return { token };
  }

  async logout(refreshToken: string) {
    await this.db['dataSource'].query(
      'DELETE FROM refresh_tokens WHERE token = $1',
      [refreshToken],
    );
    return { ok: true };
  }
}
