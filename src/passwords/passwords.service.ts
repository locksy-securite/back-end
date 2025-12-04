import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Password } from '../database/entity/password.entity';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class PasswordsService {
  constructor(
    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>,
  ) {}

  async findAll(userId: string): Promise<Password[]> {
    return await this.passwordRepository.find({
      where: { user: { id_user: userId } },
    });
  }

  async findOne(id: string, userId: string): Promise<Password> {
    const password = await this.passwordRepository.findOne({
      where: { id_password: id, user: { id_user: userId } },
    });
    if (!password) throw new NotFoundException('Password not found');
    return password;
  }

  async create(createPasswordDto: CreatePasswordDto, userId: string): Promise<Password> {
    const password = this.passwordRepository.create({
      ...createPasswordDto,
      secret: Buffer.from(createPasswordDto.secret, 'hex'), // assuming hex string
      user: { id_user: userId },
    });
    return await this.passwordRepository.save(password);
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto, userId: string): Promise<Password> {
    const password = await this.findOne(id, userId);
    if (updatePasswordDto.name !== undefined) password.name = updatePasswordDto.name;
    if (updatePasswordDto.username !== undefined) password.username = updatePasswordDto.username;
    if (updatePasswordDto.secret !== undefined) password.secret = Buffer.from(updatePasswordDto.secret, 'hex');
    return await this.passwordRepository.save(password);
  }

  async remove(id: string, userId: string): Promise<{ ok: boolean }> {
    const result = await this.passwordRepository.delete({
      id_password: id,
      user: { id_user: userId },
    });
    if (result.affected === 0) throw new NotFoundException('Password not found');
    return { ok: true };
  }
}
