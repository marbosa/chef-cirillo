import { request } from './request';

const authenticate = async (path, data) => {
    const body = JSON.stringify(data);
    const { accessToken, refreshToken } = await request(path, { method: 'POST', body }); 
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return { accessToken, refreshToken };
};

export const auth = {
    register: (data) => authenticate('/auth/register', data),
    login: (data) => authenticate('/auth/login', data),
    logout: () => request('/auth/logout', { method: 'POST'} ),
    refresh: (data) => request('/auth/refresh', { method: 'POST', body: JSON.stringify(data)}),
    forgotPassword: (data) => request('/auth/forgot-password', { method: 'POST',  body: JSON.stringify(data)})
};
