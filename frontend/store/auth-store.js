import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

export const useAuth = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  clearAuthFeedback: () => {
    set({ message: null, error: null })
  },
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if(res.ok) {
        set({
          user: data.user,
          isAuthenticated: true,
          message: data.message,
        });
      } else {
        const errorMessage = data?.message || "Error signing up";
        set({
          error: errorMessage,
        });
        // for the frontend error to skip navigation to verify email
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || "Error signing up";
      set({ error: errorMessage })
      // for the frontend error to skip navigation to verify email
        throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  resendVerificationEmail: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      if(!email) {
        const noEmailError = "No verification request found. Please start the signup process."; 
        set({ error: noEmailError})
        throw new Error(noEmailError)
      };
      const res = await fetch(`${API_URL}/resend-verification-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        set({ message: data.message });
      } else {
        const errorMessage = data?.message || "Unable to resend verification email";
        set({ error: errorMessage });
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      const errorMessage = error.message || "Unable to resend verification email";
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  verifyEmail: async (code, email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      if(!email) {
        const noEmailError = "No verification request found. Please start the signup process."; 
        set({ error: noEmailError})
        throw new Error(noEmailError)
      };    
      const res = await fetch(`${API_URL}/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code, email }),
      });
      const data = await res.json();
      if(res.ok) {
        set({  isAuthenticated: true, message: data.message });
      } else {
        set({ error: data.message, isAuthenticated: false });
        throw new Error(data.message);
      }
      return data
    } catch (error) {
        set({ error: error.message, isAuthenticated: false });
        throw new Error(error.message);
    } finally {
      set({ isLoading: false })
    }
  }
}));
