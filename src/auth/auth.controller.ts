import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SaltDto } from './dto/salt.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.auth.register(body.email, body.passwordHash, body.salt);
  }

  @Post('salt')
  async salt(@Body() body: SaltDto) {
    const salt = await this.auth.getSalt(body.email);
    return { salt };
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const res = await this.auth.login(body.email, body.passwordHash);
    return res; // { token, refreshToken }
  }

  @Post('refresh-token')
  async refresh(@Body() body: RefreshTokenDto) {
    return await this.auth.refresh(body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: RefreshTokenDto) {
    return await this.auth.logout(body.refreshToken);
  }
}
