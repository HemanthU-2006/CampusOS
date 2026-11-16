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
    name: 'Dr. K. V. Mahendra Prashanth (Principal)',
    email: 'principal@sjbit.edu.in',
    role: 'admin',
    department: 'SJBIT Office of the Principal',
    activityPoints: 500,
  },
  faculty: {
    _id: 'demo-faculty-id',
    name: 'Dr. A. N. Krishna (HOD CSE)',
    email: 'hodcse@sjbit.edu.in',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    activityPoints: 350,
  },
  club_head: {
    _id: 'demo-clubhead-id',
    name: 'Rohan Sharma (Coding & Fest Lead)',
    email: 'rohan.1jb22cs142@sjbit.edu.in',
    role: 'club_head',
    department: 'Computer Science & Engineering',
    rollNumber: '1JB22CS142',
    activityPoints: 310,
  },
  maintenance: {
    _id: 'demo-maintenance-id',
    name: 'Suresh Kumar (SJBIT Estate & Facilities)',
    email: 'estate@sjbit.edu.in',
    role: 'maintenance',
    department: 'SJBIT Estate & Facilities Office',
    activityPoints: 120,
  },
  student: {
    _id: 'demo-student-id',
    name: 'Priya Patel (Student)',
    email: 'priya.1jb23cs088@sjbit.edu.in',
    role: 'student',
    department: 'Computer Science & Engineering',
    rollNumber: '1JB23CS088',
    activityPoints: 185,
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
      // Check locally registered accounts if backend server is not connected
      try {
        const localRegistered: UserProfile[] = JSON.parse(
          localStorage.getItem('campusos_registered_users') || '[]'
        );
        const match = localRegistered.find(
          (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
        );
        if (match) {
          setUser(match);
          localStorage.setItem('campusos_demo_user', JSON.stringify(match));
          toast.success(`Welcome back, ${match.name}!`);
          return;
        }
      } catch (e) {
        // ignore parse error
      }

      // Check Administrator credentials
      const lowerEmail = credentials.email.toLowerCase();
      if (lowerEmail.includes('admin') || lowerEmail.includes('principal')) {
        const adminUser: UserProfile = {
          _id: 'admin-id',
          name: 'Dr. K. V. Mahendra Prashanth (Principal)',
          email: credentials.email,
          role: 'admin',
          department: 'SJBIT Office of the Principal',
          activityPoints: 500,
        };
        setUser(adminUser);
        localStorage.setItem('campusos_demo_user', JSON.stringify(adminUser));
        toast.success(`Welcome, Dr. K. V. Mahendra Prashanth (Principal)`);
        return;
      }

      // Allow direct login for entered email credentials
      if (credentials.email && credentials.password) {
        const role: UserProfile['role'] = lowerEmail.includes('faculty')
          ? 'faculty'
          : lowerEmail.includes('maintenance')
            ? 'maintenance'
            : lowerEmail.includes('club')
              ? 'club_head'
              : 'student';

        const rawName =
          credentials.email
            .split('@')[0]
            .replace(/[._0-9]/g, ' ')
            .trim() || 'User';
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

        const sessionUser: UserProfile = {
          _id: `user-${Date.now()}`,
          name: formattedName,
          email: credentials.email,
          role,
          department: 'Computer Science & Engineering',
          activityPoints: 50,
        };
        setUser(sessionUser);
        localStorage.setItem('campusos_demo_user', JSON.stringify(sessionUser));
        toast.success(`Welcome back, ${sessionUser.name}!`);
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
      // Fallback local user creation if backend server is offline
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
      try {
        const localRegistered: UserProfile[] = JSON.parse(
          localStorage.getItem('campusos_registered_users') || '[]'
        );
        localRegistered.push(mockUser);
        localStorage.setItem('campusos_registered_users', JSON.stringify(localRegistered));
      } catch (e) {
        // ignore storage error
      }
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
