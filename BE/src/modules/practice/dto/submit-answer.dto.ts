import { IsUUID, IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class SubmitAnswerDto {
  @IsUUID()
  questionId: string;

  @IsString()
  @IsOptional()
  answer?: string;

  @IsUUID()
  @IsOptional()
  selectedOptionId?: string;

  @IsInt()
  @IsOptional()
  timeSpent?: number;

  @IsBoolean()
  @IsOptional()
  isFlagged?: boolean;
}
