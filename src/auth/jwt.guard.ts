import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
  const req = context.switchToHttp().getRequest();

  // Récupération du token depuis le cookie
  const token = req.cookies?.['access_token'];

  if (!token) throw new UnauthorizedException('No token');

  try {
    const secret = this.configService.get<string>('JWT_SECRET') ?? 'change_this_secret';
    const payload = jwt.verify(token, secret);

    req.user = payload; 
    return true;
  } catch (err) {
    console.error('Erreur JWT :', err);
    throw new UnauthorizedException('Invalid token');
  }
}

}
