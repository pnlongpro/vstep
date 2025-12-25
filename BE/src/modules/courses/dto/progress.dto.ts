import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ProgressStatus } from '../entities';

export class UpdateProgressDto {
  @IsOptional()
  @IsEnum(ProgressStatus)
  status?: ProgressStatus;
}

export class RoadmapProgressParam {
  @IsUUID()
  courseId: string;

  @IsUUID()
  roadmapItemId: string;
}
