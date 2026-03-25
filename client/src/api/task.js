import { request } from './request';

export const task = {
    getAll: () => request('/tasks'),
    getOne: (id) => request(`/tasks/${id}`),
    create: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
    update: (data, id) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};
