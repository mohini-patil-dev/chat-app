import { ShowToast } from './toast.helper';
import { str } from 'jseassy';
type NotificationTypes = 'message';

class BrowserNotification {
    isNotificationPermissionGranted: boolean;
    constructor() {
        this.isNotificationPermissionGranted = false;
    }

    askForPermission() {
        Notification.requestPermission((permission) => {
            if (permission === 'granted') {
                this.isNotificationPermissionGranted = true;
            } else {
                new ShowToast('info').show(
                    'Please enable notifications to stay updated with latest messages.',
                );
            }
        });
    }

    showNotification(notification: {
        type: NotificationTypes;
        data: any;
        onClick: (chatId: string) => void;
    }) {
        if (!this.isNotificationPermissionGranted) {
            return;
        }

        switch (notification.type) {
            case 'message':
                const { message, from } = notification.data;
                const notificationOptions = {
                    body: message,
                    icon: `https://avatars.dicebear.com/api/adventurer/${
                        message.isGroup ? message.groupName : from.username
                    }.svg`,
                    vibrate: [200, 100, 200],
                    image: `https://avatars.dicebear.com/api/adventurer/${
                        message.isGroup ? message.groupName : from.username
                    }.svg`,
                };
                const sentNotification = new Notification(
                    `${str.ucFirst(from.username)} says:`,
                    notificationOptions,
                );

                sentNotification.onclick = () => {
                    notification?.onClick?.(
                        notification.data.isGroup
                            ? notification.data.to
                            : notification.data.chatId,
                    );
                };

                break;
            default:
                break;
        }
    }
}

export const browserNotification = new BrowserNotification();
