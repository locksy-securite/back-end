import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Password } from './entity/password.entity';
import { Note } from './entity/note.entity';
import { RefreshToken } from './entity/refresh-token.entity';
import { DatabaseService } from './database.service';
import { Envelope } from './entity/envelope.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT ?? '5432', 10),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      entities: [User, Password, Note, RefreshToken, Envelope], // tu peux ajouter CreditCard si besoin
      synchronize: false,
      autoLoadEntities: true, // false en prod, true seulement en dev
      ssl: {
        rejectUnauthorized: false,
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule { }
