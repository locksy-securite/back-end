import { Controller, Delete, Get, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
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

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'User profile information' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async me(@Req() req: RequestWithUser): Promise<{ id_user: string; email: string }> {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    return await this.users.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete the current authenticated user account' })
  @ApiResponse({ status: 200, description: 'User account deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  @Delete('me')
  async deleteMe(@Req() req: RequestWithUser): Promise<{ ok: boolean }> {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    return await this.users.deleteUser(userId);
  }
}
