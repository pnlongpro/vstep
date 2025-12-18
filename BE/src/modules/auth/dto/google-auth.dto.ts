import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GoogleAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Access token không được để trống' })
  accessToken: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  googleId?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  picture?: string;
}
