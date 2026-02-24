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
      const response = await axios.post(`${API_URL}/signup`, {email, password, name});
      if(response.ok) {
        set({user: response.data.user, isAuthenticated: true, isLoading: false})
      } else {
        set({error: response.data.message || "Error signing up", isLoading: false, message: response.data.message})
      }
    } catch (error) {
      set({error: error.message || "Error signing up", isLoading: false, message: response.data.message})
    }
  }
}))