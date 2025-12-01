import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('passwords')
export class Password {
  @PrimaryGeneratedColumn('uuid')
  id_password: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column({ type: 'bytea' })
  secret: Buffer;

  @ManyToOne(() => User, user => user.passwords, { onDelete: 'CASCADE' })
  user: User;
}
