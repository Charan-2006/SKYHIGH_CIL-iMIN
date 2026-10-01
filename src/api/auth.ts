import apiClient from './client';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: 'ADMIN' | 'ENGINEER' | 'LAB_TECHNICIAN' | 'VIEWER';
  subsidiary?: string;
  created_at?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  role: 'ADMIN' | 'ENGINEER' | 'LAB_TECHNICIAN' | 'VIEWER';
}

export const authApi = {
  login: async (credentials: { username: string; password: string }): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>('/auth/login', credentials);
    if (res.data.access_token) {
      localStorage.setItem('carbon_cortex_token', res.data.access_token);
      localStorage.setItem('carbon_cortex_user', JSON.stringify({
        id: res.data.user_id,
        username: res.data.username,
        email: res.data.email,
        full_name: res.data.full_name,
        role: res.data.role
      }));
    }
    return res.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },

  updateProfile: async (data: { full_name?: string; email?: string; subsidiary?: string; current_password?: string; new_password?: string }): Promise<User> => {
    const res = await apiClient.put<User>('/auth/profile', data);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('carbon_cortex_token');
    localStorage.removeItem('carbon_cortex_user');
  },

  listUsers: async (): Promise<User[]> => {
    const res = await apiClient.get<User[]>('/auth/users');
    return res.data;
  }
};
