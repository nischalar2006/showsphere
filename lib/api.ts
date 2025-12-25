// ==============================
// Backend API URL (SERVER / ADMIN ONLY)
// ==============================
// ❌ NO localhost fallback (CRITICAL)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ==============================
// Backend safety guard
// Prevent browser from hitting backend APIs
// ==============================
function ensureBackendAvailable() {
    if (typeof window !== "undefined" && !API_URL) {
        throw new Error(
            "Backend API is not available in browser (production-safe guard)"
        );
    }
}

// ==============================
// Helper function for backend API calls
// ==============================
async function apiCall(endpoint: string, options: RequestInit = {}) {
    ensureBackendAvailable();

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "Request failed" }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
}

// ==============================
// Supabase Browser Client (PUBLIC READS ONLY)
// ==============================
import { createClient } from "@supabase/supabase-js";

const supabaseBrowser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ==============================
// Movies API
// ==============================
export const moviesApi = {
    // ✅ PUBLIC READ (browser + mobile safe)
    getAll: async () => {
        const { data, error } = await supabaseBrowser
            .from("movies")
            .select("*")
            .order("rating", { ascending: false });

        if (error) {
            console.error("Supabase movies fetch error:", error);
            throw new Error("Failed to fetch movies");
        }

        return data ?? [];
    },

    // ✅ PUBLIC READ (Detail page)
    getById: async (id: string) => {
        const { data, error } = await supabaseBrowser
            .from("movies")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error("Supabase movie details fetch error:", error);
            throw new Error("Failed to fetch movie details");
        }
        return data;
    },

    // 🔒 Backend-protected routes (admin only)
    create: (data: any) =>
        apiCall("/movies", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    update: (id: string, data: any) =>
        apiCall(`/movies/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        apiCall(`/movies/${id}`, { method: "DELETE" }),
};

// ==============================
// Theaters API (Direct Supabase)
// ==============================
export const theatersApi = {
    getAll: async () => {
        const { data, error } = await supabaseBrowser
            .from("theaters")
            .select("*");
        if (error) throw new Error(error.message);
        return data;
    },
    getById: async (id: string) => {
        const { data, error } = await supabaseBrowser
            .from("theaters")
            .select("*")
            .eq("id", id)
            .single();
        if (error) throw new Error(error.message);
        return data;
    },
};

// ==============================
// Shows API (Direct Supabase)
// ==============================
export const showsApi = {
    getAll: async (params?: { movie_id?: string; theater_id?: string }) => {
        let query = supabaseBrowser
            .from("shows")
            .select("*, movies(*), theaters(*)");

        if (params?.movie_id) query = query.eq("movie_id", params.movie_id);
        if (params?.theater_id) query = query.eq("theater_id", params.theater_id);

        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data;
    },
    getById: async (id: string) => {
        const { data, error } = await supabaseBrowser
            .from("shows")
            .select("*, movies(*), theaters(*)")
            .eq("id", id)
            .single();
        if (error) throw new Error(error.message);
        return data;
    },
    create: async (data: any) => {
        const { data: result, error } = await supabaseBrowser
            .from("shows")
            .insert([data])
            .select()
            .single();
        if (error) throw new Error(error.message);
        return result;
    },
};

// ==============================
// Bookings API (Direct Supabase)
// ==============================
export const bookingsApi = {
    create: async (data: {
        show_id: string;
        seat_numbers: string[];
        total_price: number;
    }) => {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data: result, error } = await supabaseBrowser
            .from("bookings")
            .insert([{
                ...data,
                user_id: user.id, // Explicitly set user_id
                booking_date: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result;
    },

    getUserBookings: async () => {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabaseBrowser
            .from("bookings")
            .select("*, shows(*, movies(*), theaters(*))")
            .eq("user_id", user.id)
            .order("booking_date", { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    },

    getById: async (id: string) => {
        const { data, error } = await supabaseBrowser
            .from("bookings")
            .select("*, shows(*, movies(*), theaters(*))")
            .eq("id", id)
            .single();
        if (error) throw new Error(error.message);
        return data;
    },
};

// ==============================
// Auth API (Backend only)
// ==============================
// ==============================
// Auth API (Direct Supabase)
// ==============================
export const authApi = {
    signUp: async (data: {
        email: string;
        password: string;
        full_name: string;
        phone_number?: string;
    }) => {
        // 1. Sign up
        const { data: authData, error: authError } = await supabaseBrowser.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.full_name,
                    phone_number: data.phone_number,
                },
            },
        });

        if (authError) throw new Error(authError.message);

        // 2. Create Profile (Best effort)
        if (authData.user) {
            const { error: profileError } = await supabaseBrowser
                .from("profiles")
                .insert([
                    {
                        id: authData.user.id,
                        email: data.email,
                        full_name: data.full_name,
                        phone_number: data.phone_number,
                    },
                ]);

            // Ignore duplicate key error (if trigger exists)
            if (profileError && profileError.code !== '23505') {
                console.warn("Profile creation failed:", profileError);
            }
        }

        return authData;
    },

    signIn: async (data: { email: string; password: string }) => {
        const { data: result, error } = await supabaseBrowser.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) throw new Error(error.message);

        if (result.session?.access_token) {
            localStorage.setItem("access_token", result.session.access_token);
            localStorage.setItem("user", JSON.stringify(result.user));
        }

        return result; // Matches structure Expected by UI
    },

    signOut: async () => {
        await supabaseBrowser.auth.signOut();
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
    },

    getProfile: async () => {
        // Get current user from session
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabaseBrowser
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw new Error(error.message);
        return data;
    },
};
