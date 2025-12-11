import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    //  Récupération du token depuis le header Authorization
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('No Authorization header');

    // Format attendu : "Bearer <token>"
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization format');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET') ?? 'change_this_secret';
      const payload = jwt.verify(token, secret);

      // Attacher le payload au req.user pour l’utiliser dans les contrôleurs
      req.user = payload;
      return true;
    } catch (err) {
      console.error('Erreur JWT :', err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
