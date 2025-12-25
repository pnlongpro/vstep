import { IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EmailFrequency } from '../entities/notification-preference.entity';

export class UpdatePreferencesDto {
  // Email preferences
  @ApiPropertyOptional({ description: 'Email notifications for assignments' })
  @IsOptional()
  @IsBoolean()
  emailAssignments?: boolean;

  @ApiPropertyOptional({ description: 'Email notifications for classes' })
  @IsOptional()
  @IsBoolean()
  emailClasses?: boolean;

  @ApiPropertyOptional({ description: 'Email notifications for exams' })
  @IsOptional()
  @IsBoolean()
  emailExams?: boolean;

  @ApiPropertyOptional({ description: 'Email notifications for system' })
  @IsOptional()
  @IsBoolean()
  emailSystem?: boolean;

  @ApiPropertyOptional({ description: 'Email notifications for marketing' })
  @IsOptional()
  @IsBoolean()
  emailMarketing?: boolean;

  @ApiPropertyOptional({ enum: EmailFrequency, description: 'Email notification frequency' })
  @IsOptional()
  @IsEnum(EmailFrequency)
  emailFrequency?: EmailFrequency;

  // In-app preferences
  @ApiPropertyOptional({ description: 'Enable in-app notifications' })
  @IsOptional()
  @IsBoolean()
  inappEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Play sound for notifications' })
  @IsOptional()
  @IsBoolean()
  inappSound?: boolean;

  @ApiPropertyOptional({ description: 'Enable desktop notifications' })
  @IsOptional()
  @IsBoolean()
  desktopNotifications?: boolean;

  @ApiPropertyOptional({ description: 'Show badge count' })
  @IsOptional()
  @IsBoolean()
  showBadgeCount?: boolean;
}
