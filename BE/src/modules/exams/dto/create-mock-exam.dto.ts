import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMockExamDto {
  @ApiProperty({ description: 'Reading exercise ID' })
  @IsUUID()
  readingExerciseId: string;

  @ApiProperty({ description: 'Listening exercise ID' })
  @IsUUID()
  listeningExerciseId: string;

  @ApiProperty({ description: 'Writing exercise ID' })
  @IsUUID()
  writingExerciseId: string;

  @ApiProperty({ description: 'Speaking exercise ID' })
  @IsUUID()
  speakingExerciseId: string;
}
