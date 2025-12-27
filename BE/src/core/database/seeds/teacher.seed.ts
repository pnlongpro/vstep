import { DataSource } from 'typeorm';
import { User, UserStatus } from '../../../modules/users/entities/user.entity';
import { Role } from '../../../modules/users/entities/role.entity';
import { UserProfile } from '../../../modules/users/entities/user-profile.entity';
import * as bcrypt from 'bcrypt';

const teacherData = [
  {
    email: 'nguyenvana@vstep.edu.vn',
    firstName: 'TS. Nguyễn Văn',
    lastName: 'A',
    specialization: 'Writing',
    degree: 'Tiến sĩ',
    rating: 4.8,
    certifications: ['IELTS 8.5', 'TESOL', 'CELTA'],
  },
  {
    email: 'tranthib@vstep.edu.vn',
    firstName: 'ThS. Trần Thị',
    lastName: 'B',
    specialization: 'Speaking',
    degree: 'Thạc sĩ',
    rating: 4.9,
    certifications: ['IELTS 8.0', 'TESOL'],
  },
  {
    email: 'levanc@vstep.edu.vn',
    firstName: 'TS. Lê Văn',
    lastName: 'C',
    specialization: 'Reading',
    degree: 'Tiến sĩ',
    rating: 4.7,
    certifications: ['IELTS 9.0', 'DELTA', 'TESOL'],
  },
  {
    email: 'phamthid@vstep.edu.vn',
    firstName: 'ThS. Phạm Thị',
    lastName: 'D',
    specialization: 'Listening',
    degree: 'Thạc sĩ',
    rating: 4.6,
    certifications: ['IELTS 7.5', 'CELTA'],
    status: UserStatus.INACTIVE,
  },
  {
    email: 'hoangvane@vstep.edu.vn',
    firstName: 'GV. Hoàng Văn',
    lastName: 'E',
    specialization: 'Grammar',
    degree: 'Cử nhân',
    rating: 4.8,
    certifications: ['IELTS 8.0', 'TESOL'],
  },
  {
    email: 'vuthif@vstep.edu.vn',
    firstName: 'TS. Vũ Thị',
    lastName: 'F',
    specialization: 'Writing',
    degree: 'Tiến sĩ',
    rating: 4.9,
    certifications: ['IELTS 8.5', 'DELTA'],
  },
  {
    email: 'dangvang@vstep.edu.vn',
    firstName: 'ThS. Đặng Văn',
    lastName: 'G',
    specialization: 'Speaking',
    degree: 'Thạc sĩ',
    rating: 4.7,
    certifications: ['IELTS 8.0', 'TESOL'],
  },
  {
    email: 'buithih@vstep.edu.vn',
    firstName: 'GV. Bùi Thị',
    lastName: 'H',
    specialization: 'Reading',
    degree: 'Cử nhân',
    rating: 4.5,
    certifications: ['IELTS 7.5'],
  },
  {
    email: 'dinhvani@vstep.edu.vn',
    firstName: 'TS. Đinh Văn',
    lastName: 'I',
    specialization: 'Listening',
    degree: 'Tiến sĩ',
    rating: 4.8,
    certifications: ['IELTS 8.5', 'CELTA', 'TESOL'],
  },
  {
    email: 'maithik@vstep.edu.vn',
    firstName: 'ThS. Mai Thị',
    lastName: 'K',
    specialization: 'Vocabulary',
    degree: 'Thạc sĩ',
    rating: 4.9,
    certifications: ['IELTS 8.0', 'TESOL'],
  },
];

export async function seedTeachers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);
  const profileRepository = dataSource.getRepository(UserProfile);

  // Get teacher role
  const teacherRole = await roleRepository.findOne({ where: { name: 'teacher' } });
  if (!teacherRole) {
    console.log('❌ Teacher role not found. Please run role seeds first.');
    return;
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  for (const data of teacherData) {
    // Check if user exists
    const existingUser = await userRepository.findOne({ where: { email: data.email } });
    if (existingUser) {
      console.log(`⏭️  Teacher ${data.email} already exists, skipping...`);
      continue;
    }

    // Create user
    const user = userRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: teacherRole,
      status: data.status || UserStatus.ACTIVE,
    });

    const savedUser = await userRepository.save(user);

    // Create profile with teacher-specific fields
    const profile = profileRepository.create({
      userId: savedUser.id,
      specialization: data.specialization,
      degree: data.degree,
      rating: data.rating,
    });

    await profileRepository.save(profile);

    console.log(`✅ Created teacher: ${data.firstName} ${data.lastName} (${data.email})`);
  }

  console.log(`\n📊 Teachers seeding completed!`);
}
