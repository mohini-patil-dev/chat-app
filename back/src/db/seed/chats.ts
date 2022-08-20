import { User, Chat } from '../mongodb/models';
import { faker } from '@faker-js/faker';
async function getUsers() {
    const users = await User.find({});
    return users;
}

function getRandomUsers(users: any[]) {
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex];
}

function getRandomUserIds(users: any[], number: number) {
    const userIds = [];
    for (let i = 0; i < number; i += 1) {
        const randomUser = getRandomUsers(users);
        userIds.push(randomUser._id?.toString?.() ?? randomUser);
    }
    return userIds;
}

async function addPersonalChats({
    start,
    end,
    users,
}: {
    start: number;
    end: number;
    users: any[];
}) {
    for (let i = start; i < end; i += 1) {
        const userIds = getRandomUserIds(users, 2);
        await Chat.create({
            participants: userIds,
            messages: [],
            isGroup: false,
            admins: userIds,
        });
        users = users.filter(
            (user: any) => !userIds.includes(user._id?.toString?.() ?? user),
        );
    }
}

async function addGroupChats({
    start,
    end,
    users,
}: {
    start: number;
    end: number;
    users: any[];
}) {
    for (let i = start; i < end; i += 1) {
        const participants = getRandomUserIds(users, 10);
        await Chat.create({
            participants: participants,
            messages: [],
            isGroup: true,
            admins: getRandomUserIds(participants, 2),
            groupName: faker.company.companyName(),
        });
    }
}

export async function addChat() {
    const users = await getUsers();

    const start = 0;
    const end = 10;

    // personal chats
    await addPersonalChats({ start, end, users: [...users] });

    // group chats
    await addGroupChats({ start, end, users: [...users] });
}
