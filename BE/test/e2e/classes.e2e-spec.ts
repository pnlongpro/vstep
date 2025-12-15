import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Classes Module (e2e)', () => {
  let app: INestApplication;
  let teacherToken: string;
  let studentToken: string;
  let classId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login as teacher
    const teacherLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'teacher@example.com',
        password: 'Password123!',
      });
    teacherToken = teacherLogin.body.data.accessToken;

    // Login as student
    const studentLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'student@example.com',
        password: 'Password123!',
      });
    studentToken = studentLogin.body.data.accessToken;
  });

  afterAll(async () => {
    // Clean up: delete test class if created
    if (classId) {
      await request(app.getHttpServer())
        .delete(`/classes/${classId}`)
        .set('Authorization', `Bearer ${teacherToken}`);
    }
    await app.close();
  });

  describe('/classes (POST)', () => {
    it('should create a new class (Teacher)', () => {
      return request(app.getHttpServer())
        .post('/classes')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          name: 'VSTEP B2 Test Class',
          description: 'Test class for E2E testing',
          level: 'B2',
          maxStudents: 30,
          startDate: '2024-01-01',
          endDate: '2024-06-30',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('classId');
          expect(res.body.data).toHaveProperty('classCode');
          classId = res.body.data.classId;
        });
    });

    it('should fail to create class without teacher role', () => {
      return request(app.getHttpServer())
        .post('/classes')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          name: 'Test Class',
          level: 'B2',
        })
        .expect(403);
    });
  });

  describe('/classes (GET)', () => {
    it('should get list of classes', () => {
      return request(app.getHttpServer())
        .get('/classes')
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('classes');
          expect(Array.isArray(res.body.data.classes)).toBe(true);
        });
    });
  });

  describe('/classes/:id (GET)', () => {
    it('should get class details', async () => {
      // First create a class
      const createResponse = await request(app.getHttpServer())
        .post('/classes')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          name: 'Detail Test Class',
          level: 'B2',
        });

      const testClassId = createResponse.body.data.classId;

      return request(app.getHttpServer())
        .get(`/classes/${testClassId}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data).toHaveProperty('classCode');
          expect(res.body.data.name).toBe('Detail Test Class');
        });
    });
  });

  describe('/classes/join (POST)', () => {
    it('should allow student to join class with code', async () => {
      // First create a class
      const createResponse = await request(app.getHttpServer())
        .post('/classes')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          name: 'Join Test Class',
          level: 'B2',
        });

      const classCode = createResponse.body.data.classCode;

      return request(app.getHttpServer())
        .post('/classes/join')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          classCode: classCode,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('classId');
          expect(res.body.data).toHaveProperty('joinedAt');
        });
    });

    it('should fail with invalid class code', () => {
      return request(app.getHttpServer())
        .post('/classes/join')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          classCode: 'INVALID',
        })
        .expect(404);
    });
  });

  describe('/classes/:id/schedule (POST)', () => {
    it('should create class schedule (Teacher)', async () => {
      // Create a class first
      const createResponse = await request(app.getHttpServer())
        .post('/classes')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          name: 'Schedule Test Class',
          level: 'B2',
        });

      const testClassId = createResponse.body.data.classId;

      return request(app.getHttpServer())
        .post(`/classes/${testClassId}/schedule`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          title: 'Week 1 Lesson',
          date: '2024-12-20',
          startTime: '09:00',
          endTime: '11:00',
          location: 'Room 101',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('scheduleId');
        });
    });
  });

  describe('/classes/:id/attendance (POST)', () => {
    it('should mark attendance (Teacher)', async () => {
      // Create a class and add a student
      const createResponse = await request(app.getHttpServer())
        .post('/classes')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          name: 'Attendance Test Class',
          level: 'B2',
        });

      const testClassId = createResponse.body.data.classId;
      const classCode = createResponse.body.data.classCode;

      // Student joins
      const joinResponse = await request(app.getHttpServer())
        .post('/classes/join')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ classCode });

      const studentId = joinResponse.body.data.userId || 'test-student-id';

      return request(app.getHttpServer())
        .post(`/classes/${testClassId}/attendance`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          sessionDate: '2024-12-15',
          records: [
            {
              userId: studentId,
              status: 'present',
              note: 'On time',
            },
          ],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Attendance marked successfully');
        });
    });
  });
});
