import { faker } from '@faker-js/faker';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

import app from '../../src/app';
import { getRandomElement, init, TEST_EMAIL, TEST_PASSWORD } from '../helper';

describe('POST /users API test', () => {
  let authorization: string;

  const email = TEST_EMAIL;
  const password = TEST_PASSWORD;

  beforeAll(async () => {
    await init();

    const response = await request(app)
      .post('/login')
      .send({ email, password });

    authorization = `Bearer ${response.body.data.accessToken}`;
  });

  test('should successfully insert user detail into database and return inserted user detail.', () => {
    const userBody = {
      name: faker.name.findName(),
      email: 'dummy-user@starter.com',
      password: faker.internet.password()
    };
    const expectedResponse = {
      code: StatusCodes.OK,
      message: expect.any(String),
      data: {
        user: expect.any(Object),
        currency: expect.any(Object),
        wallet: expect.any(Object)
      }
    };
    return request(app)
      .post('/users')
      .set({ authorization })
      .send(userBody)
      .then((res) => {
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(expectedResponse);
      });
  });

  test('should fail request when payload is incorrect.', () => {
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
      .post('/users')
      .set({ authorization })
      .then((res) => {
        const errorResponse = getRandomElement(res.body.data);

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(expectedResponse);
        expect(errorResponse).toEqual(badRequestResponse);
      });
  });

  test('should fail request without authorization token.', () => {
    return request(app)
      .post('/users')
      .then((res) => {
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      });
  });
});
