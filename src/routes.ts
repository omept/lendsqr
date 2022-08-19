import { Router } from 'express';

import validate from './middlewares/validate';
import * as homeController from './controllers/home';
import * as userController from './controllers/user';
import * as walletController from './controllers/wallet';
import * as authController from './controllers/auth';
import authenticate from './middlewares/authenticate';
import { loginSchema } from './validators/loginRequest';
import { signUpSchema } from './validators/signUpRequest';
import { userPOSTSchema } from './validators/userRequest';
import { walletTransferSchema } from './validators/walletTransferRequest';
import { walletFundSchema } from './validators/walletFundRequest';
import { walletWithdrawSchema } from './validators/walletWithdrawRequest';
import validateRefreshToken from './middlewares/validateRefreshToken';

const router: Router = Router();

router.get('/', homeController.index);

router.post('/sign-up', validate(signUpSchema), authController.signUp);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validateRefreshToken, authController.refresh);
router.post('/logout', validateRefreshToken, authController.logout);

router.post(
  '/users',
  authenticate,
  validate(userPOSTSchema),
  userController.store
);

router.post(
  '/wallet/fund',
  authenticate,
  validate(walletFundSchema),
  walletController.fund
);

router.post(
  '/wallet/transfer',
  authenticate,
  validate(walletTransferSchema),
  walletController.transfer
);

router.post(
  '/wallet/withdraw',
  authenticate,
  validate(walletWithdrawSchema),
  walletController.withdraw
);

export default router;
