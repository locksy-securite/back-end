import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { DatabaseService } from '../database/database.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, DatabaseService],
  exports: [AuthService],
})
export class AuthModule {}
