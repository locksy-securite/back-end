import { Injectable } from '@nestjs/common';

// Définition du type User
interface User {
  email: string;
  name: string;
  age?: number; // optionnel
}

@Injectable()
export class AppService {
  private usersService: User[] = [];

  // Créer un utilisateur
  async create(dto: User): Promise<User> {
    this.usersService.push(dto);
    return dto;
  }

  // Trouver tous les utilisateurs
  async findAll(): Promise<User[]> {
    return this.usersService;
  }

  // Trouver un utilisateur par email
  async findOne(email: string): Promise<User | undefined> {
    return this.usersService.find(user => user.email === email);
  }

  // Supprimer un utilisateur par email
  async remove(email: string): Promise<void> {
    this.usersService = this.usersService.filter(user => user.email !== email);
  }

  // Mettre à jour un utilisateur par email
  async update(email: string, dto: Partial<User>): Promise<User | null> {
    const userIndex = this.usersService.findIndex(user => user.email === email);
    if (userIndex === -1) {
      return null;
    }
    this.usersService[userIndex] = { ...this.usersService[userIndex], ...dto };
    return this.usersService[userIndex];
  }
}
