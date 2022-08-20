import { io, Socket } from 'socket.io-client';

class SocketHelper {
    private socket!: Socket;
    private events: { [key: string]: (data: any) => void } = {};
    private emitEvents: { [key: string]: any } = {};

    disconnect() {
        this?.socket?.disconnect();
    }

    init(token: string) {
        if (!this.socket || !this.socket.connected) {
            const socketOptions = {
                auth: {
                    token,
                },
            };
            this.socket = io(
                process.env.REACT_APP_API_BASE_URL!,
                socketOptions,
            );
        }

        this?.socket?.on('connect', () => {
            console.log('connected');
            this?.socket?.removeAllListeners();
            for (const event in this.events) {
                this?.socket?.on(event, this.events[event]);
                delete this.events[event];
            }

            for (const event in this.emitEvents) {
                this?.socket?.emit(event, this.emitEvents[event]);
                delete this.emitEvents[event];
            }
        });

        this?.socket?.on('error', (error) => {
            console.log('socket error is ', error);
        });

        this?.socket?.on('disconnect', () => {
            this?.socket?.removeAllListeners();
        });
    }

    emitEvent(event: string, data: any) {
        if (this.socket) {
            this.socket.emit(event, data);
        } else {
            this.emitEvents[event] = data;
        }
    }

    listenEvent(event: string, callback: (data: any) => void) {
        if (!this?.socket?.connected) {
            this.events[event] = callback;
        } else {
            this.socket.on(event, callback);
        }
    }
}

export const socket = new SocketHelper();
// Object.freeze(socket);
