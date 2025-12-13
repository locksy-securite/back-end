import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'user@example.com',
    description: 'User email address',
  })
  email!: string;

  @ApiProperty({
    type: 'string',
    description: 'Hex string of the hashed password',
    example: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  })
  passwordHash!: string;

  @ApiProperty({
    type: 'string',
    description: 'Hex string of the salt',
    example: '1234567890abcdef',
  })
  salt!: string;

  @ApiProperty({
    type: 'object',
    properties: {
      type: { type: 'string', example: 'registration' },
      aad_json: { type: 'object', additionalProperties: true, example: { timestamp: '2023-01-01T00:00:00Z' } },
      data_b64: { type: 'string', example: 'U2FsdGVkX1+...' },
    },
    required: ['type', 'aad_json', 'data_b64'],
    description: 'Encrypted envelope containing registration data',
  })
  envelope!: {
    type: 'registration';
    aad_json: Record<string, unknown>;
    data_b64: string;
  };
}
