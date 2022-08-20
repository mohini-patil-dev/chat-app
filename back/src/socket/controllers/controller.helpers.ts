import { Socket } from "socket.io"
import SocketInstance from ".."
import { User } from "../../db/mongodb/models"
import { redisClient } from "../../db/redis"

export async function handleUserDisconnect(this: SocketInstance, socket: Socket) {
    const userId = socket.user?._id?.toString?.();
    if (userId) {
        await redisClient.del(userId);
        await User.findOneAndUpdate(
            { _id: userId },
            {
                lastLogin: Date.now(),
            },
        );
    }
}