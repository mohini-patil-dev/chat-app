import { Router } from 'express';
import authControllers from './controllers';
const router = Router();

// unauthenticated routes
router.route('/login').post(authControllers.login);
router.route('/register').post(authControllers.register);
router.route('/send-verify-email').post(authControllers.sendVerifyEmail);
router.route('/verify-email-token').get(authControllers.verifyEmail);

// authenticated routes

export default router;
