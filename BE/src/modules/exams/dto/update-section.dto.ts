import { PartialType } from '@nestjs/swagger';
import { CreateSectionDto } from './create-section.dto';
import { IsOptional } from 'class-validator';

export class UpdateSectionDto extends PartialType(CreateSectionDto) {
  @IsOptional()
  examSetId?: string;
}
