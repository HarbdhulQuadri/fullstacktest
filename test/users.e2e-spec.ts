import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as fs from 'fs';
import request = require('supertest');
import { AppModule } from '../src/app.module';

const TEST_SQLITE = process.env.DB_SQLITE_PATH || './.test-e2e.sqlite';

const validPayload = {
  userInfo: {
    firstName: 'Ada',
    lastName: 'Lovelace',
    dob: '1990-12-10',
    gender: 'female',
    occupation: 'Engineer',
  },
  userContact: {
    email: 'valid@example.com',
    phoneNumber: '+15551234567',
  },
  userAddress: {
    address: '12 Analytical Way',
    city: 'London',
    state: 'LDN',
    country: 'UK',
    zipCode: 'EC1A',
  },
  userAcademics: [
    {
      schoolName: 'University of London',
      degree: 'BSc',
      fieldOfStudy: 'Mathematics',
      startDate: '2008-09-01',
      endDate: '2012-06-01',
    },
  ],
};

describe('Users API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    if (fs.existsSync(TEST_SQLITE)) fs.unlinkSync(TEST_SQLITE);

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );
    await app.init();

    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: process.env.ADMIN_SEED_EMAIL,
        password: process.env.ADMIN_SEED_PASSWORD,
      })
      .expect(201);

    authToken = loginRes.body.access_token;
    expect(authToken).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
    if (fs.existsSync(TEST_SQLITE)) fs.unlinkSync(TEST_SQLITE);
  });

  const authed = (): Record<string, string> => ({
    Authorization: `Bearer ${authToken}`,
  });

  const countUsers = async (): Promise<number> => {
    const res = await request(app.getHttpServer())
      .get('/api/users')
      .set(authed())
      .expect(200);
    return res.body.length;
  };

  it('rejects unauthenticated requests with 401', async () => {
    await request(app.getHttpServer()).get('/api/users').expect(HttpStatus.UNAUTHORIZED);
  });

  it('persists all four tables on a successful create (atomic happy path)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/users')
      .set(authed())
      .send(validPayload)
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.contact.email).toBe(validPayload.userContact.email);
    expect(res.body.academics).toHaveLength(validPayload.userAcademics.length);

    const list = await request(app.getHttpServer())
      .get('/api/users')
      .set(authed())
      .expect(200);
    expect(list.body).toHaveLength(1);
  });

  it('returns a standardized error envelope for validation failures', async () => {
    const invalid = {
      ...validPayload,
      userContact: { ...validPayload.userContact, email: 'not-an-email' },
    };

    const res = await request(app.getHttpServer())
      .post('/api/users')
      .set(authed())
      .send(invalid)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    expect(res.body.error).toBe(true);
    expect(res.body.code).toBe('HTTP_422');
    expect(typeof res.body.message).toBe('string');
    expect(typeof res.body.timestamp).toBe('string');
  });

  it('does not create an orphan UserInfoTB when validation fails', async () => {
    const before = await countUsers();

    const invalidAcademics = {
      ...validPayload,
      userContact: { ...validPayload.userContact, email: 'orphan@example.com' },
      userAcademics: [{ degree: 'No school name' }] as Array<Record<string, unknown>>,
    };

    await request(app.getHttpServer())
      .post('/api/users')
      .set(authed())
      .send(invalidAcademics)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    const after = await countUsers();
    expect(after).toBe(before);
  });

  it('rolls back the transaction when a unique constraint fails (no orphan)', async () => {
    const duplicateEmail = 'duplicate@example.com';

    await request(app.getHttpServer())
      .post('/api/users')
      .set(authed())
      .send({
        ...validPayload,
        userInfo: { ...validPayload.userInfo, firstName: 'First' },
        userContact: { ...validPayload.userContact, email: duplicateEmail },
      })
      .expect(201);

    const before = await countUsers();

    const res = await request(app.getHttpServer())
      .post('/api/users')
      .set(authed())
      .send({
        ...validPayload,
        userInfo: { ...validPayload.userInfo, firstName: 'Second' },
        userContact: { ...validPayload.userContact, email: duplicateEmail },
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(res.body.error).toBe(true);
    expect(res.body.code).toBe('DATABASE_ERROR');

    const after = await countUsers();
    expect(after).toBe(before);
  });
});
