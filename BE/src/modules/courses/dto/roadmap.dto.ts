import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, Min, ArrayNotEmpty, IsArray } from 'class-validator';
import { RoadmapStatus } from '../entities';

export class CreateRoadmapItemDto {
  @IsInt()
  @Min(1)
  week: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsInt()
  @Min(0)
  lessons: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  duration?: string;

  @IsOptional()
  @IsEnum(RoadmapStatus)
  status?: RoadmapStatus;

  @IsInt()
  orderIndex: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRoadmapItemDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  week?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  lessons?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  duration?: string;

  @IsOptional()
  @IsEnum(RoadmapStatus)
  status?: RoadmapStatus;

  @IsOptional()
  @IsInt()
  orderIndex?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class ReorderRoadmapDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  itemIds: string[];
}
