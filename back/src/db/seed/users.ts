import { faker } from '@faker-js/faker';
import { User } from '../../db/mongodb/models';
const DEFAULT_PASSWORD = 'Abc@1234';

function generateUser() {
    return {
        name: faker.name.firstName() + ' ' + faker.name.lastName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: DEFAULT_PASSWORD,
        isVerified: true,
        friendRequests: [],
        friends: [],
    };
}

export async function addUsers() {
    const start = 0;
    const end = 20;
    for (let i = start; i < end; i += 1) {
        await User.create(generateUser());
    }
}
