// import { faker } from '@faker-js/faker';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import UserWalletDetail from '../../src/domain/entities/UserWalletDetail';

import app from '../../src/app';
import { init, TEST_EMAIL, TEST_PASSWORD } from '../helper';

describe('POST /wallet/fund API test', () => {
  let authorization: string;
  let userWalletDetail: UserWalletDetail;

  const email = TEST_EMAIL;
  const password = TEST_PASSWORD;

  beforeAll(async () => {
    userWalletDetail = await init();

    const response = await request(app)
      .post('/login')
      .send({ email, password });

    authorization = `Bearer ${response.body.data.accessToken}`;
  });

  test("should successfully fund user wallet and return user's wallet detail.", () => {
    const userBody = {
      walletId: userWalletDetail?.wallet?.id,
      amount: 5000
    };
    const expectedResponse = {
      code: StatusCodes.OK,
      message: expect.any(String),
      data: {
        userId: expect.any(Number),
        balance: expect.any(Number)
      }
    };
    return request(app)
      .post('/wallet/fund')
      .set({ authorization })
      .send(userBody)
      .then((res) => {
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(expectedResponse);
      });
  });
});
