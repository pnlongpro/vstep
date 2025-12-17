import { IsString, IsOptional, IsUUID, IsInt, Min, IsBoolean } from 'class-validator';

export class SaveDraftDto {
  @IsUUID()
  @IsOptional()
  sessionId?: string;

  @IsUUID()
  @IsOptional()
  questionId?: string;

  @IsString()
  content: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  wordCount?: number;

  @IsBoolean()
  @IsOptional()
  autoSaved?: boolean;
}
