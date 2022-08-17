import User from '../models/User';
import Wallet from '../models/Wallet';
import Currency from '../models/Currency';
import * as jwt from '../utils/jwt';
import logger from '../utils/logger';
import config from '../config/config';
import * as bcrypt from '../utils/bcrypt';
import UserSession from '../models/UserSession';
import JWTPayload from '../domain/misc/JWTPayload';
import ForbiddenError from '../exceptions/ForbiddenError';
import LoginPayload from '../domain/requests/LoginPayload';
import SignUpPayload from '../domain/requests/SignUpPayload';
import * as sessionService from '../services/sessionService';
import TokenResponse from '../domain/responses/TokenResponse';
import UnauthorizedError from '../exceptions/UnauthorizedError';
import BadRequestError from '../exceptions/BadRequestError';

const { errors } = config;

/**
 * Sign-up a user for valid session login.
 *
 * @param {SignUpPayload} signUpPayload
 * @returns {TokenResponse}
 */
export async function signUp(params: SignUpPayload): Promise<TokenResponse> {
  logger.log('info', 'SignUp: Validate email uniquesness-', params.email);
  const userWithEmail = await (
    await User.query().where('email', '=', params.email)
  ).length;
  logger.log('info', `SignUp: Validation db res: ${userWithEmail}`);
  if (userWithEmail > 0) {
    throw new BadRequestError(errors.accountExistWithEmail);
  }

  logger.log('info', 'Inserting user into database:', params);

  const password = await bcrypt.hash(params.password);
  const user = await User.query().insert({ ...params, password });
  const { email, name, id: userId } = user;

  logger.log('info', "Inserting user's wallet into database:", params);
  const currency = await Currency.query().first();
  if (currency == undefined) {
    throw new BadRequestError(errors.currencyNotSeeded);
  }

  const defaultWalletBal = 0;
  const walletParams = {
    userId,
    currencyId: currency.id,
    balance: defaultWalletBal
  };
  await Wallet.query().insert({ ...walletParams });

  logger.log('info', 'SignUp : session login -', user);

  const loggedInUser = { name, email, userId };
  const refreshToken = jwt.generateRefreshToken(loggedInUser);
  const userSessionPayload = { userId, token: refreshToken };
  const session = await sessionService.create(userSessionPayload);
  const accessToken = jwt.generateAccessToken({
    ...loggedInUser,
    sessionId: session.id
  });
  return { refreshToken, accessToken };
}

/**
 * Create user session for valid user login.
 *
 * @param {LoginPayload} loginPayload
 * @returns {TokenResponse}
 */
export async function login(
  loginPayload: LoginPayload
): Promise<TokenResponse> {
  const { email, password } = loginPayload;

  logger.log('info', 'Checking email: %s', email);
  const user = await User.query().findOne({ email });

  if (user) {
    logger.log('debug', 'Login: Fetched user by email -', user);
    logger.log('debug', 'Login: Comparing password');

    const isSame = await bcrypt.compare(password, user.password);

    logger.log('debug', 'Login: Password match status - %s', isSame);

    if (isSame) {
      const { name, id: userId } = user;
      const loggedInUser = { name, email, userId };
      const refreshToken = jwt.generateRefreshToken(loggedInUser);
      const userSessionPayload = { userId, token: refreshToken };
      const session = await sessionService.create(userSessionPayload);
      const accessToken = jwt.generateAccessToken({
        ...loggedInUser,
        sessionId: session.id
      });

      return { refreshToken, accessToken };
    }
  }

  throw new UnauthorizedError(errors.invalidCredentials);
}

/**
 * Refresh new access token.
 *
 * @param {string} token
 * @param {jwtPayload} jwtPayload
 * @returns {TokenResponse}
 */
export async function refresh(
  token: string,
  jwtPayload: JWTPayload
): Promise<TokenResponse> {
  logger.log('info', 'User Session: Fetching session of token - %s', token);

  const session = await UserSession.query().findOne({
    token,
    isActive: true
  });
  if (!session) {
    throw new ForbiddenError(errors.sessionNotMaintained);
  }

  logger.log('debug', 'User Session: Fetched session -', session);
  logger.log('info', 'JWT: Generating new access token');

  const accessToken = jwt.generateAccessToken({
    ...jwtPayload,
    sessionId: session.id
  });

  return {
    accessToken
  };
}

/**
 * Remove user session.
 *
 * @param {string} token
 */
export async function logout(token: string): Promise<void> {
  logger.log('info', 'Logout: Logging out user session - %s', token);

  const session = await sessionService.remove(token);

  if (!session) {
    throw new ForbiddenError(errors.sessionNotMaintained);
  }
}
