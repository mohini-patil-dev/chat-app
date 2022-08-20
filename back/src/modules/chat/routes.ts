import { Router } from 'express';
import authMiddlewares from '../auth/middlewares';
const router = Router();

import chatControllers from './controllers';

// unauthenticated routes

// authenticated routes
router.use(authMiddlewares.isAuthenticated);
router.route('/send').post(chatControllers.sendMessage);
router.route('/').get(chatControllers.getChats);
export default router;
