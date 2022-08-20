import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../db/mongodb/models';
import { CustomResponse } from '../../helpers/response.helper';

export function checkAndDecodeJwtToken(token: string) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
        return null;
    }
}

async function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    let jwtToken = req.headers['authorization'] || req.body.token;
    if (!jwtToken) {
        return new CustomResponse(res).reject({
            message: 'User is not logged in.',
            code: 401,
        });
    }

    if (jwtToken.startsWith('Bearer ')) {
        jwtToken = jwtToken.slice(7, jwtToken.length);
    }

    const decodedValue = checkAndDecodeJwtToken(jwtToken);

    if (!decodedValue) {
        return new CustomResponse(res).reject({
            message: 'Invalid token.',
            code: 401,
        });
    }

    if (typeof decodedValue !== 'string' && decodedValue?._id!) {
        const user = await User.findOne({ _id: decodedValue._id }).select(
            '+friends +friendRequests',
        );

        if (!user) {
            return new CustomResponse(res).reject({
                message: 'User not found',
                code: 401,
            });
        }
        req.user = user;
    } else {
        return new CustomResponse(res).reject({
            message: 'Invalid token.',
            code: 401,
        });
    }
    return next();
}

export default {
    checkAndDecodeJwtToken,
    isAuthenticated,
};
