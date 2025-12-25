import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Course,
  CourseClass,
  Document,
  RoadmapItem,
  UserCourseProgress,
  UserDevice,
} from './entities';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      CourseClass,
      Document,
      RoadmapItem,
      UserCourseProgress,
      UserDevice,
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
