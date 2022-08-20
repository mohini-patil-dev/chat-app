import * as socketIo from 'socket.io';
import { Server } from 'http';
import { isAuthenticated } from './middlewares';
import {
    deliverAllMessages,
    handleMessageSeen,
    handleNewIncomingMessage,
    handleSocketConnection,
} from './controllers';
import { emitter } from '../helpers/emitter.helper';
import { SocketEvents } from '../helpers/events.types';
import { IEmitData } from './interfaces/socket.interfaces';
import { Chat } from '../db/mongodb/models';
import { redisClient } from '../db/redis';

export class SocketUser {
    io: any;
    socket: socketIo.Socket;
    user: any;

    constructor({ io, socket }: { io: any; socket: socketIo.Socket }) {
        this.io = io;
        this.socket = socket;
        this.addEventEmitterListers();
        const userId = socket.user?._id?.toString?.();
        this.joinUserGroups();
        if (userId) {
            deliverAllMessages(userId);
        }

        socket.on(SocketEvents.MESSAGE_SEEN, handleMessageSeen.bind(this));
    }

    async joinUserGroups() {
        const userId = this.socket.user?.id.toString();
        const userGroups = (
            await Chat.find({
                isGroup: true,
                participants: {
                    $in: [userId],
                },
            }).select('_id')
        ).map((chat) => chat._id.toString());

        this.socket.join(userGroups);
    }

    private addEventEmitterListers = () => {
        emitter.on(
            SocketEvents.NEW_MESSAGE,
            handleNewIncomingMessage.bind(this),
        );
    };

    async emit({ socketId, groupId, event, payload = {} }: IEmitData) {
        if (!socketId && !groupId) return;

        const userId = this.socket.user?._id.toString();

        if (!userId) return;

        const _socketId = await redisClient.get(userId);

        if (!_socketId || this.socket.id !== _socketId) return;

        if (this.socket.user?._id.toString() === payload?.from?.id.toString()) {
            if (socketId) {
                this.io.to(socketId).emit(event, payload);
            }

            if (groupId) {
                this.socket.to(groupId).emit(event, payload);
            }
        }
    }
}

class SocketInstance {
    io;
    socket!: socketIo.Socket;
    constructor(httpServer: Server) {
        this.io = new socketIo.Server(httpServer, {
            cors: {
                origin: '*',
            },
        });
        this.addEventListeners();
    }

    private addEventListeners = () => {
        this.io.use(isAuthenticated.bind(this));
        this.io.on('connection', handleSocketConnection.bind(this));
    };
}

export default SocketInstance;
