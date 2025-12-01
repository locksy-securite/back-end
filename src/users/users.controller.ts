import { Controller, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    const userId = (req as any).user?.sub;
    return await this.users.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@Req() req: Request) {
    const userId = (req as any).user?.sub;
    return await this.users.deleteUser(userId);
  }
}
