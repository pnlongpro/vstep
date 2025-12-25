import { DataSource } from 'typeorm';
import { UserUsage } from '../../../modules/users/entities/user-usage.entity';
import { UserPackage, PlanType } from '../../../modules/users/entities/user-package.entity';
import { USER_IDS } from './user.seed';

// Fixed UUIDs for user usage
export const USER_USAGE_IDS = {
  STUDENT_01: '55555555-5555-5555-5555-555555555001',
  STUDENT_02: '55555555-5555-5555-5555-555555555002',
  STUDENT_03: '55555555-5555-5555-5555-555555555003',
  STUDENT_04: '55555555-5555-5555-5555-555555555004',
  STUDENT_05: '55555555-5555-5555-5555-555555555005',
  STUDENT_06: '55555555-5555-5555-5555-555555555006',
  STUDENT_07: '55555555-5555-5555-5555-555555555007',
  STUDENT_08: '55555555-5555-5555-5555-555555555008',
  STUDENT_09: '55555555-5555-5555-5555-555555555009',
  STUDENT_10: '55555555-5555-5555-5555-555555555010',
};

// Fixed UUIDs for user packages
export const USER_PACKAGE_IDS = {
  STUDENT_01: '66666666-6666-6666-6666-666666666001',
  STUDENT_02: '66666666-6666-6666-6666-666666666002',
  STUDENT_03: '66666666-6666-6666-6666-666666666003',
  STUDENT_04: '66666666-6666-6666-6666-666666666004',
  STUDENT_05: '66666666-6666-6666-6666-666666666005',
  STUDENT_06: '66666666-6666-6666-6666-666666666006',
  STUDENT_07: '66666666-6666-6666-6666-666666666007',
  STUDENT_08: '66666666-6666-6666-6666-666666666008',
  STUDENT_09: '66666666-6666-6666-6666-666666666009',
  STUDENT_10: '66666666-6666-6666-6666-666666666010',
};

interface FreeAccountSeedData {
  usage: Partial<UserUsage>;
  package: Partial<UserPackage>;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const freeAccountsData: FreeAccountSeedData[] = [
  // Student 01: Active user, used 2/3 mock tests, 1/1 AI speaking today
  {
    usage: {
      id: USER_USAGE_IDS.STUDENT_01,
      userId: USER_IDS.STUDENT_01,
      mockTestsUsed: 2,
      aiSpeakingUsedToday: 1,
      aiWritingUsedToday: 0,
      lastAiResetDate: today,
    },
    package: {
      id: USER_PACKAGE_IDS.STUDENT_01,
      userId: USER_IDS.STUDENT_01,
      plan: PlanType.FREE,
      mockTestLimit: 3,
      aiSpeakingDailyLimit: 1,
      aiWritingDailyLimit: 1,
      startDate: new Date('2025-01-15'),
      endDate: null,
      autoRenew: false,
      isActive: true,
    },
  },
  // Student 02: Maxed out free plan
  {
    usage: {
      id: USER_USAGE_IDS.STUDENT_02,
      userId: USER_IDS.STUDENT_02,
      mockTestsUsed: 3,
      aiSpeakingUsedToday: 1,
      aiWritingUsedToday: 1,
      lastAiResetDate: today,
    },
    package: {
      id: USER_PACKAGE_IDS.STUDENT_02,
      userId: USER_IDS.STUDENT_02,
      plan: PlanType.FREE,
      mockTestLimit: 3,
      aiSpeakingDailyLimit: 1,
      aiWritingDailyLimit: 1,
      startDate: new Date('2025-01-14'),
      endDate: null,
      autoRenew: false,
      isActive: true,
    },
  },
  // Student 03: Inactive user, minimal usage
  {
    usage: {
      id: USER_USAGE_IDS.STUDENT_03,
      userId: USER_IDS.STUDENT_03,
      mockTestsUsed: 1,
      aiSpeakingUsedToday: 0,
      aiWritingUsedToday: 0,
      lastAiResetDate: new Date('2025-01-10'),
    },
    package: {
      id: USER_PACKAGE_IDS.STUDENT_03,
      userId: USER_IDS.STUDENT_03,
      plan: PlanType.FREE,
      mockTestLimit: 3,
      aiSpeakingDailyLimit: 1,
      aiWritingDailyLimit: 1,
      startDate: new Date('2025-01-10'),
      endDate: null,
      autoRenew: false,
      isActive: true,
    },
  },
  // Student 04: New user, no usage yet
  {
    usage: {
      id: USER_USAGE_IDS.STUDENT_04,
      userId: USER_IDS.STUDENT_04,
      mockTestsUsed: 0,
      aiSpeakingUsedToday: 0,
      aiWritingUsedToday: 1,
      lastAiResetDate: today,
    },
    package: {
      id: USER_PACKAGE_IDS.STUDENT_04,
      userId: USER_IDS.STUDENT_04,
      plan: PlanType.FREE,
      mockTestLimit: 3,
      aiSpeakingDailyLimit: 1,
      aiWritingDailyLimit: 1,
      startDate: new Date('2025-01-12'),
      endDate: null,
      autoRenew: false,
      isActive: true,
    },
  },
  // Student 05: Maxed out mock tests, needs to upgrade
  {
    usage: {
      id: USER_USAGE_IDS.STUDENT_05,
      userId: USER_IDS.STUDENT_05,
      mockTestsUsed: 3,
      aiSpeakingUsedToday: 1,
      aiWritingUsedToday: 1,
      lastAiResetDate: new Date('2025-01-08'),
    },
    package: {
      id: USER_PACKAGE_IDS.STUDENT_05,
      userId: USER_IDS.STUDENT_05,
      plan: PlanType.FREE,
      mockTestLimit: 3,
      aiSpeakingDailyLimit: 1,
      aiWritingDailyLimit: 1,
      startDate: new Date('2025-01-08'),
      endDate: null,
      autoRenew: false,
      isActive: true,
    },
  },
  // Student 06: Active user with moderate usage
  {
    usage: {
      id: USER_USAGE_IDS.STUDENT_06,
      userId: USER_IDS.STUDENT_06,
      mockTestsUsed: 1,
      aiSpeakingUsedToday: 1,
      aiWritingUsedToday: 0,
      lastAiResetDate: today,
    },
    package: {
      id: USER_PACKAGE_IDS.STUDENT_06,
      userId: USER_IDS.STUDENT_06,
      plan: PlanType.FREE,
      mockTestLimit: 3,
      aiSpeakingDailyLimit: 1,
      aiWritingDailyLimit: 1,
      startDate: new Date('2025-01-13'),
      endDate: null,
      autoRenew: false,
      isActive: true,
    },
  },
  // Student 07: Brand new user
  {
    usage: {
      id: USER_USAGE_IDS.STUDENT_07,
      userId: USER_IDS.STUDENT_07,
      mockTestsUsed: 0,
      aiSpeakingUsedToday: 0,
      aiWritingUsedToday: 0,
      lastAiResetDate: today,
    },
    package: {
      id: USER_PACKAGE_IDS.STUDENT_07,
      userId: USER_IDS.STUDENT_07,
      plan: PlanType.FREE,
      mockTestLimit: 3,
      aiSpeakingDailyLimit: 1,
      aiWritingDailyLimit: 1,
      startDate: new Date('2025-01-20'),
      endDate: null,
      autoRenew: false,
      isActive: true,
    },
  },
  // Student 08: Active user
  {
    usage: {
      id: USER_USAGE_IDS.STUDENT_08,
      userId: USER_IDS.STUDENT_08,
      mockTestsUsed: 2,
      aiSpeakingUsedToday: 0,
      aiWritingUsedToday: 1,
      lastAiResetDate: today,
    },
    package: {
      id: USER_PACKAGE_IDS.STUDENT_08,
      userId: USER_IDS.STUDENT_08,
      plan: PlanType.FREE,
      mockTestLimit: 3,
      aiSpeakingDailyLimit: 1,
      aiWritingDailyLimit: 1,
      startDate: new Date('2025-01-11'),
      endDate: null,
      autoRenew: false,
      isActive: true,
    },
  },
  // Student 09: Inactive for a while
  {
    usage: {
      id: USER_USAGE_IDS.STUDENT_09,
      userId: USER_IDS.STUDENT_09,
      mockTestsUsed: 1,
      aiSpeakingUsedToday: 0,
      aiWritingUsedToday: 0,
      lastAiResetDate: new Date('2025-01-05'),
    },
    package: {
      id: USER_PACKAGE_IDS.STUDENT_09,
      userId: USER_IDS.STUDENT_09,
      plan: PlanType.FREE,
      mockTestLimit: 3,
      aiSpeakingDailyLimit: 1,
      aiWritingDailyLimit: 1,
      startDate: new Date('2025-01-05'),
      endDate: null,
      autoRenew: false,
      isActive: true,
    },
  },
  // Student 10: Moderate usage
  {
    usage: {
      id: USER_USAGE_IDS.STUDENT_10,
      userId: USER_IDS.STUDENT_10,
      mockTestsUsed: 2,
      aiSpeakingUsedToday: 1,
      aiWritingUsedToday: 1,
      lastAiResetDate: today,
    },
    package: {
      id: USER_PACKAGE_IDS.STUDENT_10,
      userId: USER_IDS.STUDENT_10,
      plan: PlanType.FREE,
      mockTestLimit: 3,
      aiSpeakingDailyLimit: 1,
      aiWritingDailyLimit: 1,
      startDate: new Date('2025-01-09'),
      endDate: null,
      autoRenew: false,
      isActive: true,
    },
  },
];

export async function seedFreeAccounts(dataSource: DataSource): Promise<void> {
  const usageRepo = dataSource.getRepository(UserUsage);
  const packageRepo = dataSource.getRepository(UserPackage);

  console.log('📦 Seeding free accounts (usage & packages)...');

  for (const data of freeAccountsData) {
    // Check if usage already exists
    const existingUsage = await usageRepo.findOne({ where: { id: data.usage.id } });
    
    if (existingUsage) {
      console.log(`⏭️  UserUsage for ${data.usage.userId} already exists, skipping...`);
    } else {
      // Create usage
      const usage = usageRepo.create(data.usage);
      await usageRepo.save(usage);
      console.log(`✅ Created UserUsage for user: ${data.usage.userId}`);
    }

    // Check if package already exists
    const existingPackage = await packageRepo.findOne({ where: { id: data.package.id } });
    
    if (existingPackage) {
      console.log(`⏭️  UserPackage for ${data.package.userId} already exists, skipping...`);
    } else {
      // Create package
      const pkg = packageRepo.create(data.package);
      await packageRepo.save(pkg);
      console.log(`✅ Created UserPackage (${data.package.plan}) for user: ${data.package.userId}`);
    }
  }

  console.log('🎉 Free accounts seeding completed!');
}
