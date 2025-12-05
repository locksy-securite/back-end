import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { DatabaseModule } from '../database/database.module';
import { User } from '../database/entity/user.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
  providers: [UsersService, JwtAuthGuard],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
