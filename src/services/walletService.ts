import logger from '../utils/logger';
import config from '../config/config';
import WalletDetail from '../domain/entities/WalletDetail';
import WalletFundPayload from '../domain/requests/WalletFundPayload';
import Wallet from '../models/Wallet';
import BadRequestError from '../exceptions/BadRequestError';
import TransactionLogs from '../models/TransactionLogs';
import TransactionType from '../models/TransactionType';
import TransactionTypes from '../resources/enums/TransactionTypes';
const { errors } = config;
/**
 * Fund user wallet
 *
 * @param {WalletFundPayload} params
 * @returns {Promise<WalletDetail>}
 */
export async function fund(
  params: WalletFundPayload,
  userId: number
): Promise<WalletDetail> {
  logger.log('info', 'performing funding for user', { params, userId });

  const wallet = await Wallet.query()
    .findOne({ id: params.walletId })
    .withGraphFetched('currency');

  if (!wallet) {
    throw new BadRequestError(errors.invalidWallet);
  } else if (wallet.userId != userId) {
    throw new BadRequestError(errors.invalidUserWallet);
  }

  const transType = await TransactionType.query().findOne({
    name: TransactionTypes.TOP_UP
  });
  if (!transType) {
    throw new BadRequestError(errors.transactionTypeNotSeeded);
  }

  const amt = params.amount * 100;
  const newBal = amt + wallet.balance;

  logger.log('info', 'update user wallet balance', {
    current: newBal,
    prev: wallet.balance
  });
  await Wallet.query().findById(params.walletId).patch({
    balance: newBal
  });

  const transLog = {
    userId,
    transactionTypeId: transType.id,
    fromWalletId: wallet.id,
    toWalletId: wallet.id
  };
  logger.log('info', 'save transaction log to db:', transLog);
  await TransactionLogs.query().insert(transLog);

  return {
    userId,
    balance: newBal
  } as WalletDetail;
}
