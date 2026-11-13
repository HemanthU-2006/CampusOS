import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, User, Mail, Lock, Building, Phone, Hash } from 'lucide-react';
import { registerSchema, RegisterFormData } from '../schemas';
import { useAuth } from '../AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export const RegisterPage: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'student',
      department: 'Computer Science',
      rollNumber: '',
      phone: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMsg(null);
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-glow-landing relative flex flex-col justify-center items-center px-4 py-12 selection:bg-lime selection:text-lime-ink">
      {/* 5 stepped vertical green light bars on left and right */}
      <div className="landing-light-bars" aria-hidden="true" />

      {/* Main Glass Auth Card */}
      <div className="relative z-10 w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-card/85 backdrop-blur-2xl border border-rule shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
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
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create an Account</h1>
          <p className="text-xs text-white/60">
            Join the unified campus infrastructure as a student, faculty, club head, or staff.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Priya Sharma"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Campus Email"
              type="email"
              placeholder="name@campus.edu"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              placeholder="Min 6 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Select
              label="Campus Role"
              options={[
                { value: 'student', label: 'Student' },
                { value: 'faculty', label: 'Faculty' },
                { value: 'club_head', label: 'Club Head' },
                { value: 'maintenance', label: 'Maintenance Staff' },
                { value: 'admin', label: 'Campus Administrator' },
              ]}
              {...register('role')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Department / School"
              placeholder="e.g. Computer Science"
              leftIcon={<Building className="w-4 h-4" />}
              error={errors.department?.message}
              {...register('department')}
            />

            {selectedRole === 'student' ? (
              <Input
                label="Roll / Student ID"
                placeholder="e.g. CS-2024-042"
                leftIcon={<Hash className="w-4 h-4" />}
                error={errors.rollNumber?.message}
                {...register('rollNumber')}
              />
            ) : (
              <Input
                label="Phone Number"
                placeholder="+91 98765 43210"
                leftIcon={<Phone className="w-4 h-4" />}
                error={errors.phone?.message}
                {...register('phone')}
              />
            )}
          </div>

          <Button
            type="submit"
            variant="lime"
            size="lg"
            className="w-full mt-2 font-bold shadow-[0_0_24px_rgba(131,243,77,0.35)]"
            isLoading={isSubmitting || isLoading}
          >
            Complete Registration <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-white/60">
          Already have an account?{' '}
          <Link to="/login" className="text-lime font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
