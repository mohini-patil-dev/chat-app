import { Socket } from 'socket.io';
import SocketInstance, { SocketUser } from '..';
import { Chat } from '../../db/mongodb/models';
import { SocketEvents } from '../../helpers/events.types';
import { handleUserDisconnect } from './controller.helpers';
import { deliverAllMessages } from './deliver_all_messages';
import { handleMessageSeen } from './handle_message_seen';

export async function handleSocketConnection(
    this: SocketInstance,
    socket: Socket,
) {
    new SocketUser({
        io: this.io,
        socket: this.socket,
    });
    socket.on('disconnect', handleUserDisconnect.bind(this, socket));
}
