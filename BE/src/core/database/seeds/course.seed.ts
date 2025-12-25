import { DataSource } from 'typeorm';
import { Course, CourseStatus } from '../../../modules/courses/entities/course.entity';
import { RoadmapItem, RoadmapStatus } from '../../../modules/courses/entities/roadmap-item.entity';
import { Document } from '../../../modules/courses/entities/document.entity';
import { CourseClass, CourseClassStatus } from '../../../modules/courses/entities/course-class.entity';
import { User } from '../../../modules/users/entities/user.entity';

// Course data - instructorEmail will be used to find teacher user
const coursesData = [
  {
    title: 'VSTEP Foundation',
    category: 'Foundation',
    instructorEmail: 'nguyenvana@vstep.edu.vn',
    lessons: 20,
    duration: '20 buoi',
    price: '2,000,000d',
    rating: 4.8,
    reviews: 456,
    status: CourseStatus.ACTIVE,
    description: 'Khoa hoc nen tang VSTEP danh cho nguoi moi bat dau, cung cap kien thuc co ban ve 4 ky nang: Nghe, Noi, Doc, Viet.',
    classStudents: 1234, // Will create a class with this many students
  },
  {
    title: 'VSTEP Complete',
    category: 'Complete',
    instructorEmail: 'tranthib@vstep.edu.vn',
    lessons: 10,
    duration: '10 buoi',
    price: '1,500,000d',
    rating: 4.9,
    reviews: 324,
    status: CourseStatus.ACTIVE,
    description: 'Khoa hoc hoan chinh VSTEP, bao gom day du cac ky nang can thiet de dat diem cao trong ky thi.',
    classStudents: 856,
  },
  {
    title: 'VSTEP Master',
    category: 'Master',
    instructorEmail: 'levanc@vstep.edu.vn',
    lessons: 30,
    duration: '30 buoi',
    price: '3,500,000d',
    rating: 4.7,
    reviews: 289,
    status: CourseStatus.ACTIVE,
    description: 'Khoa hoc Master VSTEP danh cho hoc vien muon dat trinh do cao, voi cac bai tap nang cao va chien luoc lam bai hieu qua.',
    classStudents: 678,
  },
  {
    title: 'VSTEP Intensive',
    category: 'Intensive',
    instructorEmail: 'phamthid@vstep.edu.vn',
    lessons: 8,
    duration: '8 buoi',
    price: '1,200,000d',
    rating: 4.6,
    reviews: 412,
    status: CourseStatus.ACTIVE,
    description: 'Khoa hoc cap toc VSTEP, phu hop cho nhung ai can on thi nhanh trong thoi gian ngan.',
    classStudents: 945,
  },
  {
    title: 'VSTEP Business',
    category: 'Business',
    instructorEmail: 'hoangvane@vstep.edu.vn',
    lessons: 16,
    duration: '16 buoi',
    price: '2,500,000d',
    rating: 4.8,
    reviews: 523,
    status: CourseStatus.ACTIVE,
    description: 'Khoa hoc VSTEP chuyen ve tieng Anh thuong mai, phu hop cho doanh nhan va nhan vien van phong.',
    classStudents: 1123,
  },
  {
    title: 'VSTEP Academic',
    category: 'Academic',
    instructorEmail: 'vuthif@vstep.edu.vn',
    lessons: 18,
    duration: '18 buoi',
    price: '2,200,000d',
    rating: 4.5,
    reviews: 367,
    status: CourseStatus.ACTIVE,
    description: 'Khoa hoc VSTEP hoc thuat, danh cho sinh vien va nghien cuu sinh can chung chi tieng Anh.',
    classStudents: 789,
  },
  {
    title: 'VSTEP Sprint',
    category: 'Sprint',
    instructorEmail: 'dangvang@vstep.edu.vn',
    lessons: 6,
    duration: '6 buoi',
    price: '800,000d',
    rating: 4.7,
    reviews: 678,
    status: CourseStatus.ACTIVE,
    description: 'Khoa hoc Sprint sieu ngan, on tap trong tam cac dang bai thi VSTEP trong 6 buoi.',
    classStudents: 1456,
  },
  {
    title: 'VSTEP Excellence',
    category: 'Excellence',
    instructorEmail: 'buithih@vstep.edu.vn',
    lessons: 25,
    duration: '25 buoi',
    price: '2,800,000d',
    rating: 4.9,
    reviews: 234,
    status: CourseStatus.ACTIVE,
    description: 'Khoa hoc xuat sac VSTEP, cam ket dau ra voi phuong phap giang day tien tien.',
    classStudents: 567,
  },
  {
    title: 'VSTEP Pro',
    category: 'Professional',
    instructorEmail: 'dinhvani@vstep.edu.vn',
    lessons: 22,
    duration: '22 buoi',
    price: '2,600,000d',
    rating: 4.8,
    reviews: 445,
    status: CourseStatus.ACTIVE,
    description: 'Khoa hoc chuyen nghiep VSTEP, danh cho nguoi di lam can nang cao trinh do tieng Anh.',
    classStudents: 892,
  },
  {
    title: 'VSTEP Premium',
    category: 'Premium',
    instructorEmail: 'maithik@vstep.edu.vn',
    lessons: 24,
    duration: '24 buoi',
    price: '3,000,000d',
    rating: 4.9,
    reviews: 178,
    status: CourseStatus.ACTIVE,
    description: 'Khoa hoc cao cap VSTEP voi lo trinh ca nhan hoa, ho tro 1-1 va tai lieu doc quyen.',
    classStudents: 345,
  },
];

// Roadmap items for each course (sample for first 3 courses)
const roadmapTemplates = [
  { week: 1, title: 'Giới thiệu & Đánh giá đầu vào', lessons: 2, duration: '2 buổi', status: RoadmapStatus.COMPLETED },
  { week: 2, title: 'Kỹ năng Listening cơ bản', lessons: 3, duration: '3 buổi', status: RoadmapStatus.COMPLETED },
  { week: 3, title: 'Kỹ năng Reading cơ bản', lessons: 3, duration: '3 buổi', status: RoadmapStatus.IN_PROGRESS },
  { week: 4, title: 'Kỹ năng Writing Part 1', lessons: 3, duration: '3 buổi', status: RoadmapStatus.LOCKED },
  { week: 5, title: 'Kỹ năng Writing Part 2', lessons: 3, duration: '3 buổi', status: RoadmapStatus.LOCKED },
  { week: 6, title: 'Kỹ năng Speaking Part 1-2', lessons: 3, duration: '3 buổi', status: RoadmapStatus.LOCKED },
  { week: 7, title: 'Kỹ năng Speaking Part 3', lessons: 2, duration: '2 buổi', status: RoadmapStatus.LOCKED },
  { week: 8, title: 'Ôn tập tổng hợp & Mock Test', lessons: 2, duration: '2 buổi', status: RoadmapStatus.LOCKED },
];

// Sample documents for courses
const documentTemplates = [
  { name: 'Tài liệu bài giảng - Listening', type: 'PDF', size: '2.5 MB', downloads: 156 },
  { name: 'Tài liệu bài giảng - Reading', type: 'PDF', size: '3.2 MB', downloads: 142 },
  { name: 'Tài liệu bài giảng - Writing', type: 'PDF', size: '1.8 MB', downloads: 198 },
  { name: 'Tài liệu bài giảng - Speaking', type: 'PDF', size: '2.1 MB', downloads: 167 },
  { name: 'Audio files - Listening Practice', type: 'ZIP', size: '45 MB', downloads: 234 },
  { name: 'Sample Essays - Writing', type: 'DOCX', size: '1.2 MB', downloads: 289 },
];

export async function seedCourses(dataSource: DataSource) {
  const courseRepo = dataSource.getRepository(Course);
  const roadmapRepo = dataSource.getRepository(RoadmapItem);
  const documentRepo = dataSource.getRepository(Document);
  const classRepo = dataSource.getRepository(CourseClass);
  const userRepo = dataSource.getRepository(User);

  let createdCount = 0;
  let skippedCount = 0;

  for (const courseData of coursesData) {
    // Check if course already exists
    const existingCourse = await courseRepo.findOne({
      where: { title: courseData.title },
    });

    if (existingCourse) {
      console.log(`  ⏭️  Course "${courseData.title}" already exists, skipping...`);
      skippedCount++;
      continue;
    }

    // Find instructor by email
    let instructorId: string | null = null;
    if (courseData.instructorEmail) {
      const instructor = await userRepo.findOne({
        where: { email: courseData.instructorEmail },
      });
      if (instructor) {
        instructorId = instructor.id;
      }
    }

    // Prepare course data (exclude instructorEmail and classStudents)
    const { instructorEmail, classStudents, ...coursePayload } = courseData;

    // Create course
    const course = courseRepo.create({
      ...coursePayload,
      instructorId,
    });
    await courseRepo.save(course);
    console.log(`  ✅ Created course: ${course.title}`);
    createdCount++;

    // Create default class with students
    const defaultClass = classRepo.create({
      courseId: course.id,
      name: `Lop ${course.title}`,
      students: classStudents,
      maxStudents: Math.ceil(classStudents * 1.5),
      status: CourseClassStatus.ACTIVE,
    });
    await classRepo.save(defaultClass);
    console.log(`     👥 Created class with ${classStudents} students`);

    // Create roadmap items for first 3 courses
    if (createdCount <= 3) {
      for (let i = 0; i < roadmapTemplates.length; i++) {
        const roadmapData = roadmapTemplates[i];
        const roadmapItem = roadmapRepo.create({
          ...roadmapData,
          courseId: course.id,
          orderIndex: i + 1,
        });
        await roadmapRepo.save(roadmapItem);
      }
      console.log(`     📍 Created ${roadmapTemplates.length} roadmap items`);
    }

    // Create documents for first 3 courses
    if (createdCount <= 3) {
      for (const docData of documentTemplates) {
        const document = documentRepo.create({
          ...docData,
          courseId: course.id,
        });
        await documentRepo.save(document);
      }
      console.log(`     📄 Created ${documentTemplates.length} documents`);
    }
  }

  console.log(`  📊 Summary: ${createdCount} created, ${skippedCount} skipped`);
}
