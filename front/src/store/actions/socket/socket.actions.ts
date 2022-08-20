import { Dispatch } from '@reduxjs/toolkit';
import { socketActions } from 'store/slice/socket/socket.slice';

export function setSocket(socket: any) {
    return (dispatch: Dispatch) => {
        dispatch(socketActions.setSocket(socket));
    };
}
