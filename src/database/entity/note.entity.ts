import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id_note: string;

  @Column()
  title: string;

  @Column({ type: 'bytea' })
  content: Buffer;

  @ManyToOne(() => User, user => user.notes, { onDelete: 'CASCADE' })
  user: User;
}
