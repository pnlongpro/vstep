import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminLog, SystemSetting } from './entities';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { Session } from '../auth/entities/session.entity';
import { UserUsage } from '../users/entities/user-usage.entity';
import { UserPackage } from '../users/entities/user-package.entity';
import {
  Class,
  ClassStudent,
  ClassMaterial,
  ClassSchedule,
  ClassAnnouncement,
  ClassAssignment,
  ClassAssignmentSubmission,
} from '../classes/entities';
import { MediaModule } from '../media/media.module';
import { DocumentsModule } from '../documents/documents.module';
import {
  AdminLogService,
  SystemSettingService,
  UserManagementService,
  AnalyticsService,
  DocumentManagementService,
} from './services';
import { AdminClassService } from './services/admin-class.service';
import {
  AdminController,
  UserManagementController,
  SettingsController,
  AnalyticsController,
  DocumentManagementController,
} from './controllers';
import { AdminClassController } from './controllers/admin-class.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminLog, SystemSetting, User, Role, Session, UserUsage, UserPackage,
      Class, ClassStudent, ClassMaterial, ClassSchedule, ClassAnnouncement,
      ClassAssignment, ClassAssignmentSubmission,
    ]),
    MediaModule,
    DocumentsModule,
  ],
  controllers: [
    AdminController,
    UserManagementController,
    SettingsController,
    AnalyticsController,
    DocumentManagementController,
    AdminClassController,
  ],
  providers: [
    AdminLogService,
    SystemSettingService,
    UserManagementService,
    AnalyticsService,
    DocumentManagementService,
    AdminClassService,
  ],
  exports: [AdminLogService, SystemSettingService],
})
export class AdminModule {}
