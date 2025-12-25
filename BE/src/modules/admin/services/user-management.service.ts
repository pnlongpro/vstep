import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like, In } from "typeorm";
import { WinstonLoggerService } from "@/core/logger/winston-logger.service";
import { User, UserStatus } from "../../users/entities/user.entity";
import { Role } from "../../users/entities/role.entity";
import { Session } from "../../auth/entities/session.entity";
import { UserUsage } from "../../users/entities/user-usage.entity";
import {
  UserPackage,
  PlanType,
} from "../../users/entities/user-package.entity";
import { Class, ClassStatus } from "../../classes/entities/class.entity";
import {
  ClassStudent,
  EnrollmentStatus,
} from "../../classes/entities/class-student.entity";
import {
  UserFilterDto,
  UpdateUserStatusDto,
  BulkUserActionDto,
  AssignRoleDto,
  CreateUserDto,
  UpdateUserDto,
  UpdateDeviceLimitDto,
  UpdateExpiryDto,
} from "../dto/user-management.dto";
import { AdminLogService } from "./admin-log.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserManagementService {
  constructor(
    private readonly logger: WinstonLoggerService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(UserUsage)
    private readonly userUsageRepository: Repository<UserUsage>,
    @InjectRepository(UserPackage)
    private readonly userPackageRepository: Repository<UserPackage>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(ClassStudent)
    private readonly classStudentRepository: Repository<ClassStudent>,
    private readonly adminLogService: AdminLogService
  ) {}

  async findAll(filter: UserFilterDto) {
    this.logger.log(
      `[FIND_ALL_USERS] Query with filter: ${JSON.stringify(filter)}`
    );
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndSelect("user.profile", "profile");

    if (filter.search) {
      queryBuilder.andWhere(
        "(user.email LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search)",
        { search: `%${filter.search}%` }
      );
    }

    if (filter.status) {
      queryBuilder.andWhere("user.status = :status", { status: filter.status });
    }

    if (filter.role) {
      queryBuilder.andWhere("role.name = :role", { role: filter.role });
    }

    const sortOrder =
      filter.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";
    queryBuilder.orderBy(`user.${filter.sortBy || "createdAt"}`, sortOrder);

    const page = filter.page || 1;
    const limit = filter.limit || 20;
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    this.logger.log(
      `[FIND_ALL_USERS] Found ${total} users, returning page ${page}`
    );

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async exportUsers(filter: UserFilterDto, adminId: string): Promise<Buffer> {
    this.logger.log(
      `[EXPORT_USERS] Admin ${adminId} starting export with filter: ${JSON.stringify(filter)}`
    );
    // Get all users matching filter (no pagination)
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndSelect("user.profile", "profile");

    if (filter.search) {
      queryBuilder.andWhere(
        "(user.email LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search)",
        { search: `%${filter.search}%` }
      );
    }
    if (filter.status) {
      queryBuilder.andWhere("user.status = :status", { status: filter.status });
    }
    if (filter.role) {
      queryBuilder.andWhere("role.name = :role", { role: filter.role });
    }
    queryBuilder.orderBy(
      `user.${filter.sortBy || "createdAt"}`,
      filter.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC"
    );

    const users = await queryBuilder.getMany();

    // CSV header
    const header = [
      "ID",
      "Email",
      "First Name",
      "Last Name",
      "Status",
      "Role",
      "Created At",
      "Updated At",
    ];
    const rows = users.map((u) => [
      u.id,
      u.email,
      u.firstName ?? "",
      u.lastName ?? "",
      u.status,
      u.role?.name ?? "",
      u.createdAt?.toISOString() ?? "",
      u.updatedAt?.toISOString() ?? "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    this.logger.log(`[EXPORT_USERS] Exported ${users.length} users to CSV`);

    // Log admin action
    await this.adminLogService.create(adminId, {
      action: "user.export",
      entityType: "user",
      newData: {
        filter,
        exportedCount: users.length,
        exportFormat: "csv",
      },
    });

    return Buffer.from(csv, "utf-8");
  }
  async findById(id: string): Promise<User> {
    this.logger.log(`[FIND_BY_ID] Looking for user: ${id}`);
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["role", "profile", "stats", "settings"],
    });
    if (!user) {
      this.logger.warn(`[FIND_BY_ID] User not found: ${id}`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.log(`[FIND_BY_ID] Found user: ${user.email}`);
    return user;
  }

  async updateStatus(
    userId: string,
    dto: UpdateUserStatusDto,
    adminId: string
  ): Promise<User> {
    this.logger.log(
      `[UPDATE_STATUS] Admin ${adminId} updating status for user ${userId} to ${dto.status}`
    );
    const user = await this.findById(userId);
    const oldStatus = user.status;

    user.status = dto.status;
    const updated = await this.userRepository.save(user);
    this.logger.log(
      `[UPDATE_STATUS] User ${userId} status changed: ${oldStatus} -> ${dto.status}`
    );

    await this.adminLogService.create(adminId, {
      action: "user.status_change",
      entityType: "user",
      entityId: userId,
      oldData: { status: oldStatus },
      newData: { status: dto.status, reason: dto.reason },
    });

    return updated;
  }

  async bulkAction(
    dto: BulkUserActionDto,
    adminId: string
  ): Promise<{ affected: number }> {
    this.logger.log(
      `[BULK_ACTION] Admin ${adminId} performing ${dto.action} on ${dto.userIds.length} users`
    );
    const users = await this.userRepository.find({
      where: { id: In(dto.userIds) },
    });

    if (users.length === 0) {
      this.logger.warn(
        `[BULK_ACTION] No users found for IDs: ${dto.userIds.join(", ")}`
      );
      throw new NotFoundException("No users found");
    }

    let statusMap: Record<string, UserStatus> = {
      activate: UserStatus.ACTIVE,
      deactivate: UserStatus.INACTIVE,
      suspend: UserStatus.SUSPENDED,
    };

    if (dto.action === "delete") {
      await this.userRepository.softRemove(users);
    } else {
      const newStatus = statusMap[dto.action];
      if (!newStatus) {
        throw new BadRequestException("Invalid action");
      }
      await this.userRepository.update(
        { id: In(dto.userIds) },
        { status: newStatus }
      );
    }

    await this.adminLogService.create(adminId, {
      action: `user.bulk_${dto.action}`,
      entityType: "user",
      newData: { userIds: dto.userIds, reason: dto.reason },
    });

    this.logger.log(
      `[BULK_ACTION] Successfully performed ${dto.action} on ${users.length} users`
    );
    return { affected: users.length };
  }

  async assignRole(dto: AssignRoleDto, adminId: string): Promise<User> {
    this.logger.log(
      `[ASSIGN_ROLE] Admin ${adminId} assigning role ${dto.roleName} to user ${dto.userId}`
    );
    const user = await this.findById(dto.userId);
    const role = await this.roleRepository.findOne({
      where: { name: dto.roleName },
    });

    if (!role) {
      this.logger.warn(`[ASSIGN_ROLE] Role not found: ${dto.roleName}`);
      throw new NotFoundException(`Role "${dto.roleName}" not found`);
    }

    const oldRole = user.role?.name;
    user.role = role;
    const updated = await this.userRepository.save(user);
    this.logger.log(
      `[ASSIGN_ROLE] User ${dto.userId} role changed: ${oldRole} -> ${dto.roleName}`
    );

    await this.adminLogService.create(adminId, {
      action: "user.role_change",
      entityType: "user",
      entityId: dto.userId,
      oldData: { role: oldRole },
      newData: { role: dto.roleName },
    });

    return updated;
  }

  async getStatistics() {
    this.logger.log("[GET_STATISTICS] Fetching user statistics");
    const total = await this.userRepository.count();

    const byStatus = await this.userRepository
      .createQueryBuilder("user")
      .select("user.status", "status")
      .addSelect("COUNT(*)", "count")
      .groupBy("user.status")
      .getRawMany();

    const byRole = await this.userRepository
      .createQueryBuilder("user")
      .leftJoin("user.role", "role")
      .select("role.name", "role")
      .addSelect("COUNT(*)", "count")
      .groupBy("role.name")
      .getRawMany();

    const last30Days = await this.userRepository
      .createQueryBuilder("user")
      .select("DATE(user.createdAt)", "date")
      .addSelect("COUNT(*)", "count")
      .where("user.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)")
      .groupBy("DATE(user.createdAt)")
      .orderBy("DATE(user.createdAt)", "ASC")
      .getRawMany();

    // Count users this week (last 7 days)
    const thisWeekCount = await this.userRepository
      .createQueryBuilder("user")
      .where("user.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)")
      .getCount();

    // Count users last week (7-14 days ago)
    const lastWeekCount = await this.userRepository
      .createQueryBuilder("user")
      .where("user.createdAt >= DATE_SUB(NOW(), INTERVAL 14 DAY)")
      .andWhere("user.createdAt < DATE_SUB(NOW(), INTERVAL 7 DAY)")
      .getCount();

    // Count active users
    const activeUsers = await this.userRepository.count({
      where: { status: UserStatus.ACTIVE },
    });

    // Count active users this week
    const activeThisWeek = await this.userRepository
      .createQueryBuilder("user")
      .where("user.status = :status", { status: UserStatus.ACTIVE })
      .andWhere("user.lastLoginAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)")
      .getCount();

    // Count active users last week
    const activeLastWeek = await this.userRepository
      .createQueryBuilder("user")
      .where("user.status = :status", { status: UserStatus.ACTIVE })
      .andWhere("user.lastLoginAt >= DATE_SUB(NOW(), INTERVAL 14 DAY)")
      .andWhere("user.lastLoginAt < DATE_SUB(NOW(), INTERVAL 7 DAY)")
      .getCount();

    // Calculate percentage changes
    const calcChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      totalUsers: total,
      activeUsers,
      newUsersThisWeek: thisWeekCount,
      newUsersLastWeek: lastWeekCount,
      activeUsersThisWeek: activeThisWeek,
      activeUsersLastWeek: activeLastWeek,
      changes: {
        newUsers: calcChange(thisWeekCount, lastWeekCount),
        activeUsers: calcChange(activeThisWeek, activeLastWeek),
      },
      byStatus,
      byRole,
      last30Days,
    };
  }

  async createUser(dto: CreateUserDto, adminId: string): Promise<User> {
    this.logger.log(
      `[CREATE_USER] Admin ${adminId} creating user with email: ${dto.email}`
    );
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      this.logger.warn(`[CREATE_USER] Email already exists: ${dto.email}`);
      throw new BadRequestException("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Find role
    let role: Role | null = null;
    if (dto.role) {
      role = await this.roleRepository.findOne({ where: { name: dto.role } });
      if (!role) {
        // Default to student if role not found
        role = await this.roleRepository.findOne({
          where: { name: "student" },
        });
      }
    } else {
      role = await this.roleRepository.findOne({ where: { name: "student" } });
    }

    // Create user
    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName || "",
      lastName: dto.lastName || "",
      role: role || undefined,
      status: UserStatus.ACTIVE,
    });

    const savedUser = await this.userRepository.save(user);
    this.logger.log(
      `[CREATE_USER] User created successfully: ${savedUser.id} (${savedUser.email})`
    );

    await this.adminLogService.create(adminId, {
      action: "user.create",
      entityType: "user",
      entityId: savedUser.id,
      newData: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
      },
    });

    return savedUser;
  }

  async updateUser(
    userId: string,
    dto: UpdateUserDto,
    adminId: string
  ): Promise<User> {
    this.logger.log(`[UPDATE_USER] Admin ${adminId} updating user ${userId}`);
    const user = await this.findById(userId);
    const oldData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    // Update fields
    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.email !== undefined) {
      // Check if email already used by another user
      const existingUser = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException("Email already in use");
      }
      user.email = dto.email;
    }

    const updated = await this.userRepository.save(user);
    this.logger.log(`[UPDATE_USER] User ${userId} updated successfully`);

    await this.adminLogService.create(adminId, {
      action: "user.update",
      entityType: "user",
      entityId: userId,
      oldData,
      newData: dto,
    });

    return updated;
  }

  async deleteUser(userId: string, adminId: string): Promise<void> {
    this.logger.log(`[DELETE_USER] Admin ${adminId} deleting user ${userId}`);
    const user = await this.findById(userId);

    await this.userRepository.softRemove(user);
    this.logger.log(
      `[DELETE_USER] User ${userId} (${user.email}) soft deleted`
    );

    await this.adminLogService.create(adminId, {
      action: "user.delete",
      entityType: "user",
      entityId: userId,
      oldData: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }

  // ========== Session/Device Management ==========

  async resetLoginSessions(
    userId: string,
    adminId: string
  ): Promise<{ affected: number }> {
    this.logger.log(
      `[RESET_SESSIONS] Admin ${adminId} resetting sessions for user ${userId}`
    );
    const user = await this.findById(userId);

    // Delete all sessions for this user
    const result = await this.sessionRepository.delete({ userId });
    this.logger.log(
      `[RESET_SESSIONS] Cleared ${result.affected} sessions for user ${userId}`
    );

    await this.adminLogService.create(adminId, {
      action: "user.reset_sessions",
      entityType: "user",
      entityId: userId,
      newData: { sessionsCleared: result.affected },
    });

    return { affected: result.affected || 0 };
  }

  async getUserDevices(
    userId: string
  ): Promise<{ devices: any[]; maxDevices: number }> {
    this.logger.log(`[GET_DEVICES] Fetching devices for user ${userId}`);
    const user = await this.findById(userId);

    // Get all active sessions
    const sessions = await this.sessionRepository.find({
      where: { userId, isActive: true },
      order: { lastActiveAt: "DESC" },
    });
    this.logger.log(
      `[GET_DEVICES] Found ${sessions.length} active sessions for user ${userId}`
    );

    // Transform sessions to device format
    // Use stored device info if available, fallback to parsing userAgent
    const devices = sessions.map((session) => ({
      id: session.id,
      name: session.deviceName || this.parseDeviceName(session.userAgent),
      type: session.deviceType || this.parseDeviceType(session.userAgent),
      browser: session.browser || this.parseBrowser(session.userAgent),
      os: session.os || this.parseOS(session.userAgent),
      ip: session.ipAddress || "Unknown",
      location: session.location || "Việt Nam", // TODO: Implement IP geolocation
      lastActive: this.formatTimeAgo(session.lastActiveAt),
      loginTime: session.createdAt?.toISOString(),
      isCurrentDevice: false, // Admin panel never shows "current device"
    }));

    return {
      devices,
      maxDevices: user.deviceLimit || 2, // Default 2 devices
    };
  }

  async logoutDevice(
    userId: string,
    deviceId: string,
    adminId: string
  ): Promise<void> {
    this.logger.log(
      `[LOGOUT_DEVICE] Admin ${adminId} logging out device ${deviceId} for user ${userId}`
    );
    await this.findById(userId);

    const session = await this.sessionRepository.findOne({
      where: { id: deviceId, userId },
    });

    if (!session) {
      this.logger.warn(`[LOGOUT_DEVICE] Session not found: ${deviceId}`);
      throw new NotFoundException("Session not found");
    }

    await this.sessionRepository.delete({ id: deviceId });
    this.logger.log(
      `[LOGOUT_DEVICE] Device ${deviceId} logged out successfully`
    );

    await this.adminLogService.create(adminId, {
      action: "user.logout_device",
      entityType: "session",
      entityId: deviceId,
      newData: { userId },
    });
  }

  async logoutAllDevices(
    userId: string,
    adminId: string
  ): Promise<{ affected: number }> {
    this.logger.log(
      `[LOGOUT_ALL_DEVICES] Admin ${adminId} logging out all devices for user ${userId}`
    );
    await this.findById(userId);

    const result = await this.sessionRepository.delete({ userId });
    this.logger.log(
      `[LOGOUT_ALL_DEVICES] Logged out ${result.affected} devices for user ${userId}`
    );

    await this.adminLogService.create(adminId, {
      action: "user.logout_all_devices",
      entityType: "user",
      entityId: userId,
      newData: { sessionsCleared: result.affected },
    });

    return { affected: result.affected || 0 };
  }

  async updateDeviceLimit(
    userId: string,
    dto: UpdateDeviceLimitDto,
    adminId: string
  ): Promise<User> {
    this.logger.log(
      `[UPDATE_DEVICE_LIMIT] Admin ${adminId} updating device limit for user ${userId} to ${dto.maxDevices}`
    );
    const user = await this.findById(userId);
    const oldLimit = user.deviceLimit;

    // Update device limit
    user.deviceLimit = dto.maxDevices;
    const updated = await this.userRepository.save(user);
    this.logger.log(
      `[UPDATE_DEVICE_LIMIT] User ${userId} device limit changed: ${oldLimit} -> ${dto.maxDevices}`
    );

    await this.adminLogService.create(adminId, {
      action: "user.update_device_limit",
      entityType: "user",
      entityId: userId,
      oldData: { deviceLimit: oldLimit },
      newData: { deviceLimit: dto.maxDevices },
    });

    return updated;
  }

  // ========== Account Expiry Management ==========

  async getUserExpiry(userId: string): Promise<{
    currentExpiry: string | null;
    daysRemaining: number;
    planDays: number;
    plan: string;
  }> {
    this.logger.log(
      `[GET_USER_EXPIRY] Fetching expiry info for user ${userId}`
    );
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["profile"],
    });

    if (!user) {
      this.logger.warn(`[GET_USER_EXPIRY] User not found: ${userId}`);
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get expiry from user package or settings
    // For now, return mock data - adjust based on your user_packages table
    const expiryDate = (user as any).packageExpiry || null;
    const plan = (user as any).plan || "free";
    const planDays = plan === "premium" ? 365 : plan === "basic" ? 30 : 0;

    let daysRemaining = 0;
    if (expiryDate) {
      const now = new Date();
      const expiry = new Date(expiryDate);
      daysRemaining = Math.max(
        0,
        Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      );
    }

    return {
      currentExpiry: expiryDate ? new Date(expiryDate).toISOString() : null,
      daysRemaining,
      planDays,
      plan,
    };
  }

  async updateExpiry(
    userId: string,
    dto: UpdateExpiryDto,
    adminId: string
  ): Promise<{ newExpiry: string }> {
    this.logger.log(
      `[UPDATE_EXPIRY] Admin ${adminId} updating expiry for user ${userId}, mode: ${dto.mode}`
    );
    const user = await this.findById(userId);
    const oldExpiry = (user as any).packageExpiry;

    let newExpiry: Date;

    if (dto.mode === "extend") {
      // Extend from current expiry or from now if expired
      const currentExpiry = oldExpiry ? new Date(oldExpiry) : new Date();
      const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
      newExpiry = new Date(
        baseDate.getTime() + Number(dto.value) * 24 * 60 * 60 * 1000
      );
    } else {
      // Set specific date
      newExpiry = new Date(dto.value);
    }

    // Update user's package expiry
    (user as any).packageExpiry = newExpiry;
    await this.userRepository.save(user);

    await this.adminLogService.create(adminId, {
      action: "user.update_expiry",
      entityType: "user",
      entityId: userId,
      oldData: { expiry: oldExpiry },
      newData: {
        expiry: newExpiry.toISOString(),
        mode: dto.mode,
        value: dto.value,
      },
    });

    this.logger.log(
      `[UPDATE_EXPIRY] User ${userId} expiry updated to ${newExpiry.toISOString()}`
    );
    return { newExpiry: newExpiry.toISOString() };
  }

  // ========== Helper Methods ==========

  private parseDeviceName(userAgent?: string): string {
    if (!userAgent) return "Unknown Device";
    if (userAgent.includes("Windows")) return "Windows PC";
    if (userAgent.includes("Mac")) return "MacBook";
    if (userAgent.includes("iPhone")) return "iPhone";
    if (userAgent.includes("iPad")) return "iPad";
    if (userAgent.includes("Android")) return "Android Device";
    return "Unknown Device";
  }

  private parseDeviceType(userAgent?: string): "desktop" | "mobile" | "tablet" {
    if (!userAgent) return "desktop";
    if (
      userAgent.includes("Mobile") ||
      userAgent.includes("iPhone") ||
      userAgent.includes("Android")
    ) {
      if (userAgent.includes("iPad") || userAgent.includes("Tablet"))
        return "tablet";
      return "mobile";
    }
    return "desktop";
  }

  private parseBrowser(userAgent?: string): string {
    if (!userAgent) return "Unknown";
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Unknown";
  }

  private parseOS(userAgent?: string): string {
    if (!userAgent) return "Unknown";
    if (userAgent.includes("Windows NT 10")) return "Windows 10/11";
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac OS")) return "macOS";
    if (userAgent.includes("iOS")) return "iOS";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("Linux")) return "Linux";
    return "Unknown";
  }

  private formatTimeAgo(date?: Date): string {
    if (!date) return "Unknown";
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return `${Math.floor(diffDays / 7)} tuần trước`;
  }

  // ========== Free Account Management ==========

  /**
   * Get all free account users with usage and limits
   */
  async findFreeUsers(filter: UserFilterDto) {
    this.logger.log(
      `[FIND_FREE_USERS] Query with filter: ${JSON.stringify(filter)}`
    );
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndSelect("user.profile", "profile")
      .leftJoinAndSelect("user.stats", "stats")
      .where("role.name = :role", { role: "student" });

    if (filter.search) {
      queryBuilder.andWhere(
        "(user.email LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search)",
        { search: `%${filter.search}%` }
      );
    }

    if (filter.status) {
      queryBuilder.andWhere("user.status = :status", { status: filter.status });
    }

    const sortOrder =
      filter.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";
    queryBuilder.orderBy(`user.${filter.sortBy || "createdAt"}`, sortOrder);

    const page = filter.page || 1;
    const limit = filter.limit || 20;
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    // Enrich with usage and package data
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const usage = await this.getOrCreateUserUsage(user.id);
        const pkg = await this.getOrCreateUserPackage(user.id);

        // Reset daily usage if needed
        if (usage.needsReset()) {
          usage.resetDailyUsage();
          await this.userUsageRepository.save(usage);
        }

        return {
          ...user,
          usage: {
            mockTests: usage.mockTestsUsed,
            aiSpeaking: usage.aiSpeakingUsedToday,
            aiWriting: usage.aiWritingUsedToday,
          },
          limits: {
            mockTests: pkg.mockTestLimit,
            aiSpeaking: pkg.aiSpeakingDailyLimit,
            aiWriting: pkg.aiWritingDailyLimit,
          },
          plan: pkg.plan,
          planExpiry: pkg.endDate,
        };
      })
    );

    return {
      items: enrichedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get or create UserUsage for a user
   */
  private async getOrCreateUserUsage(userId: string): Promise<UserUsage> {
    let usage = await this.userUsageRepository.findOne({ where: { userId } });
    if (!usage) {
      usage = this.userUsageRepository.create({
        userId,
        mockTestsUsed: 0,
        aiSpeakingUsedToday: 0,
        aiWritingUsedToday: 0,
        lastAiResetDate: new Date(),
      });
      await this.userUsageRepository.save(usage);
    }
    return usage;
  }

  /**
   * Get or create UserPackage for a user (defaults to free plan)
   */
  private async getOrCreateUserPackage(userId: string): Promise<UserPackage> {
    let pkg = await this.userPackageRepository.findOne({
      where: { userId, isActive: true },
      order: { createdAt: "DESC" },
    });
    if (!pkg) {
      const defaults = UserPackage.getDefaultLimits(PlanType.FREE);
      pkg = this.userPackageRepository.create({
        userId,
        plan: PlanType.FREE,
        ...defaults,
        isActive: true,
        startDate: new Date(),
      });
      await this.userPackageRepository.save(pkg);
    }
    return pkg;
  }

  /**
   * Get free account statistics
   */
  async getFreeAccountStats() {
    this.logger.log(
      "[GET_FREE_ACCOUNT_STATS] Fetching free account statistics"
    );
    const freePackages = await this.userPackageRepository
      .createQueryBuilder("pkg")
      .where("pkg.plan = :plan", { plan: PlanType.FREE })
      .andWhere("pkg.isActive = :isActive", { isActive: true })
      .getCount();

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const newFreeThisWeek = await this.userRepository
      .createQueryBuilder("user")
      .leftJoin("user.role", "role")
      .where("role.name = :role", { role: "student" })
      .andWhere("user.createdAt >= :weekAgo", { weekAgo })
      .getCount();

    const activeFreeUsers = await this.userRepository
      .createQueryBuilder("user")
      .leftJoin("user.role", "role")
      .where("role.name = :role", { role: "student" })
      .andWhere("user.status = :status", { status: UserStatus.ACTIVE })
      .getCount();

    const inactiveFreeUsers = await this.userRepository
      .createQueryBuilder("user")
      .leftJoin("user.role", "role")
      .where("role.name = :role", { role: "student" })
      .andWhere("user.status != :status", { status: UserStatus.ACTIVE })
      .getCount();

    return {
      total: freePackages,
      active: activeFreeUsers,
      inactive: inactiveFreeUsers,
      newThisWeek: newFreeThisWeek,
    };
  }

  /**
   * Increment user's AI usage
   */
  async incrementAiUsage(
    userId: string,
    type: "speaking" | "writing"
  ): Promise<{ success: boolean; remaining: number }> {
    this.logger.log(`[INCREMENT_AI_USAGE] User ${userId} using AI ${type}`);
    const usage = await this.getOrCreateUserUsage(userId);
    const pkg = await this.getOrCreateUserPackage(userId);

    // Reset daily usage if needed
    if (usage.needsReset()) {
      usage.resetDailyUsage();
    }

    const limit =
      type === "speaking" ? pkg.aiSpeakingDailyLimit : pkg.aiWritingDailyLimit;
    const current =
      type === "speaking"
        ? usage.aiSpeakingUsedToday
        : usage.aiWritingUsedToday;

    // 0 = unlimited
    if (limit > 0 && current >= limit) {
      this.logger.warn(
        `[INCREMENT_AI_USAGE] User ${userId} reached ${type} limit (${current}/${limit})`
      );
      return { success: false, remaining: 0 };
    }

    if (type === "speaking") {
      usage.aiSpeakingUsedToday += 1;
    } else {
      usage.aiWritingUsedToday += 1;
    }

    await this.userUsageRepository.save(usage);

    const remaining = limit === 0 ? -1 : limit - (current + 1);
    this.logger.log(
      `[INCREMENT_AI_USAGE] User ${userId} AI ${type} usage incremented, remaining: ${remaining}`
    );
    return { success: true, remaining };
  }

  /**
   * Increment user's mock test usage
   */
  async incrementMockTestUsage(
    userId: string
  ): Promise<{ success: boolean; remaining: number }> {
    this.logger.log(`[INCREMENT_MOCK_TEST] User ${userId} using mock test`);
    const usage = await this.getOrCreateUserUsage(userId);
    const pkg = await this.getOrCreateUserPackage(userId);

    const limit = pkg.mockTestLimit;
    const current = usage.mockTestsUsed;

    // 0 = unlimited
    if (limit > 0 && current >= limit) {
      this.logger.warn(
        `[INCREMENT_MOCK_TEST] User ${userId} reached mock test limit (${current}/${limit})`
      );
      return { success: false, remaining: 0 };
    }

    usage.mockTestsUsed += 1;
    await this.userUsageRepository.save(usage);

    const remaining = limit === 0 ? -1 : limit - (current + 1);
    this.logger.log(
      `[INCREMENT_MOCK_TEST] User ${userId} mock test usage incremented, remaining: ${remaining}`
    );
    return { success: true, remaining };
  }

  // ========== Teacher Management ==========

  /**
   * Get all teachers with statistics
   */
  async findTeachers(filter: UserFilterDto) {
    this.logger.log(
      `[FIND_TEACHERS] Query with filter: ${JSON.stringify(filter)}`
    );
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndSelect("user.profile", "profile")
      .where("role.name = :role", { role: "teacher" });

    if (filter.search) {
      queryBuilder.andWhere(
        "(user.email LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search)",
        { search: `%${filter.search}%` }
      );
    }

    if (filter.status) {
      queryBuilder.andWhere("user.status = :status", { status: filter.status });
    }

    const sortOrder =
      filter.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";
    queryBuilder.orderBy(`user.${filter.sortBy || "createdAt"}`, sortOrder);

    const page = filter.page || 1;
    const limit = filter.limit || 20;
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    // Transform to teacher format with computed classCount and studentCount
    const teachers = await Promise.all(
      users.map(async (user) => {
        // Count classes for this teacher
        const classCount = await this.classRepository.count({
          where: { teacherId: user.id },
        });

        // Count students in all classes of this teacher
        const studentCount = await this.classStudentRepository
          .createQueryBuilder("cs")
          .innerJoin("cs.class", "class")
          .where("class.teacherId = :teacherId", { teacherId: user.id })
          .andWhere("cs.status = :status", { status: EnrollmentStatus.ACTIVE })
          .getCount();

        return {
          id: user.id,
          name:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.email.split("@")[0],
          email: user.email,
          status: user.status,
          specialty: user.profile?.specialization || "General",
          courses: classCount,
          students: studentCount,
          rating: user.profile?.rating || 0,
          joined: user.createdAt?.toISOString().split("T")[0] || "",
          avatar: user.avatar,
        };
      })
    );

    return {
      items: teachers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get teacher statistics
   */
  async getTeacherStats() {
    this.logger.log("[GET_TEACHER_STATS] Fetching teacher statistics");
    const total = await this.userRepository
      .createQueryBuilder("user")
      .leftJoin("user.role", "role")
      .where("role.name = :role", { role: "teacher" })
      .getCount();

    const active = await this.userRepository
      .createQueryBuilder("user")
      .leftJoin("user.role", "role")
      .where("role.name = :role", { role: "teacher" })
      .andWhere("user.status = :status", { status: UserStatus.ACTIVE })
      .getCount();

    // Count total classes taught by teachers
    const totalCourses = await this.classRepository
      .createQueryBuilder("class")
      .innerJoin("class.teacher", "teacher")
      .innerJoin("teacher.role", "role")
      .where("role.name = :role", { role: "teacher" })
      .getCount();

    // Count total students enrolled in teacher's classes
    const totalStudents = await this.classStudentRepository
      .createQueryBuilder("cs")
      .innerJoin("cs.class", "class")
      .innerJoin("class.teacher", "teacher")
      .innerJoin("teacher.role", "role")
      .where("role.name = :role", { role: "teacher" })
      .andWhere("cs.status = :status", { status: EnrollmentStatus.ACTIVE })
      .getCount();

    // Calculate change percentages
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const newThisWeek = await this.userRepository
      .createQueryBuilder("user")
      .leftJoin("user.role", "role")
      .where("role.name = :role", { role: "teacher" })
      .andWhere("user.createdAt >= :weekAgo", { weekAgo })
      .getCount();

    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 14);
    const newLastWeek = await this.userRepository
      .createQueryBuilder("user")
      .leftJoin("user.role", "role")
      .where("role.name = :role", { role: "teacher" })
      .andWhere("user.createdAt >= :lastWeekStart", { lastWeekStart })
      .andWhere("user.createdAt < :weekAgo", { weekAgo })
      .getCount();

    const calcChange = (current: number, previous: number): string => {
      if (previous === 0) return current > 0 ? "+100%" : "0%";
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
    };

    return {
      totalTeachers: total,
      activeTeachers: active,
      totalCourses,
      totalStudents,
      changes: {
        teachers: calcChange(newThisWeek, newLastWeek),
        active: calcChange(active, active), // Placeholder
        courses: "+0%", // Would need historical data
        students: "+0%", // Would need historical data
      },
    };
  }

  /**
   * Create a new teacher
   */
  async createTeacher(dto: CreateUserDto, adminId: string): Promise<any> {
    this.logger.log(
      `[CREATE_TEACHER] Admin ${adminId} creating teacher with email: ${dto.email}`
    );
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      this.logger.warn(`[CREATE_TEACHER] Email already exists: ${dto.email}`);
      throw new BadRequestException("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const role = await this.roleRepository.findOne({
      where: { name: "teacher" },
    });
    if (!role) {
      throw new BadRequestException("Teacher role not found");
    }

    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName || "",
      lastName: dto.lastName || "",
      role,
      status: UserStatus.ACTIVE,
    });

    const savedUser = await this.userRepository.save(user);
    this.logger.log(
      `[CREATE_TEACHER] Teacher created successfully: ${savedUser.id} (${savedUser.email})`
    );

    await this.adminLogService.create(adminId, {
      action: "teacher.create",
      entityType: "user",
      entityId: savedUser.id,
      newData: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    return {
      id: savedUser.id,
      name:
        `${savedUser.firstName || ""} ${savedUser.lastName || ""}`.trim() ||
        savedUser.email.split("@")[0],
      email: savedUser.email,
      status: savedUser.status,
      specialty: "General",
      courses: 0,
      students: 0,
      rating: 0,
      joined: savedUser.createdAt?.toISOString().split("T")[0] || "",
    };
  }

  /**
   * Update teacher status
   */
  async updateTeacherStatus(
    teacherId: string,
    status: UserStatus,
    adminId: string
  ): Promise<any> {
    this.logger.log(
      `[UPDATE_TEACHER_STATUS] Admin ${adminId} updating teacher ${teacherId} status to ${status}`
    );
    const teacher = await this.userRepository.findOne({
      where: { id: teacherId },
      relations: ["role"],
    });

    if (!teacher) {
      this.logger.warn(
        `[UPDATE_TEACHER_STATUS] Teacher not found: ${teacherId}`
      );
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    if (teacher.role?.name !== "teacher") {
      this.logger.warn(
        `[UPDATE_TEACHER_STATUS] User ${teacherId} is not a teacher`
      );
      throw new BadRequestException("User is not a teacher");
    }

    const oldStatus = teacher.status;
    teacher.status = status;
    const updated = await this.userRepository.save(teacher);
    this.logger.log(
      `[UPDATE_TEACHER_STATUS] Teacher ${teacherId} status changed: ${oldStatus} -> ${status}`
    );

    await this.adminLogService.create(adminId, {
      action: "teacher.status_change",
      entityType: "user",
      entityId: teacherId,
      oldData: { status: oldStatus },
      newData: { status },
    });

    return {
      id: updated.id,
      name:
        `${updated.firstName || ""} ${updated.lastName || ""}`.trim() ||
        updated.email.split("@")[0],
      email: updated.email,
      status: updated.status,
    };
  }

  /**
   * Update teacher information
   */
  async updateTeacher(
    teacherId: string,
    dto: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      specialization?: string;
      degree?: string;
      bio?: string;
      status?: "active" | "inactive";
    },
    adminId: string
  ): Promise<any> {
    this.logger.log(
      `[UPDATE_TEACHER] Admin ${adminId} updating teacher ${teacherId}`
    );
    const teacher = await this.userRepository.findOne({
      where: { id: teacherId },
      relations: ["role", "profile"],
    });

    if (!teacher) {
      this.logger.warn(`[UPDATE_TEACHER] Teacher not found: ${teacherId}`);
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    if (teacher.role?.name !== "teacher") {
      this.logger.warn(`[UPDATE_TEACHER] User ${teacherId} is not a teacher`);
      throw new BadRequestException("User is not a teacher");
    }

    const oldData = {
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      status: teacher.status,
      profile: teacher.profile
        ? {
            specialization: teacher.profile.specialization,
            degree: teacher.profile.degree,
            bio: teacher.profile.bio,
          }
        : null,
    };

    // Update user fields
    if (dto.firstName !== undefined) teacher.firstName = dto.firstName;
    if (dto.lastName !== undefined) teacher.lastName = dto.lastName;
    if (dto.email !== undefined) teacher.email = dto.email;
    if (dto.status !== undefined) {
      teacher.status =
        dto.status === "active" ? UserStatus.ACTIVE : UserStatus.INACTIVE;
    }

    const updatedUser = await this.userRepository.save(teacher);

    // Update profile fields
    if (teacher.profile) {
      if (dto.phone !== undefined) teacher.profile.phone = dto.phone;
      if (dto.specialization !== undefined)
        teacher.profile.specialization = dto.specialization;
      if (dto.degree !== undefined) teacher.profile.degree = dto.degree;
      if (dto.bio !== undefined) teacher.profile.bio = dto.bio;

      await this.userRepository.manager.save(teacher.profile);
    }

    await this.adminLogService.create(adminId, {
      action: "teacher.update",
      entityType: "user",
      entityId: teacherId,
      oldData,
      newData: dto,
    });
    this.logger.log(
      `[UPDATE_TEACHER] Teacher ${teacherId} updated successfully`
    );

    // Get updated class counts
    const classCount = await this.classRepository.count({
      where: { teacherId: updatedUser.id },
    });

    const studentCount = await this.classStudentRepository
      .createQueryBuilder("cs")
      .innerJoin("cs.class", "class")
      .where("class.teacherId = :teacherId", { teacherId: updatedUser.id })
      .andWhere("cs.status = :status", { status: EnrollmentStatus.ACTIVE })
      .getCount();

    return {
      id: updatedUser.id,
      name:
        `${updatedUser.firstName || ""} ${updatedUser.lastName || ""}`.trim() ||
        updatedUser.email.split("@")[0],
      email: updatedUser.email,
      status: updatedUser.status,
      specialty: teacher.profile?.specialization || "General",
      degree: teacher.profile?.degree || "",
      phone: teacher.profile?.phone || "",
      bio: teacher.profile?.bio || "",
      courses: classCount,
      students: studentCount,
      rating: teacher.profile?.rating || 0,
      joined: updatedUser.createdAt?.toISOString().split("T")[0] || "",
    };
  }

  /**
   * Bulk action on teachers
   */
  async bulkTeacherAction(
    teacherIds: string[],
    action: "activate" | "deactivate" | "delete",
    adminId: string
  ): Promise<{ affected: number }> {
    this.logger.log(
      `[BULK_TEACHER_ACTION] Admin ${adminId} performing ${action} on ${teacherIds.length} teachers`
    );
    const teachers = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where("user.id IN (:...ids)", { ids: teacherIds })
      .andWhere("role.name = :role", { role: "teacher" })
      .getMany();

    if (teachers.length === 0) {
      this.logger.warn(
        `[BULK_TEACHER_ACTION] No teachers found for IDs: ${teacherIds.join(", ")}`
      );
      throw new NotFoundException("No teachers found");
    }

    if (action === "delete") {
      await this.userRepository.softRemove(teachers);
    } else {
      const newStatus =
        action === "activate" ? UserStatus.ACTIVE : UserStatus.INACTIVE;
      await this.userRepository.update(
        { id: In(teacherIds) },
        { status: newStatus }
      );
    }

    await this.adminLogService.create(adminId, {
      action: `teacher.bulk_${action}`,
      entityType: "user",
      newData: { teacherIds },
    });

    this.logger.log(
      `[BULK_TEACHER_ACTION] Successfully performed ${action} on ${teachers.length} teachers`
    );
    return { affected: teachers.length };
  }
}
