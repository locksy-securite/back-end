import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<{ id_user: string; email: string }> {
    const user = await this.userRepository.findOne({ where: { id_user: id } });
    if (!user) throw new NotFoundException('User not found');
    return { id_user: user.id_user, email: user.email };
  }

  async deleteUser(id: string): Promise<{ ok: boolean }> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return { ok: true };
  }
}
