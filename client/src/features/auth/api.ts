import api from '@/lib/axios';
import { LoginFormData, RegisterFormData } from './schemas';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'club_head' | 'maintenance' | 'admin';
  department?: string;
  rollNumber?: string;
  phone?: string;
  activityPoints: number;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: UserProfile;
  };
  message: string;
}

export const authApi = {
  login: async (credentials: LoginFormData): Promise<UserProfile> => {
    const res = await api.post<AuthResponse>('/auth/login', credentials);
    return res.data.data.user;
  },

  register: async (data: RegisterFormData): Promise<UserProfile> => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data.data.user;
  },

  getMe: async (): Promise<UserProfile> => {
    const res = await api.get<AuthResponse>('/auth/me');
    return res.data.data.user;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};
