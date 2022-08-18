import { faker } from '@faker-js/faker';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

import app from '../../src/app';
import { init, getRandomElement, TEST_PASSWORD, TEST_EMAIL } from '../helper';

describe('Auth Workflow', () => {
  const email = TEST_EMAIL;
  const password = TEST_PASSWORD;

  let accessToken: string;
  let authorization: string;

  beforeAll(async () => {
    await init();

    const response = await request(app)
      .post('/login')
      .send({ email, password: TEST_PASSWORD });

    authorization = `Bearer ${response.body.data.refreshToken}`;
  });

  describe('Login API test', () => {
    test('should login successfully with valid credentials.', () => {
      const expectedResponse = {
        code: StatusCodes.OK,
        message: expect.any(String),
        data: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        }
      };

      return request(app)
        .post('/login')
        .send({ email, password })
        .then((res) => {
          expect(res.status).toBe(StatusCodes.OK);
          expect(res.body).toEqual(expectedResponse);
        });
    });

    test('should fail login with invalid credentials.', () => {
      const expectedResponse = {
        code: StatusCodes.UNAUTHORIZED,
        message: expect.any(String)
      };

      return request(app)
        .post('/login')
        .send({ email, password: `${password}${password}` })
        .then((res) => {
          expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
          expect(res.body).toEqual(expectedResponse);
        });
    });

    test('should fail login without login payload.', () => {
      const expectedResponse = {
        code: StatusCodes.BAD_REQUEST,
        message: expect.any(String),
        data: expect.any(Array)
      };

      const badRequestResponse = {
        param: expect.any(String),
        message: expect.any(String)
      };

      return request(app)
        .post('/login')
        .then((res) => {
          const errorResponse = getRandomElement(res.body.data);

          expect(res.status).toBe(StatusCodes.BAD_REQUEST);
          expect(res.body).toEqual(expectedResponse);
          expect(errorResponse).toEqual(badRequestResponse);
        });
    });
  });

  describe('Refresh token API test', () => {
    test('should refresh access token successfully with valid authorization token.', () => {
      const expectedResponse = {
        code: StatusCodes.OK,
        message: expect.any(String),
        data: {
          accessToken: expect.any(String)
        }
      };

      return request(app)
        .post('/refresh')
        .set({ authorization })
        .then((res) => {
          accessToken = res.body.data.accessToken;

          expect(res.status).toBe(StatusCodes.OK);
          expect(res.body).toEqual(expectedResponse);
        });
    });

    test('should successfully access API with new access token.', () => {
      const userBody = {
        name: faker.name.findName(),
        email: 'dummy-user@starter.com',
        password: faker.internet.password()
      };
      return request(app)
        .post('/users')
        .set({ authorization: `Bearer ${accessToken}` })
        .send(userBody)
        .then((res) => {
          expect(res.status).toBe(StatusCodes.OK);
        });
    });

    test('should fail refresh with invalid authorization token.', () => {
      const expectedResponse = {
        code: StatusCodes.UNAUTHORIZED,
        message: expect.any(String)
      };

      return request(app)
        .post('/refresh')
        .set({ authorization: faker.random.alphaNumeric() })
        .then((res) => {
          expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
          expect(res.body).toEqual(expectedResponse);
        });
    });
  });

  describe('Logout API test', () => {
    test('should logout successfully with valid authorization token.', () => {
      const expectedResponse = {
        code: StatusCodes.OK,
        message: expect.any(String)
      };

      return request(app)
        .post('/logout')
        .set({ authorization })
        .then((res) => {
          expect(res.status).toBe(StatusCodes.OK);
          expect(res.body).toEqual(expectedResponse);
        });
    });

    test('should fail logout with invalid authorization token.', () => {
      const expectedResponse = {
        code: StatusCodes.UNAUTHORIZED,
        message: expect.any(String)
      };

      return request(app)
        .post('/logout')
        .set({ authorization: faker.random.alphaNumeric() })
        .then((res) => {
          expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
          expect(res.body).toEqual(expectedResponse);
        });
    });
  });
});

describe('Sign Up API test', () => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  const name = `${faker.name.firstName('male')} ${faker.name.lastName(
    'female'
  )}`;
  beforeAll(async () => {
    await init();
  });
  test('should sign up successfully.', () => {
    const expectedResponse = {
      code: StatusCodes.OK,
      message: expect.any(String),
      data: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String)
      }
    };

    return request(app)
      .post('/sign-up')
      .send({ name, email, password })
      .then((res) => {
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(expectedResponse);
      });
  });

  test('should fail sign up with bad email.', () => {
    return request(app)
      .post('/sign-up')
      .send({ email: 'bademail', password: `${password}` })
      .then((res) => {
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      });
  });
});
