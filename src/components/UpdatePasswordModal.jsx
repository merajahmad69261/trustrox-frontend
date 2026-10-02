import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, KeyRound, Check, AlertCircle, Loader2 } from 'lucide-react';
import Toast from './Toast';

const UpdatePasswordModal = ({ onClose }) => {
  const { updatePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Password rules validation helper
  const validateNewPassword = (pwd) => {
    if (pwd.length < 8 || pwd.length > 16) {
      return 'Password must be between 8 and 16 characters long.';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must include at least 1 uppercase letter.';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      return 'Password must include at least 1 special character.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const err = validateNewPassword(newPassword);
    if (err) {
      setValidationError(err);
      return;
    }

    setLoading(true);
    const result = await updatePassword(oldPassword, newPassword);
    setLoading(false);

    if (result.success) {
      setToast({ type: 'success', message: 'Password updated successfully!' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setToast({ type: 'error', message: result.errors });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Update Password</h2>
            <p className="text-xs text-slate-400">Security requirement: 8-16 chars with 1 uppercase & 1 special char</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setValidationError(validateNewPassword(e.target.value));
              }}
              placeholder="Enter new password (8-16 chars)"
              className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            {/* Live checklist for password format */}
            <div className="mt-2 space-y-1 text-xs">
              <div className={`flex items-center gap-1.5 ${newPassword.length >= 8 && newPassword.length <= 16 ? 'text-emerald-400' : 'text-slate-500'}`}>
                <Check className="w-3.5 h-3.5" /> 8–16 characters
              </div>
              <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(newPassword) ? 'text-emerald-400' : 'text-slate-500'}`}>
                <Check className="w-3.5 h-3.5" /> At least 1 uppercase letter
              </div>
              <div className={`flex items-center gap-1.5 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? 'text-emerald-400' : 'text-slate-500'}`}>
                <Check className="w-3.5 h-3.5" /> At least 1 special character (!@#$%^&*)
              </div>
            </div>

            {validationError && (
              <p className="mt-2 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {validationError}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !!validationError || !oldPassword || !newPassword}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save New Password
            </button>
          </div>
        </form>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default UpdatePasswordModal;
