import { useEffect, useState } from 'react';
import { Activity, Clock, Users, Sun } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { 
  BarChart, Bar, 
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function UserActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<{ id: string, name: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | 'ALL'>('ALL');
  
  const [screenChartData, setScreenChartData] = useState<any[]>([]);
  const [peakHoursData, setPeakHoursData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch unique users for the dropdown
    async function fetchUsers() {
      const { data, error } = await supabase.from('nisa_users').select('id, full_name');
      if (error) console.error('Error fetching users:', error);
      if (data) {
        setUsersList(data.map(d => ({ id: d.id, name: d.full_name })));
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchData() {
      let query = supabase
        .from('user_activity_logs')
        .select(`
          *,
          nisa_users ( full_name )
        `)
        .order('created_at', { ascending: false });

      if (selectedUser !== 'ALL') {
        query = query.eq('user_id', selectedUser);
      }

      const { data, error } = await query.limit(500); // Fetch more for analytics
      
      if (error) console.error('Error fetching activity data:', error);
        
      if (data) {
        setActivities(data.slice(0, 50)); // Show only top 50 in list
        
        // 1. Aggregate for Screens Chart
        const screenAgg: Record<string, number> = {};
        // 2. Aggregate for Peak Hours Chart (0-23)
        const hoursAgg: Record<string, number> = {};
        for (let i = 0; i < 24; i++) hoursAgg[i.toString()] = 0;

        data.forEach(log => {
          // Screen Time
          screenAgg[log.screen_name] = (screenAgg[log.screen_name] || 0) + log.time_spent_seconds;
          
          if (log.created_at) {
            // Peak Hours (count activity events per hour)
            const hour = new Date(log.created_at).getHours().toString();
            hoursAgg[hour] += 1; // Or we can sum time_spent_seconds, but event count is better for "Peak Usage"
          }
        });
        
        // Format Screen Chart Data (convert to minutes)
        const sChart = Object.keys(screenAgg).map(key => ({
          name: key,
          time: Math.round(screenAgg[key] / 60) 
        })).sort((a, b) => b.time - a.time);
        
        // Format Hours Chart Data
        const hChart = Object.keys(hoursAgg).map(hour => ({
          hour: `${hour}:00`,
          activity: hoursAgg[hour]
        }));

        setScreenChartData(sChart);
        setPeakHoursData(hChart);
      }
    }
    fetchData();
  }, [selectedUser]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-500" />
          Advanced Analytics
        </h1>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
            <Users className="w-4 h-4" /> Filter by User:
          </label>
          <select 
            value={selectedUser} 
            onChange={e => setSelectedUser(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 outline-none"
          >
            <option value="ALL">All Users</option>
            {usersList.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Screens Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[350px]">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-500" />
            Time Spent by Screen (Minutes)
          </h2>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={screenChartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 13 }} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="time" fill="#0B4D3C" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {screenChartData.length === 0 && <div className="text-center text-gray-400 mt-4">Not enough data.</div>}
        </div>

        {/* Peak Hours Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[350px]">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sun className="w-5 h-5 text-orange-500" />
            Peak Usage Hours
          </h2>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="activity" stroke="#D98A5B" strokeWidth={3} dot={{ r: 4, fill: '#D98A5B' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Logs List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col min-h-[300px]">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          Live Activity Logs {selectedUser !== 'ALL' && '(Filtered)'}
        </h2>
        <div className="flex-1 overflow-auto space-y-3 pr-2">
          {activities.map(log => (
            <div key={log.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{log.nisa_users?.full_name || 'Anonymous'}</p>
                <p className="text-xs text-gray-500">Viewed <span className="font-medium text-emerald-700">{log.screen_name}</span></p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
                  {log.time_spent_seconds} sec
                </span>
                <p className="text-[10px] text-gray-400 mt-1">{log.created_at ? new Date(log.created_at).toLocaleTimeString() : 'Unknown Time'}</p>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div className="text-center text-gray-400 py-12">No activity logged yet.</div>
          )}
        </div>
      </div>

    </div>
  );
}
