import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserStats } from './entities/user-stats.entity';
import { UserSettings } from './entities/user-settings.entity';
import { Role } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    @InjectRepository(UserStats)
    private readonly statsRepository: Repository<UserStats>,
    @InjectRepository(UserSettings)
    private readonly settingsRepository: Repository<UserSettings>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * Create a new user with profile, stats, and settings
   */
  async create(dto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Get default role (student)
    let role = await this.roleRepository.findOne({
      where: { name: 'student' },
    });

    // Create default role if not exists
    if (!role) {
      role = await this.roleRepository.save({
        name: 'student',
        displayName: 'Học viên',
        description: 'Default student role',
        permissions: ['practice.read', 'exam.read', 'profile.update'],
        isActive: true,
      });
    }

    // Create user
    const user = this.userRepository.create({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      roleId: role.id,
      status: UserStatus.PENDING,
    });

    const savedUser = await this.userRepository.save(user);

    // Create related entities
    await this.profileRepository.save({
      userId: savedUser.id,
    });

    await this.statsRepository.save({
      userId: savedUser.id,
    });

    await this.settingsRepository.save({
      userId: savedUser.id,
    });

    // Return user with relations
    return this.findById(savedUser.id);
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'profile', 'stats', 'settings'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Find user by ID with password (for auth)
   */
  async findByIdWithPassword(id: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ['role'],
    });
  }

  /**
   * Find user by email with password (for auth)
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email: email.toLowerCase() })
      .getOne();
  }

  /**
   * Update password
   */
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const user = await this.findByIdWithPassword(userId);
    user.password = newPassword;
    await this.userRepository.save(user);
  }

  /**
   * Verify email
   */
  async verifyEmail(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      emailVerifiedAt: new Date(),
      status: UserStatus.ACTIVE,
    });
  }

  /**
   * Update last login
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { email: email.toLowerCase() },
    });
    return count > 0;
  }

  /**
   * Validate password
   */
  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.password) return false;
    return user.comparePassword(password);
  }
}
