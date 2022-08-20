import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { addUsers } from './users';
import { addChat } from './chats';
import { MONGO_URL } from '../mongodb';
async function addData() {
    await mongoose.connect(MONGO_URL);
    await addUsers();
    await addChat();
    console.log('data seeding completed');
    process.exit(0);
}

addData();
