import { Body, Controller, Post, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SaltDto } from './dto/salt.dto';
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
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.auth.register(
      body.email,
      body.passwordHash,
      body.salt,
      body.envelope
    );

    console.log("REGISTERED USER:", body.email ,"salt:" + body.salt , "mdp:" + body.passwordHash);

    //  Stockage dans les headers au lieu des cookies
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.setHeader('X-Refresh-Token', refreshToken);

    return { message: 'Registration successful' };
  }

  @Post('salt')
  async salt(@Req() req: RequestWithUser, @Body() body: SaltDto) {
    
    const salt = await this.auth.getSalt( body.email);
    return { salt };
  }

  @Post('login')
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
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const oldRefreshToken = req.headers['x-refresh-token'] as string;
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
