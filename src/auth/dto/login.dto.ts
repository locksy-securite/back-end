import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  passwordHash!: string;

  envelope!: {
    type: 'login';
    aad_json: Record<string, unknown>;
    data_b64: string;
  };
}
