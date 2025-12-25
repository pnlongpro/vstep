import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateAnnouncementDto {
  @ApiProperty({ description: 'Tiêu đề thông báo', example: 'Thông báo lịch học tuần tới' })
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Nội dung thông báo', example: 'Lớp sẽ nghỉ học ngày 25/12...' })
  @IsString()
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  content: string;

  @ApiPropertyOptional({ description: 'Ghim thông báo lên đầu', default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isPinned?: boolean;
}

export class UpdateAnnouncementDto {
  @ApiPropertyOptional({ description: 'Tiêu đề thông báo' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ description: 'Nội dung thông báo' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Ghim thông báo lên đầu' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isPinned?: boolean;
}

export class AnnouncementResponseDto {
  id: string;
  classId: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  } | null;
}
