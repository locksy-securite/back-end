import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private usersService: any[]=[];

  //Créer un utilisateur
  async create(dto: any): Promise<any> {
    this.usersService.push(dto);
    return dto;
  }

  // Trouver tous les utilisateurs
  async findAll(): Promise<any[]> {
    return this.usersService;
  }

  // Trouver un utilisateur par email
  async findOne(email: string): Promise<any> {
    return this.usersService.find(user => user.email === email);
  }

  // Supprimer un utilisateur par email
  async remove(email: string): Promise<void> {
    this.usersService = this.usersService.filter(user => user.email !== email);
  }

  // Mettre à jour un utilisateur par email
  async update(email: string, dto: any): Promise<any> {
    const userIndex = this.usersService.findIndex(user => user.email === email);
    if (userIndex === -1) {
      return null;
    }
    this.usersService[userIndex] = { ...this.usersService[userIndex], ...dto };
    return this.usersService[userIndex];
  }

}