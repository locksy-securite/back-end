import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    type: 'string',
    description: 'Title of the note',
    example: 'My Secure Note',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: 'string',
    description: 'Encrypted content of the note',
    example: 'U2FsdGVkX1+ENCRYPTED_NOTE_CONTENT',
  })
  @IsString()
  @IsNotEmpty()
  content: string; // encrypted string, will be converted to Buffer
}
