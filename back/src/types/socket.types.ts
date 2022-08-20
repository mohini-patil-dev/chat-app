import { IUser } from '../db/mongodb/models/schemas/user.model';
declare module 'socket.io' {
    interface Socket {
        user?: IUser;
    }
}
