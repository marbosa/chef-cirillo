import { request } from './request';

export const user = {
    me: () => request('/users/me'),
    delete: () => request('/users/me/delete', { method: 'DELETE'}),
    changePassword: (data) => request('/users/me/change-password', { method: 'PATCH', body: JSON.stringify(data)})
};
