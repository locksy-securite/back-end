import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseService } from '../database/database.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Module({
  imports: [],
  providers: [UsersService, DatabaseService, JwtAuthGuard],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
