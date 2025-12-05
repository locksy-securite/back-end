import { IsString, IsOptional } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  secret?: string; // encrypted string, will be converted to Buffer if provided
}
