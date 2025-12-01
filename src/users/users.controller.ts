import { Controller, Delete, Get, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any): Promise<any> {
    const userId = req.user?.sub;
    return await this.users.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@Req() req: any): Promise<any> {
    const userId = req.user?.sub;
    return await this.users.deleteUser(userId);
  }
}
