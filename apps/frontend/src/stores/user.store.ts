import { create } from 'zustand';
import { User, UpdateUserData } from '@/repositories/user.repository';
import { userRepository } from '@/repositories/user.repository';

interface UserState {
  profile: User | null;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateUserData) => Promise<User>;
  deleteAccount: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const profile = await userRepository.getProfile();
      set({ profile, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateProfile: async (data: UpdateUserData) => {
    set({ isLoading: true });
    try {
      const updatedProfile = await userRepository.updateProfile(data);
      set({ profile: updatedProfile, isLoading: false });
      return updatedProfile;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true });
    try {
      await userRepository.deleteAccount();
      set({ profile: null, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
