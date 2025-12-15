import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxStudents?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
