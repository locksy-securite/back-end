import { Controller, Delete, Get, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

// type minimal pour le payload JWT
interface JwtUser {
  sub: string;
}

// type minimal pour la requête utilisée ici (évite les any d'Express)
interface RequestWithUser {
  user?: JwtUser;
}

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: RequestWithUser): Promise<{ id_user: string; email: string }> {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    return await this.users.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@Req() req: RequestWithUser): Promise<{ ok: boolean }> {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    return await this.users.deleteUser(userId);
  }
}
