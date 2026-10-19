import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '@/interfaces/entities/profile.interface';

interface ProfileState {
  activeProfile: Profile | null;
  setActiveProfile: (profile: Profile) => void;
  clearActiveProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      activeProfile: null,
      setActiveProfile: (profile) => set({ activeProfile: profile }),
      clearActiveProfile: () => set({ activeProfile: null }),
    }),
    {
      name: 'profile-storage',
    }
  )
);
