import { Dispatch } from '@reduxjs/toolkit';
import { IUser, userActions } from 'store/slice/auth/auth.slice';

export function setUser(data: IUser) {
    return (dispatch: Dispatch) => {
        dispatch(userActions.setUser(data));
    };
}
