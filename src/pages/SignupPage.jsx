import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserPlus, Mail, Lock, User, MapPin, Loader2, Check, AlertCircle } from 'lucide-react';
import Toast from '../components/Toast';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name || formData.name.length < 20 || formData.name.length > 60) {
      errs.name = 'Name must be between 20 and 60 characters.';
    }
    if (!formData.address || formData.address.length > 400) {
      errs.address = 'Address is required (max 400 characters).';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Valid standard email format is required.';
    }
    if (
      !formData.password ||
      formData.password.length < 8 ||
      formData.password.length > 16 ||
      !/[A-Z]/.test(formData.password) ||
      !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)
    ) {
      errs.password = 'Password must be 8–16 characters with 1 uppercase letter & 1 special character.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await signup(formData.name, formData.email, formData.address, formData.password);
    setLoading(false);

    if (result.success) {
      setToast({ type: 'success', message: 'Account created successfully! Redirecting...' });
      setTimeout(() => {
        navigate('/user');
      }, 1000);
    } else {
      setToast({ type: 'error', message: result.errors });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <div className="w-full max-w-lg">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-xl shadow-indigo-500/25 mb-3">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">TrustRox Registration</h1>
          <p className="text-slate-400 text-xs mt-1">Create Normal User Account to Rate Stores</p>
        </div>

        {/* Signup Card */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-2 mb-6 text-sm text-slate-300 font-semibold border-b border-slate-800 pb-3">
            <UserPlus className="w-4 h-4 text-indigo-400" />
            <span>Normal User Registration Form</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name (20–60 characters)
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Alexander Christopher Montgomery Jr."
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Physical Address (Max 400 characters)
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, City, Region, Zip Code"
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.address}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Password@123!"
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
                </p>
              )}

              <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-400">
                <div className={`flex items-center gap-1 ${formData.password.length >= 8 && formData.password.length <= 16 ? 'text-emerald-400' : ''}`}>
                  <Check className="w-3 h-3" /> 8–16 length
                </div>
                <div className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-emerald-400' : ''}`}>
                  <Check className="w-3 h-3" /> 1 Uppercase
                </div>
                <div className={`flex items-center gap-1 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-emerald-400' : ''}`}>
                  <Check className="w-3 h-3" /> 1 Special char
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account & Continue'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Already registered?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
                Sign In here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SignupPage;
