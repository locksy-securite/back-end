import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PasswordsModule } from './passwords/passwords.module';
import { NotesModule } from './notes/notes.module';
@Module({
  imports: [
    AuthModule,
    UsersModule,
    PasswordsModule,
    NotesModule,
  ],
})
export class AppModule {}
