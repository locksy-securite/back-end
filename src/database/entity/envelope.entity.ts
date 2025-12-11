import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum EnvelopeType {
  REGISTRATION = 'registration',
  LOGIN = 'login',
}

@Entity('envelopes')
export class Envelope {
  @PrimaryGeneratedColumn('uuid')
  id_envelope: string;

  @Column({ type: 'enum', enum: EnvelopeType })
  type: EnvelopeType;

  @Column({ type: 'jsonb' })
  aad_json: any;

  @Column({ type: 'text' })
  data_b64: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  created_at: Date;

  @ManyToOne(() => User, user => user.envelopes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })   
  user: User;
}
