import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { SessionStatus } from '../../../shared/enums/practice.enum';

export class UpdateSessionDto {
  @IsEnum(SessionStatus)
  @IsOptional()
  status?: SessionStatus;

  @IsInt()
  @IsOptional()
  currentQuestionIndex?: number;

  @IsInt()
  @IsOptional()
  timeSpent?: number;
}
