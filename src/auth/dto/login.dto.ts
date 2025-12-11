import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  passwordHash!: string;

  envelope!: {
    type: 'login';
    aad_json: any;
    data_b64: string;
  };
}
