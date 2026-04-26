import { create } from 'zustand';
import { User } from '@/types/user';

interface UserStore {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,

  login: async (email: string, password: string) => {
    // TODO: Implement login logic
    set({ isLoading: true });
    try {
      // API call
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    // TODO: Implement logout logic
    set({ user: null });
  },

  register: async (email: string, password: string) => {
    // TODO: Implement register logic
    set({ isLoading: true });
    try {
      // API call
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  refreshToken: async () => {
    // TODO: Implement token refresh logic
  },

  setUser: (user: User | null) => set({ user }),
}));
