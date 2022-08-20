import axios, { AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from 'helpers/constants.helper';
import { LOCAL_STORAGE_KEYS } from 'utils/constants';

export const http = axios.create({
    baseURL: API_BASE_URL,
});

http.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    if (token && token !== 'undefined') {
        config.headers = config.headers || {};
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
});
