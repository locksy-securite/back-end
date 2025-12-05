import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn , JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @Column()
  token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;


  @CreateDateColumn()
  createdAt: Date;
}
