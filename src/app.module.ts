import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PasswordsModule } from './passwords/passwords.module';
import { NotesModule } from './notes/notes.module';
import { UserModule, UsersModule } from './users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Disponible partout
    }),
    AuthModule,
    PasswordsModule,
    NotesModule,
   UsersModule,
  ],
})
export class AppModule {}
