import { Controller, Delete, Get, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Request } from 'express';

// Définir un type pour l'utilisateur issu du JWT
interface JwtUser {
  sub: string; // identifiant de l'utilisateur
}

// Étendre Request pour inclure la propriété user typée
interface RequestWithUser extends Request {
  user?: JwtUser;
}

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(
    @Req() req: RequestWithUser
  ): Promise<{ id_user: string; email: string }> {
    const userId: string | undefined = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    return await this.users.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@Req() req: RequestWithUser): Promise<{ ok: boolean }> {
    const userId: string | undefined = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    return await this.users.deleteUser(userId);
  }
}
