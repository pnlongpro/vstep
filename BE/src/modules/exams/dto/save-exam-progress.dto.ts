import { IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveExamProgressDto {
  @ApiProperty({ description: 'Current skill (reading/listening/writing/speaking)' })
  @IsString()
  skill: string;

  @ApiProperty({ description: 'Answers for current skill' })
  @IsObject()
  answers: Record<string, any>;
}
