import { SocketUser } from '..';
import { JoiConfig } from '../../configs/joi.config';
import { Chat } from '../../db/mongodb/models';
import { redisClient } from '../../db/redis';
import { SocketEvents } from '../../helpers/events.types';
import { IIncomingMessage } from '../interfaces/controller.interfaces';
import { incomingMessageSchema } from '../validator';

export async function handleNewIncomingMessage(
    this: SocketUser,
    messagePayload: IIncomingMessage,
) {
    try {
        if (!this.socket) return;

        const data: IIncomingMessage =
            await incomingMessageSchema.validateAsync(
                messagePayload,
                JoiConfig,
            );

        if (!data.isGroup && data.to) {
            const userSocketIdToSend = await redisClient.get(data.to);
            if (userSocketIdToSend) {
                await Chat.findOneAndUpdate(
                    { 'messages._id': data.chatId },
                    {
                        '$push': {
                            'messages.$.delivered': data.to,
                        },
                    },
                );
                this.emit({
                    socketId: userSocketIdToSend,
                    event: SocketEvents.NEW_MESSAGE,
                    payload: data,
                });
            }
        } else {
            this.emit({
                groupId: data.chatId,
                event: SocketEvents.NEW_MESSAGE,
                payload: messagePayload,
            });
        }
    } catch (error: any) {
        console.log('ERROR WHILE HANDLING INCOMING MESSAGE', error);
        if (error.isJoi) return;

        // TODO: can we do something better?
        handleNewIncomingMessage.bind(this, messagePayload);
    }
}
