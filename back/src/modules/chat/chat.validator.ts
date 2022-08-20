import Joi from 'joi';
import { JoiMessages } from '../../configs/joi.config';

export const sendMessageSchema = Joi.object().keys({
    to: Joi.string().required().messages(JoiMessages),
    message: Joi.string().required().messages(JoiMessages),
});
