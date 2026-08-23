import { fetchWithAuth, API_BASE_URL } from './client';

export const authApi = {
  login: async (credentials: any) => {
    return fetchWithAuth(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  register: async (userData: any) => {
    return fetchWithAuth(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  me: async () => {
    return fetchWithAuth(`${API_BASE_URL}/user/me`);
  }
};
