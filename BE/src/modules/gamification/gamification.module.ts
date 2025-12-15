import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { Badge } from './entities/badge.entity';
import { UserBadge } from './entities/user-badge.entity';
import { Goal } from './entities/goal.entity';
import { LeaderboardEntry } from './entities/leaderboard-entry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Badge, UserBadge, Goal, LeaderboardEntry]),
  ],
  controllers: [GamificationController],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {}
