import { writable } from 'svelte/store';

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

function createAuthStore() {
  // Initialisation avec les données du localStorage
  const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      initialState.isAuthenticated = true;
      initialState.token = token;
      initialState.user = user;
    }
  }

  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,
    login: (token: string, user: User) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ isAuthenticated: true, token, user });
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ isAuthenticated: false, token: null, user: null });
    },
    updateUser: (user: User) => {
      localStorage.setItem('user', JSON.stringify(user));
      update(state => ({ ...state, user }));
    }
  };
}

export const auth = createAuthStore(); 