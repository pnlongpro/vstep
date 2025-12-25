import { IsString, IsOptional, IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SettingCategory, SettingDataType } from '../entities/system-setting.entity';

export class CreateSystemSettingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  value: any;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: SettingCategory })
  @IsEnum(SettingCategory)
  @IsOptional()
  category?: SettingCategory;

  @ApiPropertyOptional({ enum: SettingDataType })
  @IsEnum(SettingDataType)
  @IsOptional()
  dataType?: SettingDataType;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class UpdateSystemSettingDto {
  @ApiProperty()
  @IsNotEmpty()
  value: any;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
