import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ type = 'success', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl border ${
          isSuccess
            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
            : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
        )}
        <div className="text-sm font-medium pr-2 max-w-sm">
          {Array.isArray(message) ? (
            <ul className="list-disc list-inside space-y-1">
              {message.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          ) : (
            <p>{message}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
