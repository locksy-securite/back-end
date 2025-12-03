import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordsService } from './passwords.service';
import { PasswordsController } from './passwords.controller';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { DatabaseModule } from '../database/database.module';
import { Password } from '../database/entity/password.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Password])],
  providers: [PasswordsService, JwtAuthGuard],
  controllers: [PasswordsController],
  exports: [PasswordsService],
})
export class PasswordsModule {}
