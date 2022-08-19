// import { faker } from '@faker-js/faker';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import UserWalletDetail from '../../src/domain/entities/UserWalletDetail';

import app from '../../src/app';
import { init, pairUser, TEST_EMAIL, TEST_PASSWORD } from '../helper';

describe('Wallet workflow test', () => {
  let authorization: string;
  let userWalletDetail: UserWalletDetail;
  let userWalletDetail2: UserWalletDetail;

  const email = TEST_EMAIL;
  const password = TEST_PASSWORD;

  beforeAll(async () => {
    userWalletDetail = await init();
    userWalletDetail2 = await pairUser();

    const response = await request(app)
      .post('/login')
      .send({ email, password });

    authorization = `Bearer ${response.body.data.accessToken}`;
  });

  test("POST /wallet/fund should successfully fund user wallet and return user's wallet detail.", async () => {
    const userBody = {
      walletId: userWalletDetail?.wallet?.id,
      amount: 5000 // kobo
    };
    const expectedResponse = {
      code: StatusCodes.OK,
      message: expect.any(String),
      data: {
        userId: expect.any(Number),
        balance: 5000 // kobo
      }
    };
    const res = await request(app)
      .post('/wallet/fund')
      .set({ authorization })
      .send(userBody);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toEqual(expectedResponse);
  });

  test("POST /wallet/transfer should successfully transfer fund from one user to another and return sender user's wallet detail.", () => {
    const reqBody = {
      walletId: userWalletDetail?.wallet?.id,
      recipientWalletId: userWalletDetail2?.wallet?.id,
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
      .post('/wallet/transfer')
      .set({ authorization })
      .send(reqBody)
      .then((res) => {
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(expectedResponse);
      });
  });

  test('POST /wallet/withdraw should successfully deduct fund from a user and return their wallet detail.', async () => {
    const fundBody = {
      walletId: userWalletDetail?.wallet?.id,
      amount: 10000 // kobo
    };
    const expectedResponse1 = {
      code: StatusCodes.OK,
      message: expect.any(String),
      data: {
        userId: expect.any(Number),
        balance: 10000 // kobo
      }
    };
    const res = await request(app)
      .post('/wallet/fund')
      .set({ authorization })
      .send(fundBody);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toEqual(expectedResponse1);

    const reqBody = {
      walletId: userWalletDetail?.wallet?.id,
      amount: 5000 // kobo
    };
    const expectedResponse2 = {
      code: StatusCodes.OK,
      message: expect.any(String),
      data: {
        userId: expect.any(Number),
        balance: 5000 // kobo
      }
    };

    const res2 = await request(app)
      .post('/wallet/withdraw')
      .set({ authorization })
      .send(reqBody);
    expect(res2.status).toBe(StatusCodes.OK);
    expect(res2.body).toEqual(expectedResponse2);
  });
});
