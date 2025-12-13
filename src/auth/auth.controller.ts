import { Body, Controller, Post, Res, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SaltDto } from './dto/salt.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt.guard';
import type { JwtPayload } from 'jsonwebtoken';
export interface RequestWithUser extends Request {
  user?: JwtPayload & { sub: string };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User registered successfully, tokens returned in headers' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid registration data' })
  @ApiResponse({ status: 409, description: 'Conflict - User already exists' })
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.auth.register(
      body.email,
      body.passwordHash,
      body.salt,
      body.envelope
    );


    //  Stockage dans les headers au lieu des cookies
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.setHeader('X-Refresh-Token', refreshToken);

    return { message: 'Registration successful' };
  }

  @Post('salt')
  @ApiOperation({ summary: 'Get salt for password hashing during registration' })
  @ApiResponse({ status: 200, description: 'Salt returned for password hashing' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid email' })
  async salt(@Body() body: SaltDto) {
    
    const salt = await this.auth.getSalt( body.email);
    return { salt };
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and return JWT tokens' })
  @ApiResponse({ status: 200, description: 'Login successful, tokens returned in response and headers' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid login data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many login attempts' })
async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
  const { accessToken, refreshToken } = await this.auth.login(
    body.email,
    body.passwordHash,
    body.envelope
  );

  //  Stockage dans les headers
  res.setHeader('Authorization', `Bearer ${accessToken}`);
  res.setHeader('X-Refresh-Token', refreshToken);

  //  Retourner les tokens directement dans la réponse JSON
  return {
    message: 'Login successful',
    accessToken,
    refreshToken,
  };
}

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'New access token issued, returned in headers' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid or missing refresh token' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid refresh token' })
  async refresh(@Body() body: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
    const oldRefreshToken = body.refreshToken;
    if (!oldRefreshToken) throw new Error('No refresh token');

    const { accessToken, refreshToken: newRefreshToken } = await this.auth.refresh(oldRefreshToken);

    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.setHeader('X-Refresh-Token', newRefreshToken);

    return { message: 'Token refreshed' };
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const refreshToken = req.headers['x-refresh-token'] as string;
    if (refreshToken) await this.auth.logout(refreshToken);

    return { message: 'Logout successful' };
  }
}
