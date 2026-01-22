import React, { useState } from 'react';
import { login } from '../services/auth';
import { Loader2, Lock, Mail, ArrowRight, Code } from 'lucide-react';

const Login = ({ onLoginSuccess, onSwitchToRegister, onSwitchToForgot }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await login('admin@skillpath.com', 'admin123');
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Dev login failed (Ensure backend is running)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Sign in to continue your path</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500 border-gray-300" />
              <span className="text-slate-600">Remember me</span>
            </label>
            <button type="button" onClick={onSwitchToForgot} className="text-emerald-600 hover:text-emerald-700 font-medium">Forgot password?</button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100">
           <button
            type="button"
            onClick={handleDevLogin}
            disabled={loading}
            className="w-full bg-emerald-50 text-emerald-700 border border-emerald-200 py-2.5 rounded-lg font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Code size={16} />}
            Dev Login (Admin)
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Don't have an account?{' '}
            <button onClick={onSwitchToRegister} className="text-emerald-600 font-bold hover:underline">
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;