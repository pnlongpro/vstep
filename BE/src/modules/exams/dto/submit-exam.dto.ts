import { IsObject, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitExamDto {
  @ApiProperty({ description: 'All answers for all skills' })
  @IsObject()
  answers: Record<string, any>;

  @ApiProperty({ description: 'Total time spent in seconds' })
  @IsNumber()
  timeSpent: number;
}
