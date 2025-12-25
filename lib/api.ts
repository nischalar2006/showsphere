// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
}

import { createClient } from '@/lib/supabase/client';

// Movies API
export const moviesApi = {
    getAll: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('movies')
            .select('*');

        if (error) {
            console.error('Supabase fetch error:', error);
            throw new Error(error.message);
        }
        return data || [];
    },
    getById: (id: string) => apiCall(`/movies/${id}`),
    create: (data: any) => apiCall('/movies', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiCall(`/movies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/movies/${id}`, { method: 'DELETE' }),
};

// Theaters API
export const theatersApi = {
    getAll: () => apiCall('/theaters'),
    getById: (id: string) => apiCall(`/theaters/${id}`),
};

// Shows API
export const showsApi = {
    getAll: (params?: { movie_id?: string; theater_id?: string }) => {
        const query = new URLSearchParams(params as any).toString();
        return apiCall(`/shows${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => apiCall(`/shows/${id}`),
    create: (data: any) => apiCall('/shows', { method: 'POST', body: JSON.stringify(data) }),
};

// Bookings API
export const bookingsApi = {
    create: (data: { show_id: string; seat_numbers: string[]; total_price: number }) =>
        apiCall('/bookings', { method: 'POST', body: JSON.stringify(data) }),
    getUserBookings: () => apiCall('/bookings'),
    getById: (id: string) => apiCall(`/bookings/${id}`),
};

// Auth API
export const authApi = {
    signUp: (data: { email: string; password: string; full_name: string; phone_number?: string }) =>
        apiCall('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

    signIn: async (data: { email: string; password: string }) => {
        const result = await apiCall('/auth/signin', { method: 'POST', body: JSON.stringify(data) });
        if (result.session?.access_token) {
            localStorage.setItem('access_token', result.session.access_token);
            localStorage.setItem('user', JSON.stringify(result.user));
        }
        return result;
    },

    signOut: async () => {
        await apiCall('/auth/signout', { method: 'POST' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    },

    getProfile: () => apiCall('/auth/profile'),
};
