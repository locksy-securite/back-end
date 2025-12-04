import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { timingSafeEqual } from 'crypto';

@Injectable()
export class AuthService {
  private jwtSecret: string;
  private jwtExpiry: string;
  private refreshExpiryDays: number;

  constructor(
    private readonly db: DatabaseService,
    private readonly config: ConfigService,
  ) {
    this.jwtSecret = this.config.get<string>('JWT_SECRET')!;
    this.jwtExpiry = this.config.get<string>('JWT_EXPIRATION_TIME')!;  // ex: "15m"
    this.refreshExpiryDays = Number(this.config.get<string>('REFRESH_EXP_DAYS')!); // ex: 7
  }

  private async query(sql: string, params: unknown[] = []) {
    return this.db['dataSource'].query(sql, params);
  }

  // Récupérer le salt pour le hash côté front
  async getSalt(userId: string, email: string): Promise<string | null> {
  const r = await this.query(
    'SELECT salt FROM users WHERE id_user = $1 AND email = $2',
    [userId, email],
  );
  if (r.length === 0) return null;
  return r[0].salt.toString('hex');
}


  // Register : on stocke le hash et le salt envoyés par le front
  async register(email: string, passwordHashHex: string, saltHex: string) {
    const r = await this.query('SELECT id_user FROM users WHERE email = $1', [email]);
    if (r.length > 0) throw new ConflictException('User already exists');

    await this.query(
      `INSERT INTO users(email, password_hash, salt)
       VALUES ($1::text, $2::bytea, $3::bytea)`,
      [email, Buffer.from(passwordHashHex, 'hex'), Buffer.from(saltHex, 'hex')],
    );

    return { ok: true };
  }

  // Login : vérifie que le hash côté front correspond au hash en DB
  async login(email: string, passwordHashHex: string) {
    const r = await this.query(
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

  // Crée un JWT
  private signToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiry } as SignOptions);
  }

  // Création et stockage d'un refresh token
  async createRefreshToken(userId: string) {
    const token = jwt.sign({ sub: userId, type: 'refresh' }, this.jwtSecret, {
      expiresIn: `${this.refreshExpiryDays}d`,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.refreshExpiryDays);

    await this.query(
      `INSERT INTO refresh_tokens(user_id, token, "expiresAt", "createdAt")
       VALUES ($1, $2, $3, NOW())`,
      [userId, token, expiresAt],
    );

    return token;
  }

  // Refresh token avec rotation
  async refresh(oldRefreshToken: string) {
    let payload: JwtPayload;

    try {
      payload = jwt.verify(oldRefreshToken, this.jwtSecret) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Vérifie que le refresh token existe
    const r = await this.query(
      'SELECT id, user_id FROM refresh_tokens WHERE token = $1',
      [oldRefreshToken],
    );
    if (r.length === 0) throw new UnauthorizedException('Invalid refresh token');

    const userId = payload.sub as string;

    // Supprime l'ancien refresh token (rotation)
    await this.query('DELETE FROM refresh_tokens WHERE token = $1', [oldRefreshToken]);

    // Crée un nouveau refresh token
    const newRefreshToken = await this.createRefreshToken(userId);

    // Crée un nouvel access token
    const token = this.signToken({ sub: userId });

    return { token, refreshToken: newRefreshToken };
  }

  // Logout : supprime le refresh token
  async logout(refreshToken: string) {
    await this.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    return { ok: true };
  }
}
