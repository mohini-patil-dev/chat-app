import { ShowToast } from 'helpers/toast.helper';

export function handleError(error: any) {
    let errorMessage = '';
    errorMessage = error?.response?.data?.message;
    if (!errorMessage) errorMessage = String(error);
    if (!errorMessage) {
        errorMessage = 'Something went wrong, Please try again later!';
    }
    new ShowToast('error').show(errorMessage);
}
