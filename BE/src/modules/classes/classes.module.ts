import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { Class } from './entities/class.entity';
import { ClassStudent } from './entities/class-student.entity';
import { ClassSession } from './entities/class-session.entity';
import { ClassSchedule } from './entities/class-schedule.entity';
import { SessionAttendance } from './entities/session-attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Class,
      ClassStudent,
      ClassSession,
      ClassSchedule,
      SessionAttendance,
    ]),
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
