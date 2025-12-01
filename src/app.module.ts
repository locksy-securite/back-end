// src/app.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/user.module';
//import { DatabaseModule } from './database/database.module';
//import { User } from './users/user.entity';
import { DatabaseModule } from "./database/database.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./users/user.model";

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT ?? '5432', 10),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      autoLoadEntities: true, // charge toutes les entités automatiquement
      synchronize: true,      // ⚠️ pratique en dev, à éviter en prod
    }), UsersModule],
  exports: [],
})
export class AppModule {}
