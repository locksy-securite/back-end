import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SaltDto {
  @ApiProperty({
    type: 'string',
    format: 'email',
    description: 'User email to retrieve salt',
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;
}
