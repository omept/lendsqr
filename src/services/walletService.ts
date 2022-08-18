import logger from '../utils/logger';
import config from '../config/config';
import WalletDetail from '../domain/entities/WalletDetail';
import WalletFundPayload from '../domain/requests/WalletFundPayload';
import Wallet from '../models/Wallet';
import BadRequestError from '../exceptions/BadRequestError';
const { errors } = config;
/**
 * Insert user from given user payload
 *
 * @param {WalletFundPayload} params
 * @returns {Promise<WalletDetail>}
 */
export async function fund(
  params: WalletFundPayload,
  userId: number
): Promise<WalletDetail> {
  logger.log('info', 'performing funding for user', { params, userId });

  const wallet = await Wallet.query().findOne({ id: params.walletId });

  if (!wallet) {
    throw new BadRequestError(errors.invalidWallet);
  }

  // "data": {
  //   "name": "Ms. Roman Collins",
  //   "email": "Darren89@gmail.com",
  //   "userId": 21,
  //   "sessionId": 26
  // }
  //   const res = transform(users, (user: UserDetail) => ({
  //     name: user.name,
  //     email: user.email,
  //     updatedAt: new Date(user.updatedAt).toLocaleString(),
  //     createdAt: new Date(user.updatedAt).toLocaleString()
  //   }));
  const wd = {
    id: 4,
    useId: 5,
    userId,
    balance: 40000,
    currencyName: 'Naira',
    currencyCode: 'NGN',
    createdAt: 'string',
    updatedAt: 'string'
  } as WalletDetail;

  return wd;
}
