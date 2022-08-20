import { Socket } from 'socket.io';
import SocketInstance from '..';
import { User } from '../../db/mongodb/models';
import { redisClient } from '../../db/redis';
import authMiddleware from '../../modules/auth/middlewares';

export async function isAuthenticated(
    this: SocketInstance,
    socket: Socket,
    next: (error?: any) => void,
) {
    try {
        const jwtToken =
            socket.handshake.query.token ||
            socket.handshake.headers.token ||
            socket.handshake.auth.token;

        if (!jwtToken) {
            return next(new Error('User is not logged in.'));
        }

        if (
            typeof jwtToken !== 'string' ||
            typeof jwtToken === 'object' ||
            Array.isArray(jwtToken)
        ) {
            next(new Error('Invalid token.'));
        }

        const decodedValue = authMiddleware.checkAndDecodeJwtToken(
            jwtToken as string,
        );

        if (!decodedValue) {
            return next(new Error('Invalid token.'));
        }

        if (typeof decodedValue !== 'string' && decodedValue?._id!) {
            const user = await User.findOne({
                _id: decodedValue._id,
            }).select('+friends +friendRequests');

            if (!user || typeof user == null) {
                next(new Error('User not found'));
            }
            await redisClient.set(user?._id.toString()!, socket.id);
            socket.user = user!;
            this.socket = socket;
        } else {
            next(new Error('Invalid token.'));
        }
        return next();
    } catch (error) {
        return next(String(error) || 'Server error please try again later.!');
    }
}
