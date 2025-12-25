import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables
config();

// Import seeds
import { seedRoles } from './role.seed';
import { seedUsers } from './user.seed';
import { seedFreeAccounts } from './free-account.seed';
import { seedTeachers } from './teacher.seed';
import { seedCourses } from './course.seed';
import { seedClasses } from './class.seed';
import { seedNotifications } from './notification.seed';

// Create data source for seeding
const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'vstep',
  entities: ['src/**/*.entity.ts'],
  synchronize: false,
});

async function runSeeds() {
  try {
    console.log('🚀 Starting database seeding...\n');

    // Initialize connection
    await dataSource.initialize();
    console.log('✅ Database connected\n');

    // Run seeds in order
    console.log('📦 Seeding roles...');
    await seedRoles(dataSource);
    console.log('');

    // Seed users
    console.log('📦 Seeding users...');
    await seedUsers(dataSource);
    console.log('');

    // Seed free accounts (usage & packages)
    console.log('📦 Seeding free accounts...');
    await seedFreeAccounts(dataSource);
    console.log('');

    // Seed teachers with profiles
    console.log('📦 Seeding teachers...');
    await seedTeachers(dataSource);
    console.log('');

    // Seed courses with roadmap and documents
    console.log('📦 Seeding courses...');
    await seedCourses(dataSource);
    console.log('');

    // Seed classes with students and materials
    console.log('📦 Seeding classes...');
    await seedClasses(dataSource);
    console.log('');

    // Seed notifications
    console.log('📦 Seeding notifications...');
    await seedNotifications(dataSource);
    console.log('');

    // Add more seeds here as needed

    console.log('🎉 All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    process.exit(0);
  }
}

runSeeds();
