import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { StudyMaterial } from './entities/study-material.entity';
import { ClassMaterialV2 } from './entities/class-material.entity';
import {
  DocumentRating,
  DocumentBookmark,
  DocumentView,
  DocumentDownload,
} from './entities/document-tracking.entity';

// Services
import {
  StudyMaterialService,
  ClassMaterialService,
  ContributionService,
} from './services';

// Controllers
import {
  StudyMaterialController,
  ClassMaterialController,
  ContributionController,
} from './controllers';

// Dependencies
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudyMaterial,
      ClassMaterialV2,
      DocumentRating,
      DocumentBookmark,
      DocumentView,
      DocumentDownload,
    ]),
    MediaModule,
  ],
  controllers: [
    StudyMaterialController,
    ClassMaterialController,
    ContributionController,
  ],
  providers: [
    StudyMaterialService,
    ClassMaterialService,
    ContributionService,
  ],
  exports: [
    StudyMaterialService,
    ClassMaterialService,
    ContributionService,
  ],
})
export class DocumentsModule {}
