import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserStats } from './entities/user-stats.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    @InjectRepository(UserStats)
    private readonly statsRepository: Repository<UserStats>,
  ) {}

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile', 'roles'],
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getStats(userId: number) {
    let stats = await this.statsRepository.findOne({
      where: { userId },
    });

    if (!stats) {
      // Create default stats if not exists
      stats = this.statsRepository.create({ userId });
      await this.statsRepository.save(stats);
    }

    return stats;
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    let profile = await this.profileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      profile = this.profileRepository.create({ userId, ...updateProfileDto });
    } else {
      Object.assign(profile, updateProfileDto);
    }

    await this.profileRepository.save(profile);
    return profile;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'profile', 'stats'],
    });
  }
}
