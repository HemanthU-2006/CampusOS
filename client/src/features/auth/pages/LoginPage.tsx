import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Mail } from 'lucide-react';
import { loginSchema, LoginFormData } from '../schemas';
import { useAuth } from '../AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdminParam = searchParams.get('role') === 'admin';
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
      if (isAdminParam || data.email.toLowerCase().includes('admin') || data.email.toLowerCase().includes('principal')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-glow-landing relative flex flex-col justify-center items-center px-4 py-12 selection:bg-lime selection:text-lime-ink">
      {/* 5 stepped vertical green light bars on left and right */}
      <div className="landing-light-bars" aria-hidden="true" />

      {/* Main Glass Auth Card */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-2xl bg-card/85 backdrop-blur-2xl border border-rule shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        {/* Logo & Headline */}
        <div className="text-center space-y-2 mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-2">
            <img
              src="/sjbit-emblem.png"
              alt="SJBIT Emblem"
              className="w-10 h-10 rounded-full object-cover bg-white p-0.5 border border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.3)] group-hover:scale-105 transition-transform"
            />
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-lime transition-colors">
              SJBIT <span className="text-lime">CampusOS</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {isAdminParam ? 'Administrator Portal' : 'SJBIT CampusOS'}
          </h1>
          <p className="text-xs text-white/60">
            {isAdminParam
              ? 'Authorized access for the Office of the Principal and Campus Administration.'
              : 'Sign in to access your SJBIT student or staff portal.'}
          </p>
        </div>

        {/* Administrator Indicator Banner if navigated via Admin Portal */}
        {isAdminParam && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
            <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <p className="font-semibold text-white">Administrator Access Mode</p>
              <p className="text-[11px] text-white/60">Governing all 9 SJBIT engineering &amp; management departments</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label={isAdminParam ? 'Administrator Email' : 'Campus Email'}
            type="email"
            placeholder={isAdminParam ? 'admin@sjbit.edu.in' : 'student@sjbit.edu.in'}
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
            {isAdminParam ? 'Sign In to Administrator Board' : 'Sign In to CampusOS'} <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        {/* Switcher between Student/Faculty and Admin */}
        <div className="mt-5 pt-4 border-t border-ring/60 flex items-center justify-between text-xs">
          {isAdminParam ? (
            <Link
              to="/login"
              className="text-white/60 hover:text-white transition-colors flex items-center gap-1"
            >
              ← Student / Staff Sign-In
            </Link>
          ) : (
            <Link
              to="/login?role=admin"
              className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Administrator Sign-In →
            </Link>
          )}

          <Link to="/register" className="text-lime font-semibold hover:underline">
            Register new account
          </Link>
        </div>
      </div>
    </div>
  );
};
