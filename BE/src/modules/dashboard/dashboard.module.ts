import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
  ActivityLog, 
  UserDailyStats, 
  LearningRoadmap, 
  RoadmapMilestone 
} from './entities';
import { UserStats } from '../users/entities/user-stats.entity';
import { 
  DashboardService, 
  ActivityService, 
  RoadmapService 
} from './services';
import { 
  DashboardController, 
  ActivityController, 
  RoadmapController 
} from './controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ActivityLog,
      UserDailyStats,
      LearningRoadmap,
      RoadmapMilestone,
      UserStats,
    ]),
  ],
  controllers: [
    DashboardController,
    ActivityController,
    RoadmapController,
  ],
  providers: [
    DashboardService,
    ActivityService,
    RoadmapService,
  ],
  exports: [
    DashboardService,
    ActivityService,
    RoadmapService,
  ],
})
export class DashboardModule {}
