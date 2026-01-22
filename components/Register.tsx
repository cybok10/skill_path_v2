import React, { useState } from 'react';
import { register } from '../services/auth';
import { Loader2, Lock, Mail, User, ArrowRight, CheckCircle2 } from 'lucide-react';

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register(formData.username, formData.email, formData.password);
      setSuccess(true);
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h2>
        <p className="text-slate-500 mb-6">Redirecting you to login...</p>
        <Loader2 className="animate-spin mx-auto text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
          <p className="text-slate-500 mt-2">Join SkillPath to accelerate your career</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 mt-6 shadow-md shadow-emerald-200"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-emerald-600 font-bold hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;