import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Gamification Module (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let goalId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'student@example.com',
        password: 'Password123!',
      });

    accessToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    // Clean up: delete test goal if created
    if (goalId) {
      await request(app.getHttpServer())
        .delete(`/gamification/goals/${goalId}`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
    await app.close();
  });

  describe('/gamification/badges (GET)', () => {
    it('should return list of badges', () => {
      return request(app.getHttpServer())
        .get('/gamification/badges')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('earned');
          expect(res.body.data).toHaveProperty('available');
          expect(Array.isArray(res.body.data.earned)).toBe(true);
          expect(Array.isArray(res.body.data.available)).toBe(true);
        });
    });
  });

  describe('/gamification/badges/earned (GET)', () => {
    it('should return earned badges only', () => {
      return request(app.getHttpServer())
        .get('/gamification/badges/earned')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('badges');
          expect(Array.isArray(res.body.data.badges)).toBe(true);
        });
    });
  });

  describe('/gamification/goals (GET)', () => {
    it('should return list of goals', () => {
      return request(app.getHttpServer())
        .get('/gamification/goals')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('goals');
          expect(Array.isArray(res.body.data.goals)).toBe(true);
        });
    });

    it('should filter goals by status', () => {
      return request(app.getHttpServer())
        .get('/gamification/goals')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ status: 'active' })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('goals');
        });
    });
  });

  describe('/gamification/goals (POST)', () => {
    it('should create a new goal', () => {
      return request(app.getHttpServer())
        .post('/gamification/goals')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Complete 20 Reading exercises',
          description: 'Practice reading skill',
          type: 'exercise_count',
          targetValue: 20,
          endDate: '2024-12-31',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('goalId');
          goalId = res.body.data.goalId;
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/gamification/goals')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Incomplete Goal',
          // Missing required fields
        })
        .expect(400);
    });
  });

  describe('/gamification/goals/:id (PUT)', () => {
    it('should update a goal', async () => {
      // Create a goal first
      const createResponse = await request(app.getHttpServer())
        .post('/gamification/goals')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Update Test Goal',
          type: 'exercise_count',
          targetValue: 10,
          endDate: '2024-12-31',
        });

      const testGoalId = createResponse.body.data.goalId;

      return request(app.getHttpServer())
        .put(`/gamification/goals/${testGoalId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated Goal Title',
          targetValue: 15,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Goal updated successfully');
        });
    });
  });

  describe('/gamification/goals/:id/abandon (POST)', () => {
    it('should abandon a goal', async () => {
      // Create a goal first
      const createResponse = await request(app.getHttpServer())
        .post('/gamification/goals')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Abandon Test Goal',
          type: 'exercise_count',
          targetValue: 10,
          endDate: '2024-12-31',
        });

      const testGoalId = createResponse.body.data.goalId;

      return request(app.getHttpServer())
        .post(`/gamification/goals/${testGoalId}/abandon`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Goal abandoned');
        });
    });
  });

  describe('/gamification/leaderboards (GET)', () => {
    it('should return leaderboard', () => {
      return request(app.getHttpServer())
        .get('/gamification/leaderboards')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('leaderboard');
          expect(Array.isArray(res.body.data.leaderboard)).toBe(true);
        });
    });

    it('should filter leaderboard by period', () => {
      return request(app.getHttpServer())
        .get('/gamification/leaderboards')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ period: 'weekly' })
        .expect(200);
    });
  });

  describe('/gamification/points (GET)', () => {
    it('should return user points', () => {
      return request(app.getHttpServer())
        .get('/gamification/points')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('totalPoints');
          expect(res.body.data).toHaveProperty('lifetimePoints');
          expect(res.body.data).toHaveProperty('currentMultiplier');
        });
    });
  });
});
