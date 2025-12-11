import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Note } from './note.entity';
import { Password } from './password.entity';
import { RefreshToken } from './refresh-token.entity';
import { Envelope } from './envelope.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'bytea' })
  password_hash: Buffer;

   @Column({ type: 'bytea' })
   salt: Buffer;

  // Relations
  @OneToMany(() => Note, note => note.user, { cascade: true })
  notes: Note[];

  @OneToMany(() => Password, password => password.user, { cascade: true })
  passwords: Password[];

@OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
refreshTokens: RefreshToken[];

@OneToMany(() => Envelope, envelope => envelope.user, { cascade: true })
envelopes: Envelope[];

  //  @OneToMany(() => CreditCard, card => card.user, { cascade: true })
  // creditCards: CreditCard[];
}
