import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="glass-panel p-8 rounded-3xl border border-rose-900/40 text-center max-w-md w-full space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white">403 - Access Denied</h1>
        <p className="text-slate-400 text-xs leading-relaxed">
          You do not have the required permissions or role access to view this portal page.
        </p>
        <div className="pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
