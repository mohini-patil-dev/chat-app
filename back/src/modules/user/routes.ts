import { Router } from 'express';
import userControllers from './controllers';
import authMiddlewares from '../auth/middlewares';
const router = Router();

// unauthenticated routes
router.route('/profile').get(userControllers.getProfileByUserName);

// authenticated routes
router.use(authMiddlewares.isAuthenticated);
router.route('/friend/request').post(userControllers.sendFriendRequest);
router.route('/friend/accept').post(userControllers.acceptFriendRequest);
router.route('/').get(userControllers.getLoggedInUser);
export default router;
