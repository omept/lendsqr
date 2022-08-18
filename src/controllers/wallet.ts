import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import config from '../config/config';
import * as walletService from '../services/walletService';
import WalletFundPayload from '../domain/requests/WalletFundPayload';
import Wallet from '../models/Wallet';
import logger from 'src/utils/logger';
import BadRequestError from 'src/exceptions/BadRequestError';

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
