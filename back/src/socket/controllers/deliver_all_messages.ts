import { Chat } from "../../db/mongodb/models"

export async function deliverAllMessages(userId: string) {
    try {
        const findQuery = {
            participants: {
                $in: [userId],
            },
            'messages.date': {
                '$lt': Date.now(),
            },
            'messages.delivered': {
                $nin: [userId],
            },
        };
        const updateQuery = {
            '$push': {
                'messages.$.delivered': userId,
            },
        };
        await Chat.updateMany(findQuery, updateQuery);
    } catch (error) {
        console.log('ERROR WHILE DELIVERING ALL MESSAGES', error);
    }
}