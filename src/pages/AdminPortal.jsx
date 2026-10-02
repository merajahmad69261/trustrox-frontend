import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import AddUserModal from '../components/AddUserModal';
import AddStoreModal from '../components/AddStoreModal';
import {
  Users,
  Store,
  Star,
  Plus,
  Search,
  ArrowUpDown,
  Filter,
  Shield,
  Loader2,
  RefreshCw,
} from 'lucide-react';

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('stores'); // 'stores' or 'users'
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

  // Store Management state
  const [stores, setStores] = useState([]);
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSortBy, setStoreSortBy] = useState('name');
  const [storeOrder, setStoreOrder] = useState('ASC');
  const [storesLoading, setStoresLoading] = useState(false);

  // User Management state
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userSortBy, setUserSortBy] = useState('name');
  const [userOrder, setUserOrder] = useState('ASC');
  const [usersLoading, setUsersLoading] = useState(false);

  // Modals state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);

  // Fetch Dashboard Stats
  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/dashboard');
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    }
  };

  // Fetch Stores
  const fetchStores = async () => {
    setStoresLoading(true);
    try {
      const res = await API.get('/admin/stores', {
        params: { search: storeSearch, sortBy: storeSortBy, order: storeOrder },
      });
      setStores(res.data.data || []);
    } catch (err) {
      console.error('Failed to load stores', err);
    } finally {
      setStoresLoading(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await API.get('/admin/users', {
        params: { search: userSearch, role: userRoleFilter, sortBy: userSortBy, order: userOrder },
      });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'stores') fetchStores();
    else fetchUsers();
  }, [activeTab, storeSearch, storeSortBy, storeOrder, userSearch, userRoleFilter, userSortBy, userOrder]);

  const toggleSortStore = (column) => {
    if (storeSortBy === column) {
      setStoreOrder(storeOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setStoreSortBy(column);
      setStoreOrder('ASC');
    }
  };

  const toggleSortUser = (column) => {
    if (userSortBy === column) {
      setUserOrder(userOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setUserSortBy(column);
      setUserOrder('ASC');
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
              <Shield className="w-8 h-8 text-indigo-400" />
              System Administrator Portal
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Global Platform Overview, Store Directory Management & User Administration
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddStoreModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" /> Add New Store
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-violet-600/20"
            >
              <Plus className="w-4 h-4" /> Add New User
            </button>
          </div>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-6 flex items-center gap-5 border border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</span>
              <p className="text-3xl font-black text-white mt-0.5">{stats.totalUsers}</p>
              <span className="text-[11px] text-slate-500">Registered across all roles</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 flex items-center gap-5 border border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Stores</span>
              <p className="text-3xl font-black text-white mt-0.5">{stats.totalStores}</p>
              <span className="text-[11px] text-slate-500">Active stores registered</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 flex items-center gap-5 border border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Star className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Submitted Ratings</span>
              <p className="text-3xl font-black text-white mt-0.5">{stats.totalRatings}</p>
              <span className="text-[11px] text-slate-500">Total rating submissions</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-8">
          <button
            onClick={() => setActiveTab('stores')}
            className={`pb-4 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'stores'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Store className="w-4 h-4" /> Store Directory ({stores.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> User Management ({users.length})
          </button>
        </div>

        {/* Tab 1: STORES TABLE */}
        {activeTab === 'stores' && (
          <div className="space-y-4">
            {/* Filters bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={storeSearch}
                  onChange={(e) => setStoreSearch(e.target.value)}
                  placeholder="Filter by store Name, Email, or Address..."
                  className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
                </span>
                <select
                  value={storeSortBy}
                  onChange={(e) => setStoreSortBy(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="address">Address</option>
                  <option value="rating">Average Rating</option>
                </select>

                <button
                  onClick={() => setStoreOrder(storeOrder === 'ASC' ? 'DESC' : 'ASC')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300"
                >
                  {storeOrder}
                </button>
              </div>
            </div>

            {/* Stores Table */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              {storesLoading ? (
                <div className="p-12 text-center text-slate-400 flex justify-center items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> Loading stores data...
                </div>
              ) : stores.length === 0 ? (
                <div className="p-12 text-center text-slate-400">No stores found matching your criteria.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                      <tr>
                        <th onClick={() => toggleSortStore('name')} className="py-4 px-6 cursor-pointer hover:text-white">
                          Store Name <ArrowUpDown className="w-3 h-3 inline ml-1" />
                        </th>
                        <th onClick={() => toggleSortStore('email')} className="py-4 px-6 cursor-pointer hover:text-white">
                          Email Address <ArrowUpDown className="w-3 h-3 inline ml-1" />
                        </th>
                        <th onClick={() => toggleSortStore('address')} className="py-4 px-6 cursor-pointer hover:text-white">
                          Address <ArrowUpDown className="w-3 h-3 inline ml-1" />
                        </th>
                        <th className="py-4 px-6">Store Owner</th>
                        <th onClick={() => toggleSortStore('rating')} className="py-4 px-6 cursor-pointer hover:text-white text-right">
                          Average Rating <ArrowUpDown className="w-3 h-3 inline ml-1" />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {stores.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-6 font-semibold text-white">{s.name}</td>
                          <td className="py-4 px-6 text-slate-300">{s.email}</td>
                          <td className="py-4 px-6 text-slate-400 max-w-xs truncate">{s.address}</td>
                          <td className="py-4 px-6">
                            {s.owner_name ? (
                              <span className="text-emerald-400 font-medium">{s.owner_name}</span>
                            ) : (
                              <span className="text-slate-500 italic">Unassigned</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right font-bold text-white">
                            <div className="flex items-center justify-end gap-2">
                              <StarRating value={Math.round(s.average_rating)} readOnly size="sm" />
                              <span className="text-amber-400 text-sm font-extrabold">{s.average_rating}</span>
                              <span className="text-[10px] text-slate-500">({s.total_ratings})</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: USERS TABLE */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Filters bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by Name, Email, or Address..."
                    className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Filter className="w-3.5 h-3.5" /> Role:
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5 focus:outline-none"
                  >
                    <option value="">All Roles</option>
                    <option value="admin">System Admin</option>
                    <option value="owner">Store Owner</option>
                    <option value="user">Normal User</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
                </span>
                <select
                  value={userSortBy}
                  onChange={(e) => setUserSortBy(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="address">Address</option>
                  <option value="role">Role</option>
                  <option value="rating">Store Rating</option>
                </select>

                <button
                  onClick={() => setUserOrder(userOrder === 'ASC' ? 'DESC' : 'ASC')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300"
                >
                  {userOrder}
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              {usersLoading ? (
                <div className="p-12 text-center text-slate-400 flex justify-center items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> Loading users list...
                </div>
              ) : users.length === 0 ? (
                <div className="p-12 text-center text-slate-400">No users found matching your criteria.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                      <tr>
                        <th onClick={() => toggleSortUser('name')} className="py-4 px-6 cursor-pointer hover:text-white">
                          User Name <ArrowUpDown className="w-3 h-3 inline ml-1" />
                        </th>
                        <th onClick={() => toggleSortUser('email')} className="py-4 px-6 cursor-pointer hover:text-white">
                          Email Address <ArrowUpDown className="w-3 h-3 inline ml-1" />
                        </th>
                        <th onClick={() => toggleSortUser('address')} className="py-4 px-6 cursor-pointer hover:text-white">
                          Address <ArrowUpDown className="w-3 h-3 inline ml-1" />
                        </th>
                        <th onClick={() => toggleSortUser('role')} className="py-4 px-6 cursor-pointer hover:text-white">
                          Role <ArrowUpDown className="w-3 h-3 inline ml-1" />
                        </th>
                        <th className="py-4 px-6 text-right">Store Rating (If Owner)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-6 font-semibold text-white">{u.name}</td>
                          <td className="py-4 px-6 text-slate-300">{u.email}</td>
                          <td className="py-4 px-6 text-slate-400 max-w-xs truncate">{u.address}</td>
                          <td className="py-4 px-6">
                            {u.role === 'admin' && (
                              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                System Admin
                              </span>
                            )}
                            {u.role === 'owner' && (
                              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Store Owner
                              </span>
                            )}
                            {u.role === 'user' && (
                              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                Normal User
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right font-bold text-white">
                            {u.role === 'owner' ? (
                              <div className="flex items-center justify-end gap-2">
                                <StarRating value={Math.round(u.store_rating)} readOnly size="sm" />
                                <span className="text-amber-400 font-extrabold">{u.store_rating}</span>
                              </div>
                            ) : (
                              <span className="text-slate-600 font-normal">N/A</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onSuccess={() => {
            fetchStats();
            fetchUsers();
          }}
        />
      )}

      {showAddStoreModal && (
        <AddStoreModal
          onClose={() => setShowAddStoreModal(false)}
          onSuccess={() => {
            fetchStats();
            fetchStores();
          }}
        />
      )}
    </div>
  );
};

export default AdminPortal;
