import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AchievementCategory, ConditionType, AchievementRarity } from '../entities/achievement.entity';

export class CreateAchievementDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  badgeImage?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  xpReward?: number;

  @ApiPropertyOptional({ enum: AchievementCategory })
  @IsEnum(AchievementCategory)
  @IsOptional()
  category?: AchievementCategory;

  @ApiPropertyOptional({ enum: ConditionType })
  @IsEnum(ConditionType)
  @IsOptional()
  conditionType?: ConditionType;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  conditionValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  conditionMetadata?: Record<string, any>;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;

  @ApiPropertyOptional({ enum: AchievementRarity })
  @IsEnum(AchievementRarity)
  @IsOptional()
  rarity?: AchievementRarity;
}

export class UpdateAchievementDto extends CreateAchievementDto {}
