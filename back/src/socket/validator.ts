import Joi from 'joi';
import { JoiMessages } from '../configs/joi.config';

export const incomingMessageSchema = Joi.object().keys({
    to: Joi.string().optional().messages(JoiMessages),
    message: Joi.string().required().messages(JoiMessages),
    isGroup: Joi.boolean().required(),
    groupId: Joi.string().optional().messages(JoiMessages),
    chatId: Joi.string().required().messages(JoiMessages),
    from: Joi.object().required().messages(JoiMessages),
});
