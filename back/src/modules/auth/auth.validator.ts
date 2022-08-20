import Joi from 'joi';
import { JoiMessages } from '../../configs/joi.config';

const commonSchema = {
    email: Joi.string().email().lowercase().required().messages(JoiMessages),
    password: Joi.string().required().messages(JoiMessages),
};

export const loginSChema = Joi.object({ ...commonSchema });

export const registerSchema = Joi.object().keys({
    ...commonSchema,
    name: Joi.string().required().messages(JoiMessages),
    username: Joi.string().required().lowercase().messages(JoiMessages),
});
