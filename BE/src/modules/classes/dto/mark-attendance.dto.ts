import { IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AttendanceRecordDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  status: 'present' | 'late' | 'absent';

  @ApiProperty({ required: false })
  note?: string;
}

export class MarkAttendanceDto {
  @ApiProperty()
  @IsDateString()
  sessionDate: Date;

  @ApiProperty({ type: [AttendanceRecordDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  records: AttendanceRecordDto[];
}
