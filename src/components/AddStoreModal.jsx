import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { X, Store, Loader2, AlertCircle } from 'lucide-react';
import Toast from './Toast';

const AddStoreModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });

  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch available store owners for selection
    const fetchOwners = async () => {
      try {
        const res = await API.get('/admin/users?role=owner');
        setOwners(res.data.data || []);
      } catch (err) {
        console.error('Failed to load store owners', err);
      }
    };
    fetchOwners();
  }, []);

  const validateForm = () => {
    const errs = {};
    if (!formData.name || formData.name.length < 20 || formData.name.length > 60) {
      errs.name = 'Store name must be between 20 and 60 characters.';
    }
    if (!formData.address || formData.address.length > 400) {
      errs.address = 'Store address is required and must not exceed 400 characters.';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Valid store email address is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        ownerId: formData.ownerId ? parseInt(formData.ownerId, 10) : null,
      };

      const response = await API.post('/admin/stores', payload);
      setToast({ type: 'success', message: response.data.message });
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      const serverErrors = err.response?.data?.errors || [err.response?.data?.message || 'Failed to create store.'];
      setToast({ type: 'error', message: serverErrors });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Add New Store</h2>
            <p className="text-xs text-slate-400">Register new store entity into system directory</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Store Name (20–60 characters)
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Apex Mega Store Supermarket Commercial Outlet"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Store Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="store@trustrox.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Store Address (Max 400 characters)
            </label>
            <textarea
              required
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter complete store physical location address"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.address}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Assign Store Owner (Optional)
            </label>
            <select
              value={formData.ownerId}
              onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- No Owner Assigned (Unassigned) --</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Store Entry
            </button>
          </div>
        </form>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AddStoreModal;
