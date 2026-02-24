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

  signup: async(email, password, name) => {
    set({isLoading: true, error: null});
    try {
      const res = await axios.post(`${API_URL}/signup`, {email, password, name});
      console.log('response from auth store', res);
      set({user: res.data.data.user, isAuthenticated: true, isLoading: false, message: res.data.message})
    } catch (error) {
      console.log('error response from auth store', res);
      set({error: error.message || "Error signing up", isLoading: false, message: res.data.message})
    } finally {
      set({isLoading: false})
    }
  }
}))