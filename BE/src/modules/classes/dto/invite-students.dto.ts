import { IsArray, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteStudentsDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];
}
