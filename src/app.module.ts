import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PasswordsModule } from './passwords/passwords.module';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';
import { CsrfMiddleware } from './csrf.middleware';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Appliquer le middleware CSRF globalement à toutes les routes
    consumer.apply(CsrfMiddleware).forRoutes('*');
  }
}
