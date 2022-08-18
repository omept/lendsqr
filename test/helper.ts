import { faker } from '@faker-js/faker';

import knex from '../src/config/db';
import UserWalletDetail from '../src/domain/entities/UserWalletDetail';
import Table from '../src/resources/enums/Table';

import * as userService from '../src/services/userService';

const tables = [
  Table.TRANSACTION_LOGS,
  Table.WALLETS,
  Table.USER_SESSIONS,
  Table.USERS
];

export const TEST_EMAIL = faker.internet.email();
export const TEST_PASSWORD = faker.internet.password();
export const TEST_NAME = `${faker.name.firstName('male')} ${faker.name.lastName(
  'female'
)}`;

let userWalletData: UserWalletDetail;

/**
 * Create user.
 *
 * @returns Promise
 */
async function createUser(): Promise<UserWalletDetail> {
  return await userService.insert({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    name: faker.name.findName()
  });
}

/**
 * Delete all table's data.
 */
export async function init(): Promise<UserWalletDetail> {
  if (userWalletData) {
    return userWalletData;
  }

  for (const table of tables) {
    await knex(table).del();
  }

  userWalletData = await createUser();

  return userWalletData;
}

/**
 * Get a random element from given array.
 *
 * @param {any[]} list
 * @returns {any}
 */
export function getRandomElement(list: any[]): any {
  return faker.helpers.arrayElement<any>(list);
}
