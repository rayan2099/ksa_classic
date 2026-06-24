import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { KeyRound, Mail, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminLogin: React.FC = () => {
  const { login, user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    if (!loading && user) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success('Successfully logged into Admin Portal!', {
        style: {
          background: '#1A1A1A',
          color: '#F5F5F5',
          border: '1px solid #C9A84C',
          borderRadius: '2px',
        }
      });
      navigate('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating Back Link */}
      <Link
        to="/"
        className="absolute top-7 left-4 sm:left-8 flex items-center space-x-2 text-xs font-heading font-bold uppercase tracking-wider text-neutral-400 hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Showroom</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img
              src="/logo.png"
              alt="KSA Classic"
              className="h-14 w-auto mx-auto object-contain brightness-0 invert"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const span = document.createElement('span');
                  span.className = 'font-heading text-2xl font-bold tracking-widest text-white';
                  span.innerText = 'KSA CLASSIC';
                  parent.appendChild(span);
                }
              }}
            />
          </Link>
          <div className="h-[1px] w-12 bg-accent mx-auto mt-4 mb-2"></div>
          <p className="text-xs text-neutral-400 uppercase tracking-widest font-heading font-semibold">
            Administrative Access Control
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-sm p-6 sm:p-8 shadow-2xl relative">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email field */}
            <div>
              <label className="block text-[10px] uppercase font-heading font-bold tracking-wider text-neutral-400 mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  {...register('email', { required: 'Administrator email is required' })}
                  placeholder="e.g. administrator@ksaclassic.com"
                  className={`w-full bg-neutral-950 border ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-accent'
                  } rounded-sm py-2.5 pl-10 pr-4 text-xs font-sans text-white outline-none transition-colors`}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-[10px] uppercase font-heading font-bold tracking-wider text-neutral-400 mb-2">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  placeholder="••••••••"
                  className={`w-full bg-neutral-950 border ${
                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-accent'
                  } rounded-sm py-2.5 pl-10 pr-4 text-xs font-sans text-white outline-none transition-colors`}
                />
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={isSubmitting}
              id="admin-login-submit"
              className="w-full bg-accent hover:bg-accent-hover text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider py-4 rounded-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/15 cursor-pointer flex items-center justify-center space-x-2 border border-accent"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
