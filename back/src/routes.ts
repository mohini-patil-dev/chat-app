import { Request, Response, Router } from 'express';
import { CustomResponse } from './helpers/response.helper';

import authRoutes from './modules/auth/routes';
import chatRoutes from './modules/chat/routes';
import userRoutes from './modules/user/routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/messages', chatRoutes);
router.use('/user', userRoutes);

// 404 route
router.all('*', (req: Request, res: Response) => {
    return new CustomResponse(res).reject({
        code: 404,
        message: 'Route Not found',
    });
});
export default router;
