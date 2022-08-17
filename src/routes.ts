import { Router } from 'express';

import validate from './middlewares/validate';
import * as homeController from './controllers/home';
import * as userController from './controllers/user';
import * as authController from './controllers/auth';
import authenticate from './middlewares/authenticate';
import { loginSchema } from './validators/loginRequest';
import { signUpSchema } from './validators/signUpRequest';
import { userPOSTSchema } from './validators/userRequest';
import validateRefreshToken from './middlewares/validateRefreshToken';

const router: Router = Router();

router.get('/', homeController.index);

router.post('/sign-up', validate(signUpSchema), authController.signUp);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validateRefreshToken, authController.refresh);
router.post('/logout', validateRefreshToken, authController.logout);

router.get('/users', authenticate, userController.index);
router.post(
  '/users',
  authenticate,
  validate(userPOSTSchema),
  userController.store
);

export default router;
