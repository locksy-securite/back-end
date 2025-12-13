import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    type: 'string',
    description: 'Hex string of the hashed password',
    example: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  })
  @IsString()
  @IsNotEmpty()
  passwordHash!: string;

  @ApiProperty({
    type: 'object',
    description: 'Encrypted envelope containing login data',
    additionalProperties: true,
    example: {
      type: 'login',
      aad_json: { timestamp: '2023-01-01T00:00:00Z' },
      data_b64: 'U2FsdGVkX1+...',
    },
  })
  envelope!: {
    type: 'login';
    aad_json: Record<string, unknown>;
    data_b64: string;
  };
}
