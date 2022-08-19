import logger from '../utils/logger';
import config from '../config/config';
import WalletDetail from '../domain/entities/WalletDetail';
import WalletFundPayload from '../domain/requests/WalletFundPayload';
import Wallet from '../models/Wallet';
import BadRequestError from '../exceptions/BadRequestError';
import TransactionLogs from '../models/TransactionLogs';
import TransactionType from '../models/TransactionType';
import TransactionTypes from '../resources/enums/TransactionTypes';
import WalletTransferPayload from '../domain/requests/WalletTransferPayload';
import WalletWithdrawPayload from '../domain/requests/WalletWithdrawPayload';
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

  const newBal = params.amount + wallet.balance;

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
    amount: params.amount,
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

/**
 * Transfer funds to a user wallet
 *
 * @param {WalletFundPayload} params
 * @returns {Promise<WalletDetail>}
 */
export async function transfer(
  params: WalletTransferPayload,
  userId: number
): Promise<WalletDetail> {
  logger.log('info', 'performing inter-wallet transfer', { params, userId });

  const senderWallet = await Wallet.query()
    .findOne({ id: params.walletId })
    .withGraphFetched('currency');

  if (!senderWallet) {
    throw new BadRequestError(errors.invalidWallet);
  } else if (senderWallet.userId != userId) {
    throw new BadRequestError(errors.invalidUserWallet);
  }
  logger.log('info', 'validated sender wallet details');

  const recipientWallet = await Wallet.query()
    .findOne({ id: params.recipientWalletId })
    .withGraphFetched('currency');

  if (!recipientWallet) {
    throw new BadRequestError(errors.invalidWallet);
  }
  logger.log('info', 'validated recipient wallet details ');

  if (recipientWallet.currencyId != senderWallet.currencyId) {
    throw new BadRequestError(errors.walletsCurrencyMismatch);
  }
  logger.log('info', 'validated that wallet currencies match');

  const transTypes = await TransactionType.query();
  const topUpType = transTypes.find((t) => t.name === TransactionTypes.TOP_UP);
  const withdrawType = transTypes.find(
    (t) => t.name === TransactionTypes.WITHDRAW
  );
  if (!topUpType || !withdrawType) {
    throw new BadRequestError(errors.transactionTypeNotSeeded);
  }

  const newSenderBal = senderWallet.balance - params.amount;
  if (newSenderBal < 0) {
    throw new BadRequestError(errors.insufficientBalance);
  }
  logger.log('info', 'updating sender wallet balance', {
    current: newSenderBal,
    prev: senderWallet.balance
  });
  await Wallet.query().findById(params.walletId).patch({
    balance: newSenderBal
  });

  const newRecipientBal = recipientWallet.balance + params.amount;
  logger.log('info', 'updating recipient wallet balance', {
    current: newRecipientBal,
    prev: recipientWallet.balance
  });
  await Wallet.query().findById(params.recipientWalletId).patch({
    balance: newRecipientBal
  });

  const transLogs = [
    {
      userId: senderWallet.userId,
      transactionTypeId: withdrawType.id,
      amount: params.amount,
      fromWalletId: senderWallet.id,
      toWalletId: recipientWallet.id,
      createdAt: new Date().toJSON().slice(0, 19).replace('T', ' '),
      updatedAt: new Date().toJSON().slice(0, 19).replace('T', ' ')
    },
    {
      userId: recipientWallet.userId,
      transactionTypeId: topUpType.id,
      amount: params.amount,
      fromWalletId: senderWallet.id,
      toWalletId: recipientWallet.id,
      createdAt: new Date().toJSON().slice(0, 19).replace('T', ' '),
      updatedAt: new Date().toJSON().slice(0, 19).replace('T', ' ')
    }
  ];
  logger.log('info', 'saving transaction logs to db:', transLogs);
  await TransactionLogs.query().insertGraph(transLogs);

  return {
    userId: senderWallet.userId,
    balance: newSenderBal
  } as WalletDetail;
}

/**
 * Withdraw funds to a user wallet
 *
 * @param {WalletWithdrawPayload} params
 * @returns {Promise<WalletDetail>}
 */
export async function withdraw(
  params: WalletWithdrawPayload,
  userId: number
): Promise<WalletDetail> {
  logger.log('info', 'performing wallet withdrawal', { params, userId });

  const wallet = await Wallet.query().findOne({ id: params.walletId });

  if (!wallet) {
    throw new BadRequestError(errors.invalidWallet);
  } else if (wallet.userId != userId) {
    throw new BadRequestError(errors.invalidUserWallet);
  }
  logger.log('info', 'validated wallet details');

  const transType = await TransactionType.query().findOne({
    name: TransactionTypes.WITHDRAW
  });
  if (!transType) {
    throw new BadRequestError(errors.transactionTypeNotSeeded);
  }

  const newBal = wallet.balance - params.amount;
  if (newBal < 0) {
    throw new BadRequestError(errors.insufficientBalance);
  }
  logger.log('info', 'updating wallet balance', {
    current: newBal,
    prev: wallet.balance
  });
  await Wallet.query().findById(params.walletId).patch({
    balance: newBal
  });

  const transLog = {
    userId: wallet.userId,
    transactionTypeId: transType.id,
    amount: params.amount,
    fromWalletId: wallet.id,
    toWalletId: wallet.id,
    createdAt: new Date().toJSON().slice(0, 19).replace('T', ' '),
    updatedAt: new Date().toJSON().slice(0, 19).replace('T', ' ')
  };
  logger.log('info', 'saving transaction logs to db:', transLog);
  await TransactionLogs.query().insert(transLog);

  return {
    userId: wallet.userId,
    balance: newBal
  } as WalletDetail;
}
