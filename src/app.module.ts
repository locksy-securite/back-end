import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PasswordsModule } from './passwords/passwords.module';
import { NotesModule } from './notes/notes.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Disponible partout
    }),
    AuthModule,
    UsersModule,
    PasswordsModule,
    NotesModule,
  ],
})
export class AppModule {}
