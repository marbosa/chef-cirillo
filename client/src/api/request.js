const BASE = 'http://localhost:5000';

const fetchWithAuth = async (path, accessToken, options) => {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 
            'Content-type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })        
        },
        ...options
    }).catch(() => {
        throw new Error('Network Error');
    });
    return res;
};

export const request = async (path, options) => {
    const accessToken = localStorage.getItem('accessToken'); 
    const res = await fetchWithAuth(path, accessToken, options);

    if(!res.ok) {
        const err = await res.json().catch(() => null);
        if (res.status === 401) {
            const refreshToken = localStorage.getItem('refreshToken');
            const refreshTokenRes = await fetch(`${BASE}/auth/refresh`, {
                    headers: { 
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        refreshToken: refreshToken,
                    }),
                    method: 'POST'
                }).catch(() => {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    throw new Error('Could not refresh token');
            });

            const { accessToken } = await refreshTokenRes.json();
            localStorage.setItem('accessToken', accessToken);

            const accessTokenRes = await fetchWithAuth(path, accessToken, options);

            const text = await accessTokenRes.text();
            return text ? JSON.parse(text) : null;
        }
        throw new Error(err?.message || `Err ${res.status}`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
};
