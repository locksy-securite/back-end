import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    type: 'string',
    description: 'JWT refresh token obtained from login/register response - replace this example with your actual refresh token',
    example: 'your_actual_refresh_token_here_from_login_response',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
