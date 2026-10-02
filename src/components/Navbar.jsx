import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, KeyRound, User, Store, Shield } from 'lucide-react';
import UpdatePasswordModal from './UpdatePasswordModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Shield className="w-3.5 h-3.5" /> System Admin
          </span>
        );
      case 'owner':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Store className="w-3.5 h-3.5" /> Store Owner
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <User className="w-3.5 h-3.5" /> Normal User
          </span>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                TrustRox
              </span>
              <span className="block text-[10px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">
                Store Rating Platform
              </span>
            </div>
          </div>

          {/* User controls */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-200">{user.name}</span>
                <span className="text-xs text-slate-400">{user.email}</span>
              </div>

              {getRoleBadge(user.role)}

              <button
                onClick={() => setShowPasswordModal(true)}
                className="p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg transition-colors border border-slate-700/50 flex items-center gap-2 text-xs font-medium"
                title="Update Password"
              >
                <KeyRound className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Update Password</span>
              </button>

              <button
                onClick={logout}
                className="p-2 text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-900/40 rounded-lg transition-colors border border-rose-800/30 flex items-center gap-2 text-xs font-semibold"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {showPasswordModal && (
        <UpdatePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
};

export default Navbar;
