import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Toast from '../components/Toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(() => {
    return searchParams.get('expired')
      ? { type: 'error', message: 'Session expired. Please sign in again.' }
      : null;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const role = result.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'owner') navigate('/owner');
      else navigate('/user');
    } else {
      setToast({ type: 'error', message: result.error });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-xl shadow-indigo-500/25 mb-4">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">TrustRox</h1>
          <p className="text-slate-400 text-sm mt-1">Single Access Authentication Portal for All Roles</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-2 mb-6 text-sm text-slate-300 font-semibold border-b border-slate-800 pb-3">
            <LogIn className="w-4 h-4 text-indigo-400" />
            <span>Sign In to Account</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@trustrox.com"
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick info presets hint */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              New customer?{' '}
              <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
                Register Normal User Account
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials tip */}
        <div className="mt-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/30 text-xs text-indigo-300">
          <p className="font-bold text-indigo-200 mb-1">🔑 Demo Login Credentials:</p>
          <ul className="space-y-1 font-mono text-[11px] text-indigo-300/80">
            <li>• System Admin: <span className="text-white">admin@trustrox.com</span> / <span className="text-white">Admin@1234!</span></li>
            <li>• Normal User: <span className="text-white">normaluser@trustrox.com</span> / <span className="text-white">User@12345!</span></li>
            <li>• Store Owner: <span className="text-white">storeowner@trustrox.com</span> / <span className="text-white">Owner@12345!</span></li>
          </ul>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LoginPage;
