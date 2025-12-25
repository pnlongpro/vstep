import { IsOptional, IsBoolean, IsInt, Min, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { NotificationType } from '../entities/notification.entity';

export class GetNotificationsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by unread only' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  unread?: boolean;

  @ApiPropertyOptional({ enum: NotificationType, description: 'Filter by notification type' })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

export class NotificationTypeFilterDto {
  @ApiPropertyOptional({ description: 'Filter by category: assignment, class, exam, system, achievement' })
  @IsOptional()
  @IsString()
  category?: string;
}
