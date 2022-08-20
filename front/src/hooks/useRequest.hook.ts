import { useState } from 'react';
import { handleError } from 'helpers/error.helper';
import { ShowToast } from 'helpers/toast.helper';
import { useNavigate } from 'react-router-dom';
import { http } from 'helpers/axios.helper';
import { AxiosRequestHeaders } from 'axios';

type ApiTypes = 'get' | 'post' | 'put' | 'delete';

type MakeRequestFunctionParams = Pick<ApiParams, 'params' | 'data'>;

type HookResponse = [(data?: MakeRequestFunctionParams) => Promise<any>, any];

interface ApiParams {
    url: string;
    successNavigate?: string;
    errorNavigate?: string;
    showNotification?: boolean;
    params?: Object;
    data?: Object;
    method?: ApiTypes;
    headers?: AxiosRequestHeaders;
    onError?: (data: any) => void;
    onSuccess?: (data: any) => void;
    loadingFn?: (loading: boolean) => void;
}

export function useRequest(params: ApiParams): HookResponse {
    const {
        successNavigate,
        errorNavigate,
        url,
        method = 'get',
        headers,
        showNotification = true,
        loadingFn,
        onSuccess,
        onError,
    } = params;

    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();

    async function doRequest(_params: MakeRequestFunctionParams = {}) {
        try {
            const { params, data } = _params;
            setErrors(null);
            loadingFn?.(true);

            const requestPayload = {
                method,
                url,
                headers,
                params,
                data,
            };

            const response = await http(requestPayload);

            onSuccess?.(response.data);

            if (showNotification) {
                new ShowToast('success').show(
                    response?.data?.message || 'Success!.',
                );
            }

            if (successNavigate) {
                navigate(successNavigate);
            }

            return response.data;
        } catch (error: any) {
            if (
                error?.response?.code === 401 ||
                error.code === 401 ||
                error.statusCode === 401 ||
                error.response.status === 401
            ) {
                new ShowToast('error').show('Session Timeout.');
                localStorage.clear();
                return navigate('/login');
            }

            if (errorNavigate) {
                navigate(errorNavigate);
            }

            onError?.(error?.response?.data);
            handleError(error);
        } finally {
            loadingFn?.(false);
        }
    }

    return [doRequest, errors];
}
