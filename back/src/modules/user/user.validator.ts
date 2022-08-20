import Joi from 'joi';
import mongoose from 'mongoose';

const commonSchema = {
    username: Joi.string().required(),
};

export const getProfileSchema = Joi.object().keys({ ...commonSchema });

export const sendFriendRequestSchema = Joi.object().keys({ ...commonSchema });

export const acceptFriendRequestSchema = Joi.object().keys({
    userId: Joi.string()
        .required()
        .custom((value, helper) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helper.error('"userId" must be a valid id');
            }
            return value;
        }),
});
