import create from 'zustand';
import { configurePersist } from 'zustand-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { persist } = configurePersist({
  storage: AsyncStorage,
  rootKey: 'root',
});

const useStore = create(
  persist({
    key: 'auth',
    allowlist: ['token'],
  },
  (set) => ({
    token: null,
    currentAvatar: null,
    username: null,
    login: (newToken: string) => set(() => ({ token: newToken })),
    setUsername: (username: string) => set(() => ({ username })),
    setCurrentAvatar: (newAvatar: number) => set(() => ({ currentAvatar: newAvatar })),
    logout: () => set(() => ({ token: null })),
    game: null,
    updateGame: (updatedGame: any) => set(() => ({ game: updatedGame })),
    role: null,
    otherVampire: null,
    changeRole: (newRole: any) => set(() => ({
      role: newRole.role,
      otherVampire: newRole.otherVampire,
    })),
  })),
);

export default useStore;
