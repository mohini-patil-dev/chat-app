export interface IIncomingMessage {
    to: string;
    message: string;
    isGroup: boolean;
    groupId: string;
    chatId: string;
}

export interface IImessageSeen {
    userId: string;
    groupId: string;
    chatId: string;
}
