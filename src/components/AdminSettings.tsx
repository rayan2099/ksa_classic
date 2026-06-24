import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import toast from 'react-hot-toast';
import { User, Mail, Key, Save, Shield } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [passcode, setPasscode] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Email is required.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          passcode
        })
      });

      if (res.ok) {
        toast.success('Profile settings updated.');
        setPasscode('');
        await refreshUser();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to update profile.');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="settings-view" className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-white flex items-center space-x-2">
          <Shield className="w-5 h-5 text-accent" />
          <span>Profile & Security Settings</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1 font-sans">
          Update your administrative identity, login email address, and authentication passcode.
        </p>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider">
              Administrative Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alexander Pierce"
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-accent text-neutral-100 placeholder-neutral-600 rounded-sm py-2.5 pl-10 pr-4 text-xs font-sans outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider">
              Login Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@ksaclassics.com"
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-accent text-neutral-100 placeholder-neutral-600 rounded-sm py-2.5 pl-10 pr-4 text-xs font-sans outline-none transition-colors"
              />
            </div>
            <p className="text-[10px] text-neutral-500 font-sans">
              This email address will be used to log in to the administrative portal.
            </p>
          </div>

          {/* Passcode / Password */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider">
              New Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Leave blank to keep your current password"
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-accent text-neutral-100 placeholder-neutral-600 rounded-sm py-2.5 pl-10 pr-4 text-xs font-sans outline-none transition-colors"
              />
            </div>
            <p className="text-[10px] text-neutral-500 font-sans">
              Enter a new password only when you want to change it.
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-neutral-800 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-accent hover:bg-accent-hover disabled:bg-accent/50 text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-sm flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
