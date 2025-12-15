import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserStats } from './entities/user-stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserProfile, UserStats])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
