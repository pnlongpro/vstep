import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';

export class SaveDraftDto {
  @ApiProperty()
  @IsInt()
  taskId: number;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsInt()
  wordCount: number;

  @ApiProperty({ enum: ['email', 'essay', 'graph'] })
  @IsEnum(['email', 'essay', 'graph'])
  taskType: string;

  @ApiProperty({ enum: ['A2', 'B1', 'B2', 'C1'] })
  @IsEnum(['A2', 'B1', 'B2', 'C1'])
  level: string;
}
