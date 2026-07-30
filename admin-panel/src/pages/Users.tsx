import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Bell, BellOff, Clock, Download, ArrowUpDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

type SortField = 'name' | 'madhab' | 'joined' | 'time' | 'lastActive';
type SortOrder = 'asc' | 'desc';

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [activityStats, setActivityStats] = useState<Record<string, number>>({});
  const [sortField, setSortField] = useState<SortField>('joined');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    async function fetchUsersAndActivity() {
      // 1. Fetch Users
      const { data: userData, error: userError } = await supabase
        .from('nisa_users')
        .select('*');
      
      if (userError) console.error('Error fetching users:', userError);
      if (userData) setUsers(userData);

      // 2. Fetch all activity logs to aggregate time spent per user
      const { data: activityData, error: activityError } = await supabase
        .from('user_activity_logs')
        .select('user_id, time_spent_seconds');

      if (activityError) console.error('Error fetching activity logs:', activityError);
      if (activityData) {
        const stats: Record<string, number> = {};
        activityData.forEach(log => {
          if (log.user_id) {
            stats[log.user_id] = (stats[log.user_id] || 0) + log.time_spent_seconds;
          }
        });
        setActivityStats(stats);
      }
    }
    fetchUsersAndActivity();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    let valA: any = '';
    let valB: any = '';

    if (sortField === 'name') {
      valA = (a.full_name || '').toLowerCase();
      valB = (b.full_name || '').toLowerCase();
    } else if (sortField === 'madhab') {
      valA = (a.madhab || '').toLowerCase();
      valB = (b.madhab || '').toLowerCase();
    } else if (sortField === 'joined') {
      valA = new Date(a.joined_at || 0).getTime();
      valB = new Date(b.joined_at || 0).getTime();
    } else if (sortField === 'lastActive') {
      valA = new Date(a.last_active_at || 0).getTime();
      valB = new Date(b.last_active_at || 0).getTime();
    } else if (sortField === 'time') {
      valA = activityStats[a.id] || 0;
      valB = activityStats[b.id] || 0;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filtered = sortedUsers.filter(u => 
    (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimeSpent = (seconds: number) => {
    if (!seconds) return '0 mins';
    if (seconds < 60) return '< 1 min';
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins % 60}m`;
    }
    return `${mins} mins`;
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Madhab', 'Location', 'Time Spent (s)', 'Joined Date', 'Last Active', 'Notifications'];
    const rows = filtered.map(u => [
      `"${u.full_name || ''}"`,
      `"${u.email || ''}"`,
      `"${u.madhab || ''}"`,
      `"${u.country || ''}"`,
      activityStats[u.id] || 0,
      `"${u.joined_at ? new Date(u.joined_at).toLocaleString() : 'Unknown'}"`,
      `"${u.last_active_at ? new Date(u.last_active_at).toLocaleString() : 'Unknown'}"`,
      u.notifications_enabled ? 'Enabled' : 'Disabled'
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nisa_users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Users Directory</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 font-medium sticky top-0 backdrop-blur-sm z-10">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Name <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={() => handleSort('madhab')}>
                  <div className="flex items-center gap-2">Madhab <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={() => handleSort('time')}>
                  <div className="flex items-center gap-2">Time Spent <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={() => handleSort('joined')}>
                  <div className="flex items-center gap-2">Joined <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={() => handleSort('lastActive')}>
                  <div className="flex items-center gap-2">Last Active <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-6 py-4">Notifications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(user => {
                const totalSeconds = activityStats[user.id] || 0;

                return (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{user.full_name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {user.madhab || 'Hanafi'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <MapPin className="w-3.5 h-3.5" />
                        {user.country || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-medium bg-emerald-50/50 px-2 py-1 rounded-lg w-fit border border-emerald-100/50">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTimeSpent(totalSeconds)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {user.joined_at ? new Date(user.joined_at).toLocaleDateString() : 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {user.last_active_at ? new Date(user.last_active_at).toLocaleDateString() : 'Never'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.notifications_enabled ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
                          <Bell className="w-4 h-4" /> Enabled
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-gray-400 font-medium text-xs">
                          <BellOff className="w-4 h-4" /> Disabled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No users found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
