import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import config from '../config/config';
import * as walletService from '../services/walletService';
import WalletFundPayload from '../domain/requests/WalletFundPayload';
import WalletTransferPayload from '../domain/requests/WalletTransferPayload';

const { messages } = config;

/**
 * Handle /wallet/fund POST request.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function fund(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = res.locals.loggedInPayload.userId;
    const userFundPayload = req.body as WalletFundPayload;

    const response = await walletService.fund(userFundPayload, userId);

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: response,
      message: messages.users.insert
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Handle /wallet/transfer POST request.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function transfer(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = res.locals.loggedInPayload.userId;
    const trnfrPayload = req.body as WalletTransferPayload;

    const response = await walletService.transfer(trnfrPayload, userId);

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: response,
      message: messages.users.insert
    });
  } catch (err) {
    next(err);
  }
}
