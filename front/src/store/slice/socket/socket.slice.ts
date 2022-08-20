import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

interface ISocketSlice {
    socket: any;
}

const initialState: ISocketSlice = {
    socket: null,
};

export const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setSocket(state: ISocketSlice, action: PayloadAction<Socket>) {
            state.socket = action.payload;
        },
    },
});

export const socketActions = socketSlice.actions;
