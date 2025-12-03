import { IsString, IsOptional } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string; // encrypted string, will be converted to Buffer if provided
}
