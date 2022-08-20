import { IUser } from '../../db/mongodb/models/schemas/user.model';
import { Response, Request } from 'express';
import { Chat, User } from '../../db/mongodb/models';
import { CustomResponse } from '../../helpers/response.helper';
import {
    acceptFriendRequestSchema,
    getProfileSchema,
    sendFriendRequestSchema,
} from './user.validator';
import { JoiConfig } from '../../configs/joi.config';
import mongoose from 'mongoose';

async function getProfileByUserName(req: Request, res: Response) {
    try {
        const data: Pick<IUser, 'username'> =
            await getProfileSchema.validateAsync(req.query, JoiConfig);

        const username = data.username;
        const userProfile = await User.findOne({
            username: {
                $regex: username,
                $options: 'ig',
            },
        });
        if (!userProfile) {
            return new CustomResponse(res).reject({
                message: 'User not found',
                code: 404,
            });
        }
        new CustomResponse(res).success({
            message: 'User profile',
            data: userProfile,
        });
    } catch (error) {
        new CustomResponse(res).reject({
            error,
        });
    }
}

async function sendFriendRequest(req: Request, res: Response) {
    try {
        const user = req.user as IUser;
        const data: Pick<IUser, 'username'> =
            await sendFriendRequestSchema.validateAsync(req.body, JoiConfig);

        const username = data.username;

        const userToSendRequest = await User.findOne({ username }).select(
            '+friendRequests',
        );

        if (!userToSendRequest) {
            return new CustomResponse(res).reject({
                message: 'User not found',
                code: 404,
            });
        }

        if (userToSendRequest.friendRequests.includes(user._id)) {
            return new CustomResponse(res).reject({
                message: 'You have sent friend request to this user.',
                code: 400,
            });
        }

        userToSendRequest.friendRequests.push(user._id);
        await userToSendRequest.save();
        new CustomResponse(res).success({
            message: 'Friend request sent.',
        });
    } catch (error) {
        new CustomResponse(res).reject({
            error,
        });
    }
}

async function acceptFriendRequest(req: Request, res: Response) {
    try {
        const user = req.user as IUser;

        const data: { userId: string } =
            await acceptFriendRequestSchema.validateAsync(req.body, JoiConfig);

        const userId = data.userId;

        const userToAcceptRequest = await User.findOne({ _id: userId }).select(
            '+friends +friendRequests',
        );

        if (!userToAcceptRequest) {
            return res.status(404).json('User not found');
        }
        const isFriendRequestAlreadyExists = user.friendRequests.includes(
            new mongoose.Types.ObjectId(userId),
        );

        if (!isFriendRequestAlreadyExists) {
            return new CustomResponse(res).reject({
                message: 'You have not received request from this user',
                code: 400,
            });
        }

        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== userToAcceptRequest._id.toString(),
        );

        user.friends.push(userToAcceptRequest._id);
        userToAcceptRequest.friends.push(user._id);
        await user.save();
        await userToAcceptRequest.save();

        await Chat.create({
            participants: [user._id, userToAcceptRequest._id],
            messages: [],
            isGroup: false,
            groupName: '',
            admins: [user._id, userToAcceptRequest._id],
        });

        new CustomResponse(res).success({
            message: 'Friend request accepted',
            data: user,
        });
    } catch (error) {
        new CustomResponse(res).reject({
            error,
        });
    }
}

async function getLoggedInUser(req: Request, res: Response) {
    try {
        return new CustomResponse(res).success({ data: { user: req.user } });
    } catch (error) {
        return new CustomResponse(res).reject({
            error,
        });
    }
}

export default {
    sendFriendRequest,
    acceptFriendRequest,
    getProfileByUserName,
    getLoggedInUser,
};
