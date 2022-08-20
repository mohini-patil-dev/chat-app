import mongoose, { mongo, Mongoose } from 'mongoose';

export const MONGO_URL =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/chat';

mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err.message);
        process.exit(1);
    });
