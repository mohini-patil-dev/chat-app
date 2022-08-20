import { Dispatch } from '@reduxjs/toolkit';
import { chatActions } from 'store/slice/chat/chat.slice';

export function setChats(data: any[]) {
    return (dispatch: Dispatch) => {
        dispatch(chatActions.setChats(data));
    };
}

export function setSelectedChat(chatId: string) {
    return (dispatch: Dispatch) => {
        dispatch(chatActions.setSelectedChat(chatId));
    };
}

export function setChatLoading(isLoading: boolean) {
    return (dispatch: Dispatch) => {
        dispatch(chatActions.setChatLoading(isLoading));
    };
}

export function setSelectedChatMessages({
    messages,
    isMerge = true,
    isNew = false,
}: {
    messages: any[];
    isMerge?: boolean;
    isNew?: boolean;
}) {
    return (dispatch: Dispatch) => {
        dispatch(
            chatActions.setSelectedChatMessages({ messages, isMerge, isNew }),
        );
    };
}
