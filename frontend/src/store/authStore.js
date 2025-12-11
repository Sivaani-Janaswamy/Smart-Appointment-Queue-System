import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  login: (accessToken) => {
    try {
      const decodedUser = jwtDecode(accessToken);
      set({
        user: decodedUser,
        accessToken: accessToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Failed to decode token:', error);
      // Handle logout if token is invalid
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },
  logout: () => {
    set({ user: null, accessToken: null, isAuthenticated: false });
    // In a real app, you might want to call a logout API endpoint here
  },
  setToken: (accessToken) => {
     try {
      const decodedUser = jwtDecode(accessToken);
      set({
        user: decodedUser,
        accessToken: accessToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Failed to decode token:', error);
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },
}));
