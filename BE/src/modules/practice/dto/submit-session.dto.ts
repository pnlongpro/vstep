import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsObject } from 'class-validator';

export class SubmitSessionDto {
  @ApiProperty()
  @IsObject()
  answers: Record<number, string>;

  @ApiProperty()
  @IsInt()
  timeSpent: number;
}
