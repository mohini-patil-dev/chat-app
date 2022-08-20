import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isVerified: boolean;
    friendRequests: mongoose.Types.ObjectId[];
    friends: mongoose.Types.ObjectId[];
    lastLogin: Date;
    verifyEmailToken: string;
    getJWT: () => string;
    verifyPassword: (password: string) => Promise<boolean>;
    verifyJWT: (token: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter a valid name.'],
        },
        email: {
            type: String,
            required: [true, 'Please enter a valid email.'],
            unique: true,
            lowercase: true,
        },
        username: {
            type: String,
            required: [true, 'Please enter a valid username.'],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Please enter a valid password.'],
            minlength: [8, 'Password must be at least 8 characters.'],
            select: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        friendRequests: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
            default: [],
            select: false,
        },
        friends: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
            default: [],
            select: false,
        },
        lastLogin: {
            type: Date,
        },
        verifyEmailToken: {
            type: String,
            select: false,
        },
    },
    { timestamps: true },
);

userSchema.methods.getJWT = function () {
    const JWT_SECRET = process.env.JWT_SECRET!;
    return `${jwt.sign({ _id: this._id }, JWT_SECRET, {
        expiresIn: '1h',
    })}`;
};

userSchema.methods.verifyPassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

userSchema.pre<IUser>('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

export default mongoose.model<IUser>('User', userSchema);
