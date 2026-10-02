import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import Toast from '../components/Toast';
import { Search, Store, Star, MapPin, Mail, Loader2, CheckCircle2 } from 'lucide-react';

const UserPortal = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittingRatingId, setSubmittingRatingId] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await API.get('/user/stores', { params: { search } });
      setStores(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch user stores', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search]);

  // Handle star rating submission or update
  const handleRateStore = async (store, newRatingScore) => {
    setSubmittingRatingId(store.id);
    try {
      if (store.user_rating_id) {
        // Update existing rating
        await API.put(`/user/ratings/${store.user_rating_id}`, { rating: newRatingScore });
        setToast({ type: 'success', message: `Updated your rating for ${store.name} to ${newRatingScore} stars!` });
      } else {
        // Submit new rating
        await API.post('/user/ratings', { storeId: store.id, rating: newRatingScore });
        setToast({ type: 'success', message: `Submitted ${newRatingScore} star rating for ${store.name}!` });
      }
      await fetchStores();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to process store rating.';
      setToast({ type: 'error', message: msg });
    } finally {
      setSubmittingRatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Store className="w-8 h-8 text-indigo-400" />
              Store Directory & Ratings
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Explore registered stores, inspect overall customer scores, and submit your personal star ratings
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stores by Name or Address..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
            />
          </div>
        </div>

        {/* Stores Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 flex justify-center items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" /> Loading store ratings...
          </div>
        ) : stores.length === 0 ? (
          <div className="glass-panel p-16 rounded-3xl text-center border border-slate-800">
            <Store className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-semibold">No stores found</p>
            <p className="text-slate-500 text-xs mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-5"
              >
                <div>
                  {/* Header: Name & Overall Score */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="text-lg font-bold text-white leading-snug line-clamp-2">{store.name}</h2>
                    <div className="flex flex-col items-end shrink-0 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-1 text-amber-400 font-black text-base">
                        <Star className="w-4 h-4 fill-amber-400" />
                        {store.overall_rating}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {store.total_ratings} {store.total_ratings === 1 ? 'rating' : 'ratings'}
                      </span>
                    </div>
                  </div>

                  {/* Details: Address & Email */}
                  <div className="space-y-2 text-xs text-slate-400">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{store.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>{store.email}</span>
                    </p>
                  </div>
                </div>

                {/* Interactive User Rating Area */}
                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      {store.user_rating ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Your Submitted Rating:
                        </>
                      ) : (
                        'Rate this store:'
                      )}
                    </span>
                    {store.user_rating && (
                      <span className="text-amber-400 font-bold">{store.user_rating} / 5 Stars</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <StarRating
                      value={store.user_rating || 0}
                      onChange={(score) => handleRateStore(store, score)}
                      size="md"
                    />
                    {submittingRatingId === store.id && (
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 text-center italic">
                    Click any star to submit or update your rating
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default UserPortal;
