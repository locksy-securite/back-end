import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] || req.headers['Authorization'];
    if (!auth) throw new UnauthorizedException('No token');

    const parts = (auth as string).split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') throw new UnauthorizedException('Invalid token');

    const token = parts[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'change_this_secret');
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
