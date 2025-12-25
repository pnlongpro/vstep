import { IsString, IsOptional, IsUUID, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdminLogDto {
  @ApiProperty()
  @IsString()
  action: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  entityType?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  entityId?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  oldData?: Record<string, any>;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  newData?: Record<string, any>;
}

export class AdminLogFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  action?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  entityType?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  adminId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  endDate?: string;
}
