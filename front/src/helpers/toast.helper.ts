import { TypeOptions, toast } from 'react-toastify';

export class ShowToast {
    private type: TypeOptions;
    constructor(type: TypeOptions) {
        this.type = type;
    }

    show(...messages: string[]) {
        toast(messages.join(','), {
            type: this.type,
        });
    }
}
