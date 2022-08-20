import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from 'store/slice/auth/auth.slice';
import { chatSlice } from './slice/chat/chat.slice';
import { socketSlice } from './slice/socket/socket.slice';

export const store = configureStore({
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    reducer: {
        auth: authSlice.reducer,
        chat: chatSlice.reducer,
        socket: socketSlice.reducer,
    },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
