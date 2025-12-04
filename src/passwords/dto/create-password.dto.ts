import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePasswordDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  secret: string; // encrypted string, will be converted to Buffer
}
