import mongoose from 'mongoose';

export interface IMessage {
    _id?: mongoose.Types.ObjectId;
    from: mongoose.Types.ObjectId;
    message: string;
    seen: mongoose.Types.ObjectId[];
    delivered: mongoose.Types.ObjectId[];
    date?: Date;
    toJSON?: () => any;
}

export interface IChat extends mongoose.Document {
    participants: mongoose.Types.ObjectId[];
    seen: mongoose.Types.ObjectId[];
    user: mongoose.Types.ObjectId[];
    admins: mongoose.Types.ObjectId[];
    messages: IMessage[];
    isGroup?: false;
    groupName?: string;
}

const chatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        messages: [
            {
                from: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                message: String,
                date: {
                    type: Date,
                    default: Date.now,
                },
                delivered: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                    },
                ],
                seen: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                    },
                ],
            },
        ],
        isGroup: {
            type: Boolean,
            default: false,
        },
        groupName: {
            type: String,
        },
        admins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true },
);

export default mongoose.model<IChat>('Chat', chatSchema);
