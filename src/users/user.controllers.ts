// src/users/users.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post('login')
  async login(@Body() dto: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(dto.email);
    if (user && await this.usersService.comparePassword(dto.password, user.password)) {
      return { message: 'Login successful' };
    }
    return { message: 'Invalid credentials' };
  }
}
