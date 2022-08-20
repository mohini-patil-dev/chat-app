import jwt from 'jsonwebtoken';
import { IUser } from '../../db/mongodb/models/schemas/user.model';

function decodeJWT(token: string) {
    return jwt.decode(token);
}

export function verifyJWT(token: string, user: IUser) {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const isValidJwt = decoded.id === user._id.toString();
    if (!isValidJwt) {
        throw new Error('Invalid JWT');
    } else {
        return decodeJWT(token);
    }
}
