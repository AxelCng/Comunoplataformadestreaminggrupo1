import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-13ce44c0`;

// Create Supabase client for frontend
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Auth API
export const authAPI = {
  // Sign up new user
  signUp: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ email, password, name })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al registrar usuario');
    }

    return data;
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      user: data.user,
      session: data.session,
      accessToken: data.session?.access_token
    };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error(error.message);
    }

    return {
      session: data.session,
      user: data.session?.user,
      accessToken: data.session?.access_token
    };
  },

  // Get current user
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new Error(error.message);
    }

    return data.user;
  }
};

// Movies API - DISABLED (using local catalog)
// The KV store table does not exist, so all movie operations use local data
export const moviesAPI = {
  getAll: async () => {
    // Return empty array - frontend uses local catalog
    return [];
  },

  init: async (movies: any[]) => {
    // No-op - frontend uses local catalog
    return { success: true, message: 'Using local catalog' };
  },

  add: async (movie: any, accessToken: string) => {
    // No-op - frontend uses local catalog
    return movie;
  }
};

// Images API
export const imagesAPI = {
  // Upload image
  upload: async (file: File, accessToken: string) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al subir imagen');
    }

    return data;
  },

  // Get signed URL for existing image
  getUrl: async (filename: string, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/images/get-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ filename })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al obtener URL');
    }

    return data;
  }
};