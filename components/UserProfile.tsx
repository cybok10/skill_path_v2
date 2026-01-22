import React, { useState } from 'react';
import { updateProfile } from '../services/auth';
import { User, Mail, Lock, Shield, Key, Save, X, Edit2, Loader2, Copy, Check } from 'lucide-react';

const UserProfile = ({ user, onUpdate, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(user.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedData = await updateProfile(user.id, formData);
      onUpdate(updatedData); // updatedData already contains the token from services/auth
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-cyber-800 rounded-2xl shadow-xl border border-cyber-700 overflow-hidden animate-fade-in transition-colors duration-300">
      <div className="p-6 border-b border-cyber-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full text-emerald-600 dark:text-emerald-400">
            <User size={20} />
          </div>
          User Profile
        </h2>
        <button 
          onClick={onBack}
          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm flex items-center gap-2">
            <Check size={16} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all ${
                    isEditing 
                      ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white' 
                      : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400'
                  }`}
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all ${
                    isEditing 
                      ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white' 
                      : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400'
                  }`}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="animate-fade-in-down">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password (Optional)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="Leave blank to keep current"
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Assigned Roles</label>
            <div className="flex flex-wrap gap-2">
              {user.roles && user.roles.map((role, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-200 dark:border-violet-700/50">
                  <Shield size={12} /> {role}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex justify-between">
              <span>Authentication Token (JWT)</span>
              <button 
                type="button" 
                onClick={handleCopyToken}
                className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied!' : 'Copy Token'}
              </button>
            </label>
            <div className="relative group">
              <Key className="absolute left-3 top-3 text-slate-500 dark:text-slate-400" size={18} />
              <textarea 
                readOnly
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-mono text-xs rounded-lg h-24 resize-none focus:outline-none focus:ring-1 focus:ring-slate-400 scrollbar-hide"
                value={user.token || "No token available"}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              This token verifies your identity to the backend API. It includes your role and basic info.
            </p>
          </div>

          <div className="pt-4 border-t border-cyber-700 flex gap-3 justify-end">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 font-medium"
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError('');
                    setFormData({ ...formData, username: user.username, email: user.email, password: '' });
                  }}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <X size={16} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-70"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;