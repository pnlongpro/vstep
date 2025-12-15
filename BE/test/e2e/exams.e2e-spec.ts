import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Exams Module (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login to get access token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'student@example.com',
        password: 'Password123!',
      });

    accessToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/exams/mock-exams/random (POST)', () => {
    it('should return 4 random exams', () => {
      return request(app.getHttpServer())
        .post('/exams/mock-exams/random')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ level: 'B2' })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.exams).toHaveProperty('reading');
          expect(res.body.data.exams).toHaveProperty('listening');
          expect(res.body.data.exams).toHaveProperty('writing');
          expect(res.body.data.exams).toHaveProperty('speaking');
          expect(res.body.data.level).toBe('B2');
        });
    });
  });

  describe('/exams/mock-exams (POST)', () => {
    it('should start a mock exam', async () => {
      // First, get random exams
      const randomResponse = await request(app.getHttpServer())
        .post('/exams/mock-exams/random')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ level: 'B2' });

      const { reading, listening, writing, speaking } =
        randomResponse.body.data.exams;

      return request(app.getHttpServer())
        .post('/exams/mock-exams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          readingExerciseId: reading.id,
          listeningExerciseId: listening.id,
          writingExerciseId: writing.id,
          speakingExerciseId: speaking.id,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('mockExamId');
          expect(res.body.data).toHaveProperty('startedAt');
          expect(res.body.data).toHaveProperty('expiresAt');
          expect(res.body.data.totalTime).toBe(172 * 60);
        });
    });
  });

  describe('/exams/mock-exams/:id/save (PUT)', () => {
    it('should auto-save exam progress', async () => {
      // Create an exam first
      const randomResponse = await request(app.getHttpServer())
        .post('/exams/mock-exams/random')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ level: 'B2' });

      const { reading, listening, writing, speaking } =
        randomResponse.body.data.exams;

      const startResponse = await request(app.getHttpServer())
        .post('/exams/mock-exams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          readingExerciseId: reading.id,
          listeningExerciseId: listening.id,
          writingExerciseId: writing.id,
          speakingExerciseId: speaking.id,
        });

      const examId = startResponse.body.data.mockExamId;

      return request(app.getHttpServer())
        .put(`/exams/mock-exams/${examId}/save`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          skill: 'reading',
          answers: {
            1: 'A',
            2: 'B',
            3: 'C',
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Progress saved');
        });
    });
  });

  describe('/exams/exercises (GET)', () => {
    it('should return list of exercises', () => {
      return request(app.getHttpServer())
        .get('/exams/exercises')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ skill: 'reading', level: 'B2', page: 1, limit: 10 })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('exercises');
          expect(res.body.data).toHaveProperty('pagination');
          expect(Array.isArray(res.body.data.exercises)).toBe(true);
        });
    });
  });

  describe('Unauthorized access', () => {
    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/exams/exercises')
        .expect(401);
    });
  });
});
