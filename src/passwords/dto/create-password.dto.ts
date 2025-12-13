import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePasswordDto {
  @ApiProperty({
    type: 'string',
    example: 'My Password',
    description: 'Name of the password entry',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'myusername',
    description: 'Username associated with the password',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: 'string',
    description: 'Encrypted password data',
    example: 'U2FsdGVkX1+...',
  })
  @IsString()
  @IsNotEmpty()
  secret: string; // encrypted string, will be converted to Buffer
}
