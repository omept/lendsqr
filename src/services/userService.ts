import User from '../models/User';
import logger from '../utils/logger';
import * as bcrypt from '../utils/bcrypt';
import UserPayload from '../domain/requests/UserPayload';
import Currency from '../models/Currency';
import BadRequestError from '../exceptions/BadRequestError';
import config from '../config/config';
import Wallet from '../models/Wallet';
import UserWalletDetail from '../domain/entities/UserWalletDetail';

const { errors } = config;
/**
 * Insert user from given user payload
 *
 * @param {UserPayload} params
 * @returns {Promise<UserWalletDetail>}
 */
export async function insert(params: UserPayload): Promise<UserWalletDetail> {
  logger.log('info', 'Inserting user into database:', params);

  const password = await bcrypt.hash(params.password);
  const user = await User.query().insert({ ...params, password });

  logger.log('debug', 'Inserted user successfully:', user);

  logger.log('debug', 'Inserting user wallet');
  const currency = await Currency.query().first();
  if (currency == undefined) {
    throw new BadRequestError(errors.currencyNotSeeded);
  }

  const defaultWalletBal = 0;
  const walletParams = {
    userId: user.id,
    currencyId: currency.id,
    balance: defaultWalletBal
  };
  const wallet = await Wallet.query().insert({ ...walletParams });
  logger.log('debug', 'Inserted user wallet:', walletParams);

  return { user, wallet, currency };
}
