import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { UsersController } from "./user.controllers";
import { UsersService } from "./user.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "./user.model";

//Création du module User
@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})

export class UsersModule {}