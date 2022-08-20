import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { moveArray } from 'helpers/state.helper';

const initialState = {
    chats: [],
    selectedChat: null,
    chatLoading: false,
    selectedChatMessages: [],
    selectedChatInfo: {},
};

export const chatSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setChats(state: any, action: PayloadAction<any[]>) {
            state.chats = action.payload;
        },
        setSelectedChat(state: any, action: PayloadAction<string>) {
            const selectedChat = state.chats.find(
                (chat: {
                    isGroup: any;
                    groupName: string;
                    sender: { _id: string };
                }) => {
                    if (chat.isGroup) {
                        return chat.groupName === action.payload;
                    } else {
                        return chat?.sender?._id === action.payload;
                    }
                },
            );

            if (selectedChat) {
                state.selectedChatInfo = selectedChat;
            }
            state.selectedChat = action.payload;
        },
        setChatLoading(state: any, action: PayloadAction<boolean>) {
            state.chatLoading = action.payload;
        },
        setSelectedChatMessages(state: any, action: PayloadAction<any>) {
            if (action.payload.isMerge) {
                if (action.payload.isNew) {
                    state.selectedChatMessages = [
                        ...state.selectedChatMessages,
                        ...action.payload.messages,
                    ];
                    const normalChats = JSON.parse(JSON.stringify(state.chats));
                    const messageReceivedIndex = normalChats.findIndex(
                        (message: any) => {
                            return (
                                message._id ===
                                    action.payload.messages[0].chatId &&
                                message.isGroup ===
                                    action.payload.messages[0].isGroup
                            );
                        },
                    );
                    normalChats[messageReceivedIndex].count += 1;
                    normalChats[messageReceivedIndex].messages =
                        action.payload.messages[0];
                    if (messageReceivedIndex !== -1) {
                        state.chats = [
                            ...moveArray({
                                from: messageReceivedIndex,
                                to: 0,
                                arr: normalChats,
                            }),
                        ];
                    }
                } else {
                    state.selectedChatMessages = [
                        ...action.payload.messages,
                        ...state.selectedChatMessages,
                    ];
                }
            } else {
                state.selectedChatMessages = action.payload.messages;
            }
        },
    },
});

export const chatActions = chatSlice.actions;
