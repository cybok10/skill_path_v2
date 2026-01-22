import React, { useState } from 'react';
import { forgotPassword } from '../services/auth';
import { Loader2, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordProps {
    onBack: () => void;
    onSimulateLinkClick: (token: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack, onSimulateLinkClick }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [resetToken, setResetToken] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        setResetToken(null);

        try {
            const response = await forgotPassword(email);
            setMessage("We have sent a password reset link to your email.");
            
            // For Demo/Mock purposes only:
            if (response.token) {
                setResetToken(response.token);
            }
        } catch (err: any) {
            setError(err.message || "Failed to request reset link.");
        } finally {
            setLoading(false);
        }
    };

    if (message) {
        return (
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Check Your Email</h2>
                <p className="text-slate-500 mb-6">{message}</p>
                
                {resetToken && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                        <p className="text-xs text-yellow-800 font-bold uppercase mb-1">Demo Mode</p>
                        <p className="text-sm text-yellow-700 mb-2">In production, this link is emailed. For testing, click below:</p>
                        <button 
                            onClick={() => onSimulateLinkClick(resetToken)}
                            className="text-emerald-600 font-bold underline text-sm break-all"
                        >
                            Reset Password (Token: {resetToken.substring(0, 8)}...)
                        </button>
                    </div>
                )}

                <button 
                    onClick={onBack}
                    className="text-slate-500 hover:text-slate-900 text-sm font-medium flex items-center justify-center gap-2 mx-auto"
                >
                    <ArrowLeft size={16} /> Back to Login
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Forgot Password?</h2>
                    <p className="text-slate-500 mt-2 text-sm">Enter your email and we'll send you a link to reset your password.</p>
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                Send Reset Link <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button onClick={onBack} className="text-slate-500 hover:text-slate-900 text-sm font-medium flex items-center justify-center gap-2 mx-auto">
                        <ArrowLeft size={16} /> Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;