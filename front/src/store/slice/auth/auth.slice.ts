import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    username: string;
    password: string;
    isVerified: boolean;
    friendRequests?: string[];
    friends?: string[];
    lastLogin: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IAuthSlice {
    user: IUser | null;
    token: string;
}

const initialState: IAuthSlice = {
    user: null,
    token: '',
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state: IAuthSlice, action: PayloadAction<IUser>) {
            state.user = action.payload;
        },
        setToken(state: IAuthSlice, action: PayloadAction<string>) {
            state.token = action.payload;
        },
    },
});

export const userActions = authSlice.actions;
