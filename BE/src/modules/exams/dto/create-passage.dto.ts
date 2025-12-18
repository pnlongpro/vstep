import { IsString, IsOptional, IsInt, Min, MaxLength, IsUUID } from 'class-validator';

export class CreatePassageDto {
  @IsUUID()
  sectionId: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  audioDuration?: number;

  @IsOptional()
  @IsString()
  audioTranscript?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
