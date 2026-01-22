import React, { useState } from 'react';
import { resetPassword } from '../services/auth';
import { Loader2, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ResetPasswordProps {
    token: string;
    onSuccess: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ token, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => {
                onSuccess();
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Reset!</h2>
                <p className="text-slate-500 mb-6">Your password has been updated successfully. Redirecting to login...</p>
                <Loader2 className="animate-spin mx-auto text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Set New Password</h2>
                    <p className="text-slate-500 mt-2 text-sm">Enter your new secure password below.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                Update Password <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;