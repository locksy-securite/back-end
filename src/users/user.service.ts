// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    //Construction du repository User
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  //Méthode de création d'un utilisateur et hashage du mot de passe
  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Trouver un utilisateur par email
    const existingUser = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    };

    //Création de l'utilisateur avec les données fournies
    const user = this.usersRepository.create({
      email: dto.email,
      password: hashedPassword,
      // creditCard: dto.creditCard, // ⚠️ à chiffrer avec une lib crypto
    });

    return this.usersRepository.save(user);
  }

  // Méthode pour trouver un utilisateur par email
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // Méthode pour comparer les mots de passe
  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
