import { faker } from '@faker-js/faker';

import UserWalletDetail from '../../domain/entities/UserWalletDetail';
import * as userService from '../../services/userService';

/**
 * Returns user fake data.
 *
 * @returns {Promise<UserWalletDetail>}
 */
export function run(): Promise<UserWalletDetail> {
  return userService.insert({
    password: 'secret',
    name: faker.name.findName(),
    email: faker.internet.email()
  });
}
