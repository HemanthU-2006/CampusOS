import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, UserCheck, Wrench, Users, GraduationCap, Lock, Mail } from 'lucide-react';
import { loginSchema, LoginFormData } from '../schemas';
import { useAuth } from '../AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export const LoginPage: React.FC = () => {
  const { login, setDemoUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Invalid email or password');
    }
  };

  const handleQuickDemo = (role: 'admin' | 'faculty' | 'club_head' | 'maintenance' | 'student') => {
    setDemoUser(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-glow-landing relative flex flex-col justify-center items-center px-4 py-12 selection:bg-lime selection:text-lime-ink">
      {/* 5 stepped vertical green light bars on left and right */}
      <div className="landing-light-bars" aria-hidden="true" />

      {/* Main Glass Auth Card */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-2xl bg-card/85 backdrop-blur-2xl border border-rule shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        {/* Logo & Headline */}
        <div className="text-center space-y-2 mb-6">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-9 h-9 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center text-lime group-hover:shadow-[0_0_16px_rgba(131,243,77,0.4)] transition-all">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-lime transition-colors">
              Campus<span className="text-lime">OS</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-white/60">
            Sign in to access your campus operations dashboard.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Campus Email"
            type="email"
            placeholder="student@campus.edu"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            variant="lime"
            size="lg"
            className="w-full mt-2 font-bold shadow-[0_0_24px_rgba(131,243,77,0.35)]"
            isLoading={isSubmitting || isLoading}
          >
            Sign In to CampusOS <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        {/* Quick Role Switcher for Evaluators */}
        <div className="mt-6 pt-5 border-t border-ring/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">
              Quick Demo Access (1-Click)
            </span>
            <Badge variant="lime" className="text-[10px] py-0">Demo Mode</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="flex items-center gap-2 p-2 rounded-lg bg-row/80 hover:bg-row border border-ring/60 hover:border-lime/40 text-left transition-colors cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-lime shrink-0" />
              <div className="truncate">
                <p className="font-semibold text-white truncate">Student</p>
                <p className="text-[10px] text-white/50 truncate">Priya Patel</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('faculty')}
              className="flex items-center gap-2 p-2 rounded-lg bg-row/80 hover:bg-row border border-ring/60 hover:border-lime/40 text-left transition-colors cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <p className="font-semibold text-white truncate">Faculty</p>
                <p className="text-[10px] text-white/50 truncate">Dr. Jenkins</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('club_head')}
              className="flex items-center gap-2 p-2 rounded-lg bg-row/80 hover:bg-row border border-ring/60 hover:border-lime/40 text-left transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <p className="font-semibold text-white truncate">Club Head</p>
                <p className="text-[10px] text-white/50 truncate">Rohan Sharma</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('maintenance')}
              className="flex items-center gap-2 p-2 rounded-lg bg-row/80 hover:bg-row border border-ring/60 hover:border-lime/40 text-left transition-colors cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="truncate">
                <p className="font-semibold text-white truncate">Maintenance</p>
                <p className="text-[10px] text-white/50 truncate">Suresh Kumar</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="col-span-2 flex items-center justify-center gap-2 p-2 rounded-lg bg-row/80 hover:bg-row border border-ring/60 hover:border-lime/40 text-center transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span className="font-semibold text-white">Campus Administrator (Arjun Mehta)</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-white/60">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-lime font-semibold hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};
