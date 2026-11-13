import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, authApi } from './api';
import { LoginFormData, RegisterFormData } from './schemas';
import { toast } from 'sonner';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  setDemoUser: (role: UserProfile['role']) => void;
}

const DEMO_USERS: Record<UserProfile['role'], UserProfile> = {
  admin: {
    _id: 'demo-admin-id',
    name: 'Arjun Mehta (Admin)',
    email: 'admin@campus.edu',
    role: 'admin',
    department: 'Campus Administration',
    activityPoints: 500,
  },
  faculty: {
    _id: 'demo-faculty-id',
    name: 'Dr. Sarah Jenkins',
    email: 'faculty@campus.edu',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    activityPoints: 350,
  },
  club_head: {
    _id: 'demo-clubhead-id',
    name: 'Rohan Sharma (Club Head)',
    email: 'clubhead@campus.edu',
    role: 'club_head',
    department: 'Information Technology',
    rollNumber: 'IT-2023-042',
    activityPoints: 280,
  },
  maintenance: {
    _id: 'demo-maintenance-id',
    name: 'Suresh Kumar (Facilities)',
    email: 'maintenance@campus.edu',
    role: 'maintenance',
    department: 'Campus Facilities & Services',
    activityPoints: 120,
  },
  student: {
    _id: 'demo-student-id',
    name: 'Priya Patel (Student)',
    email: 'student@campus.edu',
    role: 'student',
    department: 'Computer Science',
    rollNumber: 'CS-2024-108',
    activityPoints: 160,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('campusos_demo_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authApi.getMe();
        setUser(currentUser);
        localStorage.removeItem('campusos_demo_user');
      } catch (err) {
        // If API fails (e.g. no DB connected yet), keep saved demo user if any
        const saved = localStorage.getItem('campusos_demo_user');
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginFormData) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authApi.login(credentials);
      setUser(loggedInUser);
      localStorage.removeItem('campusos_demo_user');
      toast.success(`Welcome back, ${loggedInUser.name}!`);
    } catch (err: any) {
      // Fallback for demo testing if backend MongoDB is not connected
      const foundDemoRole = (Object.keys(DEMO_USERS) as UserProfile['role'][]).find(
        (r) => DEMO_USERS[r].email === credentials.email
      );
      if (foundDemoRole) {
        const demo = DEMO_USERS[foundDemoRole];
        setUser(demo);
        localStorage.setItem('campusos_demo_user', JSON.stringify(demo));
        toast.success(`Logged in as demo ${demo.role}: ${demo.name}`);
        return;
      }
      const message = err.response?.data?.message || err.message || 'Login failed';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const registeredUser = await authApi.register(data);
      setUser(registeredUser);
      localStorage.removeItem('campusos_demo_user');
      toast.success(`Account created! Welcome, ${registeredUser.name}!`);
    } catch (err: any) {
      // Fallback demo user creation
      const mockUser: UserProfile = {
        _id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        rollNumber: data.rollNumber,
        phone: data.phone,
        activityPoints: 50,
      };
      setUser(mockUser);
      localStorage.setItem('campusos_demo_user', JSON.stringify(mockUser));
      toast.success(`Account registered! Welcome, ${mockUser.name}`);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore network error on logout
    } finally {
      setUser(null);
      localStorage.removeItem('campusos_demo_user');
      toast.info('Logged out from CampusOS');
    }
  };

  const setDemoUser = (role: UserProfile['role']) => {
    const demo = DEMO_USERS[role];
    setUser(demo);
    localStorage.setItem('campusos_demo_user', JSON.stringify(demo));
    toast.success(`Switched role to: ${demo.name} (${demo.role.toUpperCase()})`);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, setDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
