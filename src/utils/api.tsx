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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (error) {
      // Translate common Supabase error messages to Spanish
      let errorMessage = error.message;
      
      if (error.message.includes('User already registered')) {
        errorMessage = 'Este email ya está registrado. Intenta iniciar sesión';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Email inválido';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      }
      
      throw new Error(errorMessage);
    }

    return {
      user: data.user,
      session: data.session
    };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Translate common Supabase error messages to Spanish
      let errorMessage = error.message;
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email o contraseña incorrectos. Si no tienes cuenta, regístrate primero';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor confirma tu email antes de iniciar sesión';
      } else if (error.message.includes('User not found')) {
        errorMessage = 'Usuario no encontrado. ¿Ya te registraste?';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Email inválido';
      } else if (error.message.includes('too many requests')) {
        errorMessage = 'Demasiados intentos. Por favor espera un momento';
      }
      
      throw new Error(errorMessage);
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
      throw new Error('Error al cerrar sesión');
    }
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error('Error al obtener la sesión');
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
      throw new Error('Error al obtener el usuario');
    }

    return data.user;
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      // Translate common Supabase error messages to Spanish
      let errorMessage = error.message;
      
      if (error.message.includes('User not found')) {
        errorMessage = 'No se encontró una cuenta con ese email';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Email inválido';
      } else if (error.message.includes('too many requests')) {
        errorMessage = 'Demasiados intentos. Por favor espera un momento';
      }
      
      throw new Error(errorMessage);
    }

    return { success: true };
  },

  // Update password (for password reset flow)
  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      // Translate common Supabase error messages to Spanish
      let errorMessage = error.message;
      
      if (error.message.includes('New password should be different')) {
        errorMessage = 'La nueva contraseña debe ser diferente a la anterior';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      } else if (error.message.includes('Unable to validate')) {
        errorMessage = 'Sesión inválida. Solicita un nuevo enlace de recuperación';
      }
      
      throw new Error(errorMessage);
    }

    return { success: true };
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