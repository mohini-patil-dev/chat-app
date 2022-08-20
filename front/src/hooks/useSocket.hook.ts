import { useAppSelector } from 'store/helpers';

export function useSocket() {
    const events: any = {};

    const socket = useAppSelector((state) => state.socket.socket);

    socket?.on('connect', () => {
        for (const key in events) {
            setSocketEvent(key, events[key]);
        }
    });

    function setSocketEvent(
        eventName: string,
        callback: (...args: any[]) => void,
    ) {
        if (!socket?.connected) {
            events[eventName] = callback;
        } else {
            socket?.on(eventName, callback);
        }
    }

    function emitEvent(eventName: string, data: any) {
        socket?.emit(eventName, data);
    }

    return [setSocketEvent, emitEvent];
}
