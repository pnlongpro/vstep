import { PartialType } from '@nestjs/swagger';
import { CreatePassageDto } from './create-passage.dto';
import { IsOptional } from 'class-validator';

export class UpdatePassageDto extends PartialType(CreatePassageDto) {
  @IsOptional()
  sectionId?: string;
}
