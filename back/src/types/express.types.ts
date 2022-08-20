import { Request } from 'express';
import { IUser } from '../db/mongodb/models/schemas/user.model';

export interface ICustomRequest extends Request {
    user: IUser;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: IUser;
    }
}
