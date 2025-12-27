// API Configuration
// In production, set VITE_API_URL environment variable
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for making authenticated requests
export const authFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'x-auth-token': token }),
            ...options.headers
        }
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Handle token expiration
    if (response.status === 401) {
        const data = await response.json();
        if (data.msg?.includes('expired')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error('Session expired');
        }
    }

    return response;
};

// Helper to parse response
export const parseResponse = async (response) => {
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch {
        throw new Error(text || 'Server error');
    }
};
