import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Password } from './entity/password.entity';
import { Note } from './entity/note.entity';
import { RefreshToken } from './entity/refresh-token.entity';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT ?? '5432', 10),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      entities: [User, Password, Note, RefreshToken], // tu peux ajouter CreditCard si besoin
      synchronize: true,
      autoLoadEntities: true, //  false en prod, true seulement en dev
      ssl: false,
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
