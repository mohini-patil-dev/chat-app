import { Request, Response } from 'express';
import { JoiConfig } from '../../configs/joi.config';
import { User } from '../../db/mongodb/models';
import { IUser } from '../../db/mongodb/models/schemas/user.model';
import { CustomResponse } from '../../helpers/response.helper';
import { loginSChema, registerSchema } from './auth.validator';
import { Email } from '../../email';
import { checkAndDecodeJwtToken } from './middlewares';

async function register(req: Request, res: Response) {
    try {
        const data: Pick<IUser, 'email' | 'name' | 'username' | 'password'> =
            await registerSchema.validateAsync(req.body, JoiConfig);

        const isUserExists = await User.findOne({
            $or: [{ email: data.email }, { username: data.username }],
        });

        if (isUserExists) {
            let message;
            if (isUserExists.email === data.email) {
                message = 'Email ';
            }
            if (isUserExists.username === data.username) {
                message = 'Username ';
            }
            if (message) {
                message += 'is already taken.';
            }
            if (!message) {
                message = 'Username or Email is already taken';
            }
            return new CustomResponse(res).reject({
                message,
                code: 400,
            });
        }

        const user = new User(data);

        user.verifyEmailToken = user.getJWT();

        await user.save();

        await Email.sendVerifyEmail({
            to: user.email,
            verifyEmailToken: user.verifyEmailToken,
        });

        new CustomResponse(res).success({
            code: 201,
            message:
                'Registration Successful. \n Email verification link sent on the email.',
            data: user,
        });
    } catch (error: any) {
        new CustomResponse(res).reject({
            error,
        });
    }
}

async function login(req: Request, res: Response) {
    try {
        const data: Pick<IUser, 'email' | 'password'> =
            await loginSChema.validateAsync(req.body, JoiConfig);

        let user = await User.findOne({ email: data.email }).select(
            '+password +friendRequests +friends',
        );
        if (!user) {
            return new CustomResponse(res).reject({
                code: 419,
                message: 'Invalid credentials',
            });
        }

        if (!user.isVerified) {
            return new CustomResponse(res).reject({
                code: 419,
                message: 'Please verify your email first',
            });
        }

        const isValidPassword = await user.verifyPassword(data.password);
        if (!isValidPassword) {
            return new CustomResponse(res).reject({
                code: 419,
                message: 'Invalid credentials',
            });
        }

        const token = user.getJWT();

        new CustomResponse(res).success({
            code: 200,
            message: 'Login Success.',
            data: { user, token },
        });
    } catch (error: any) {
        new CustomResponse(res).reject({
            error,
        });
    }
}

export async function sendVerifyEmail(req: Request, res: Response) {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return new CustomResponse(res).reject({
                code: 404,
                message: 'User not found',
            });
        }

        if (user.isVerified) {
            return new CustomResponse(res).reject({
                code: 400,
                message: 'User already verified',
            });
        }

        user.verifyEmailToken = user.getJWT();

        await Email.sendVerifyEmail({
            to: user.email,
            verifyEmailToken: user.verifyEmailToken,
        });

        await user.save();

        new CustomResponse(res).success({
            message: 'Email sent',
        });
    } catch (error) {
        new CustomResponse(res).reject({
            error,
        });
    }
}

export async function verifyEmail(req: Request, res: Response) {
    try {
        const { token } = req.query;

        if (!token) {
            return new CustomResponse(res).reject({
                code: 400,
                message: 'Email Verification Token is required',
            });
        }

        const decodedValue = checkAndDecodeJwtToken(token as string) as {
            _id: string;
        };

        if (!decodedValue) {
            return new CustomResponse(res).reject({
                code: 400,
                message: 'Invalid Email Verification Token',
            });
        }

        const user = await User.findOne({ _id: decodedValue?._id }).select(
            '+verifyEmailToken',
        );

        if (!user) {
            return new CustomResponse(res).reject({
                code: 404,
                message: 'User not found',
            });
        }

        if (user.verifyEmailToken !== token) {
            return new CustomResponse(res).reject({
                code: 400,
                message: 'Invalid Email Verification Token',
            });
        }

        user.isVerified = true;
        user.verifyEmailToken = '';

        await user.save();

        new CustomResponse(res).success({
            message: 'Email verified',
        });
    } catch (error) {
        new CustomResponse(res).reject({
            error,
        });
    }
}

export default { register, login, sendVerifyEmail, verifyEmail };
