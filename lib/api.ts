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

  // 🔒 Backend-protected routes (admin only)
  getById: (id: string) => apiCall(`/movies/${id}`),
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
// Theaters API (Backend only)
// ==============================
export const theatersApi = {
  getAll: () => apiCall("/theaters"),
  getById: (id: string) => apiCall(`/theaters/${id}`),
};

// ==============================
// Shows API (Backend only)
// ==============================
export const showsApi = {
  getAll: (params?: { movie_id?: string; theater_id?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiCall(`/shows${query ? `?${query}` : ""}`);
  },
  getById: (id: string) => apiCall(`/shows/${id}`),
  create: (data: any) =>
    apiCall("/shows", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ==============================
// Bookings API (Backend only)
// ==============================
export const bookingsApi = {
  create: (data: {
    show_id: string;
    seat_numbers: string[];
    total_price: number;
  }) =>
    apiCall("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getUserBookings: () => apiCall("/bookings"),
  getById: (id: string) => apiCall(`/bookings/${id}`),
};

// ==============================
// Auth API (Backend only)
// ==============================
export const authApi = {
  signUp: (data: {
    email: string;
    password: string;
    full_name: string;
    phone_number?: string;
  }) =>
    apiCall("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  signIn: async (data: { email: string; password: string }) => {
    const result = await apiCall("/auth/signin", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (result.session?.access_token) {
      localStorage.setItem(
        "access_token",
        result.session.access_token
      );
      localStorage.setItem("user", JSON.stringify(result.user));
    }

    return result;
  },

  signOut: async () => {
    await apiCall("/auth/signout", { method: "POST" });
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  getProfile: () => apiCall("/auth/profile"),
};
