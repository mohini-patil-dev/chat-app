import { Request, Response } from 'express';
import mongoose, { PipelineStage } from 'mongoose';
import { JoiConfig } from '../../configs/joi.config';
import { Chat } from '../../db/mongodb/models';
import { IMessage } from '../../db/mongodb/models/schemas/chat.model';
import { emitter } from '../../helpers/emitter.helper';
import { SocketEvents } from '../../helpers/events.types';
import { CustomResponse } from '../../helpers/response.helper';
import { sendMessageSchema } from './chat.validator';

export interface IFindChatQuery {
    participants: {};
    groupName: string;
    isGroup: boolean;
}

interface IMessageBody {
    to: string;
    message: string;
}

async function sendMessage(req: Request, res: Response) {
    try {
        const user = req.user;

        const userObjectId = new mongoose.Types.ObjectId(user?._id);

        const data: IMessageBody = await sendMessageSchema.validateAsync(
            req.body,
            JoiConfig,
        );

        const findQuery = {} as IFindChatQuery;

        const isValidChatMongooseId = mongoose.Types.ObjectId.isValid(data.to);

        if (isValidChatMongooseId) {
            findQuery.participants = {
                $in: [userObjectId, new mongoose.Types.ObjectId(data.to)],
            };
            findQuery.isGroup = false;
        } else {
            findQuery.groupName = data.to;
            findQuery.isGroup = true;
        }

        const chat = await Chat.findOne(findQuery);

        if (!chat) {
            return new CustomResponse(res).reject({
                code: 404,
                message: 'Chat not found',
            });
        }

        if (!isValidChatMongooseId) {
            if (!chat.participants.includes(user?.id)) {
                return new CustomResponse(res).reject({
                    code: 403,
                    message: 'You are not a participant of this chat',
                });
            }
        } else {
            if (
                !chat.participants.includes(userObjectId) ||
                !chat.participants.includes(
                    new mongoose.Types.ObjectId(user?._id),
                )
            ) {
                return new CustomResponse(res).reject({
                    code: 403,
                    message: 'You are not a participant of this chat',
                });
            }
        }

        if (!chat.messages) {
            chat.messages = [];
        }

        const messagePayload: Omit<IMessage, '_id'> = {
            from: userObjectId,
            message: data.message,
            delivered: [user?._id!],
            seen: [user?._id!],
        };

        chat.messages.push(messagePayload);

        const chatId = chat._id.toString();
        const messageId =
            chat.messages[chat.messages.length - 1]?._id?.toString();

        emitter.emit(SocketEvents.NEW_MESSAGE, {
            to: data.to?.toString(),
            message: data.message,
            isGroup: isValidChatMongooseId ? false : true,
            groupName: chat._id.toString(),
            chatId: chatId?.toString(),
            messageId,
            from: {
                id: user?._id?.toString(),
                username: user?.username,
            },
        });

        await chat.save();

        new CustomResponse(res).success({
            message: 'Message sent',
            data: {
                chatId,
                isGroup: chat.isGroup ? true : false,
                ...chat.messages.at(-1)?.toJSON?.(),
            },
        });
    } catch (error: any) {
        new CustomResponse(res).reject({
            error,
        });
    }
}

// TODO test if chats come in order bt last message sent
// TODO find a better way to fetch sender
// TODO might be a security risk I can send any id from frontend and retrieve chats so also add a query it only returns chat if I am participant of that chat
// TODO query is unstable make it stable // working now need to test
async function getChats(req: Request, res: Response) {
    try {
        const userId = req.user?._id.toString();

        let {
            chatId,
            limit = 30,
            skip = 0,
        } = req.query as unknown as {
            chatId: string;
            limit: number;
            skip: number;
        };

        limit = Number(limit);
        skip = Number(skip);

        const findQuery: any = {};

        const participants = [];
        participants.push(new mongoose.Types.ObjectId(userId));

        if (chatId) {
            const isValidChatId = mongoose.Types.ObjectId.isValid(chatId);

            if (isValidChatId) {
                participants.push(new mongoose.Types.ObjectId(chatId));
                findQuery.participants = {
                    $in: participants,
                };
                findQuery.isGroup = false;
            }
            if (!isValidChatId) {
                findQuery.groupName = chatId;
                findQuery.isGroup = true;
            }
        }

        if (!findQuery.participants) {
            findQuery.participants = {
                $in: participants,
            };
        }

        const aggregateQuery: PipelineStage[] = [
            {
                $match: findQuery,
            },
            {
                $set: {
                    messages: {
                        $map: {
                            input: '$messages',
                            in: {
                                $mergeObjects: [
                                    '$$this',
                                    {
                                        from: {
                                            $arrayElemAt: [
                                                '$participants',
                                                {
                                                    $indexOfArray: [
                                                        '$participants._id',
                                                        '$$this.from',
                                                    ],
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'participants',
                    foreignField: '_id',
                    as: 'sender',
                    pipeline: [
                        {
                            $match: {
                                _id: {
                                    $ne: new mongoose.Types.ObjectId(userId),
                                },
                            },
                        },
                        {
                            $limit: 1,
                        },
                        {
                            $project: {
                                username: 1,
                                name: 1,
                                email: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: '$sender',
            },
            {
                $sort: {
                    'messages.date': 1,
                },
            },
            {
                $addFields: {
                    count: {
                        $size: '$messages',
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    groupName: 1,
                    isGroup: 1,
                    messages: chatId
                        ? {
                              $slice: [
                                  '$messages',
                                  skip === 0 ? -limit : -skip,
                                  limit,
                              ],
                          }
                        : {
                              $arrayElemAt: ['$messages', -1],
                          },
                    sender: {
                        _id: '$sender._id',
                        username: '$sender.username',
                        name: '$sender.name',
                        email: '$sender.email',
                    },
                    count: 1,
                },
            },
            {
                $sort: {
                    'messages.date': -1,
                },
            },
        ];

        let messages = await Chat.aggregate(aggregateQuery);

        messages = messages.map((message: any) => {
            if (message && message.messages && message.messages.length === 1) {
                const _messages = message.messages[0];
                if (!Object.keys(_messages).length) {
                    message.messages = [];
                }
            }
            return message;
        });

        new CustomResponse(res).success({
            data: chatId ? messages[0] : messages,
        });
    } catch (error) {
        console.error(error);
        new CustomResponse(res).reject({
            error,
        });
    }
}

// async function

export default {
    sendMessage,
    getChats,
};
