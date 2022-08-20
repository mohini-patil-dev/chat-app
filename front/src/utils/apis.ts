const API_PREFIXES = {
    AUTH: 'auth',
    CHAT: 'messages',
};

export const API_PATHS = {
    auth: {
        login: `${API_PREFIXES.AUTH}/login`,
        register: `${API_PREFIXES.AUTH}/register`,
        verifyEmailToken: `${API_PREFIXES.AUTH}/verify-email-token`,
    },
    user: {
        getLoggedInUser: 'user',
    },
    chat: {
        messages: `${API_PREFIXES.CHAT}`,
        sendMessage: `${API_PREFIXES.CHAT}/send`,
    },
};
