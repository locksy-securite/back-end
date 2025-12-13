import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePasswordDto {
  @ApiPropertyOptional({
    type: 'string',
    description: 'Updated name of the password entry',
    example: 'Updated Password',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Updated username associated with the password',
    example: 'updatedusername',
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Updated encrypted password data',
    example: 'U2FsdGVkX1+UPDATED_ENCRYPTED_PASSWORD',
  })
  @IsString()
  @IsOptional()
  secret?: string; // encrypted string, will be converted to Buffer if provided
}
