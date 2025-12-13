import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PasswordsService } from './passwords.service';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

// type minimal pour le payload JWT
interface JwtUser {
  sub: string;
}

// type minimal pour la requête utilisée ici (évite les any d'Express)
interface RequestWithUser {
  user?: JwtUser;
}

@ApiBearerAuth('JWT-auth')
@Controller('passwords')
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all passwords for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of user passwords with secrets encoded in base64' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  @Get()
  async findAll(@Req() req: RequestWithUser) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    const passwords = await this.passwordsService.findAll(userId);
    return passwords.map(p => ({ ...p, secret: p.secret.toString('base64') }));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    const password = await this.passwordsService.findOne(id, userId);
    return { ...password, secret: password.secret.toString('base64') };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new password entry for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Password created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid password data' })
  @Post()
  async create(@Body() createPasswordDto: CreatePasswordDto, @Req() req: RequestWithUser) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    return await this.passwordsService.create(createPasswordDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an existing password entry for the authenticated user' })
  @ApiParam({ name: 'id', description: 'Password ID to update' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  @ApiResponse({ status: 404, description: 'Password not found' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid update data' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto, @Req() req: RequestWithUser) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    return await this.passwordsService.update(id, updatePasswordDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a password entry by ID for the authenticated user' })
  @ApiParam({ name: 'id', description: 'Password ID to delete' })
  @ApiResponse({ status: 200, description: 'Password deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  @ApiResponse({ status: 404, description: 'Password not found' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User not found');
    return await this.passwordsService.remove(id, userId);
  }
}
