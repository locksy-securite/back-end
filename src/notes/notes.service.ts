import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../database/entity/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async findAll(userId: string): Promise<Note[]> {
    return await this.noteRepository.find({
      where: { user: { id_user: userId } },
    });
  }

  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id_note: id, user: { id_user: userId } },
    });
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const note = this.noteRepository.create({
      ...createNoteDto,
      content: Buffer.from(createNoteDto.content, 'hex'), // assuming hex string
      user: { id_user: userId },
    });
    return await this.noteRepository.save(note);
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string): Promise<Note> {
    const note = await this.findOne(id, userId);
    if (updateNoteDto.title !== undefined) note.title = updateNoteDto.title;
    if (updateNoteDto.content !== undefined) note.content = Buffer.from(updateNoteDto.content, 'hex');
    return await this.noteRepository.save(note);
  }

  async remove(id: string, userId: string): Promise<{ ok: boolean }> {
    const result = await this.noteRepository.delete({
      id_note: id,
      user: { id_user: userId },
    });
    if (result.affected === 0) throw new NotFoundException('Note not found');
    return { ok: true };
  }
}
