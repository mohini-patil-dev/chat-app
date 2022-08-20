import { SocketUser } from '..';
import { Chat } from '../../db/mongodb/models';
import { redisClient } from '../../db/redis';
import { SocketEvents } from '../../helpers/events.types';
import { IImessageSeen } from '../interfaces/controller.interfaces';

export async function handleMessageSeen(
    this: SocketUser,
    messagePayload: IImessageSeen,
) {
    // TODO: Write Joi schema for this -> @Bhoomit
    // TODO: Refactor this whole function
    if (!this.socket) return;

    if (messagePayload.groupId) {
        await Chat.findOneAndUpdate(
            { 'messages._id': messagePayload.chatId },
            {
                $push: {
                    'messages.$.seen': messagePayload.userId,
                },
            },
        );
        this.emit({
            groupId: messagePayload.groupId,
            event: SocketEvents.MESSAGE_SEEN,
            payload: {
                chatId: messagePayload.chatId,
                userId: messagePayload.userId,
            },
        });
    } else {
        const updatedChat = await Chat.findOneAndUpdate(
            { 'messages._id': messagePayload.chatId },
            {
                '$push': {
                    'messages.$.seen': messagePayload.userId,
                },
            },
            { new: true },
        );
        if (updatedChat) {
            const otherParticipant = updatedChat.participants.find(
                (participant) =>
                    participant.toString() !== messagePayload.userId,
            );
            if (otherParticipant) {
                const userSocketIdToSend = await redisClient.get(
                    otherParticipant.toString(),
                );
                if (userSocketIdToSend) {
                    this.emit({
                        socketId: userSocketIdToSend,
                        payload: {
                            chatId: messagePayload.chatId,
                            userId: messagePayload.userId,
                        },
                        event: SocketEvents.MESSAGE_SEEN,
                    });
                }
            }
        }
    }
}
