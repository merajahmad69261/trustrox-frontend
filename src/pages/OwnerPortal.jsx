import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import { Store, Star, Users, MapPin, Mail, Loader2, AlertCircle } from 'lucide-react';

const OwnerPortal = () => {
  const [data, setData] = useState({
    store: null,
    averageRating: 0,
    totalRatings: 0,
    ratedUsers: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await API.get('/owner/dashboard');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load owner dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Store className="w-8 h-8 text-emerald-400" />
            Store Owner Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track your store's customer feedback, average ratings, and individual reviewer logs
          </p>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400 flex justify-center items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" /> Loading store metrics...
          </div>
        ) : !data.store ? (
          <div className="glass-panel p-16 rounded-3xl text-center border border-slate-800 max-w-2xl mx-auto space-y-3">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">No Store Assigned Yet</h2>
            <p className="text-slate-400 text-sm">
              Your Store Owner account is active, but a store has not been linked to your profile yet. Please contact the System Administrator to assign your store.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Store Details Card */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3 md:col-span-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Assigned Store Overview
                </span>
                <h2 className="text-2xl font-black text-white">{data.store.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400" /> {data.store.email}
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" /> {data.store.address}
                  </p>
                </div>
              </div>

              {/* Rating Card */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Store Average Rating
                </span>
                <div className="my-3 flex items-baseline gap-3">
                  <span className="text-5xl font-black text-amber-400">{data.averageRating}</span>
                  <span className="text-sm text-slate-400 font-semibold">/ 5.0</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <StarRating value={Math.round(data.averageRating)} readOnly size="md" />
                  <span className="text-xs text-slate-400 font-medium">
                    {data.totalRatings} total {data.totalRatings === 1 ? 'rating' : 'ratings'}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Ratings Breakdown Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" /> Customer Ratings Breakdown
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {data.ratedUsers.length} Users rated your store
                </span>
              </div>

              <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                {data.ratedUsers.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    No customer ratings submitted for your store yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                        <tr>
                          <th className="py-4 px-6">Customer Name</th>
                          <th className="py-4 px-6">Customer Email</th>
                          <th className="py-4 px-6">Customer Address</th>
                          <th className="py-4 px-6">Submitted Rating</th>
                          <th className="py-4 px-6 text-right">Date Rated</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {data.ratedUsers.map((item) => (
                          <tr key={item.rating_id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-4 px-6 font-semibold text-white">{item.user_name}</td>
                            <td className="py-4 px-6 text-slate-300">{item.user_email}</td>
                            <td className="py-4 px-6 text-slate-400 max-w-xs truncate">{item.user_address}</td>
                            <td className="py-4 px-6 font-bold text-amber-400">
                              <div className="flex items-center gap-2">
                                <StarRating value={item.rating} readOnly size="sm" />
                                <span>{item.rating} Stars</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right text-slate-500">
                              {new Date(item.updated_at || item.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default OwnerPortal;
