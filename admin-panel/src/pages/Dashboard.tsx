import { useEffect, useState } from 'react';
import { 
  Users, BookOpen, MessageCircle, Wifi, 
  Activity, Clock, BarChart2, TrendingUp 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LineChart, Line 
} from 'recharts';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { geoContains } from 'd3-geo';
import { supabase } from '../lib/supabase';

const geoUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';
const cityCache: Record<string, string> = {};

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    totalUsers: 0,
    quranReads: 0,
    aalimaQuestions: 0,
    onlineNow: 0,
    peakTime: '--',
    lastUpdated: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  });
  
  const [hourlyData, setHourlyData] = useState<{name: string, count: number, isPeak: boolean}[]>([]);
  const [topUsers, setTopUsers] = useState<{name: string, time: number}[]>([]);
  const [dailyData, setDailyData] = useState<{name: string, visits: number}[]>([]);
  
  const [userMarkers, setUserMarkers] = useState<{lng: number, lat: number}[]>([]);
  const [tooltipData, setTooltipData] = useState<{country: string, count: number, cities: string[] | null} | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch Users
      const { data: usersData, count: usersCount } = await supabase
        .from('nisa_users')
        .select('country, last_active_at', { count: 'exact' });

      let online = 0;
      const markers: { lng: number, lat: number }[] = [];
      const now = new Date().getTime();

      if (usersData) {
        usersData.forEach(u => {
          if (u.last_active_at) {
            const lastActive = new Date(u.last_active_at).getTime();
            if (now - lastActive < 15 * 60 * 1000) online++;
          }
          if (u.country && u.country !== 'Unknown') {
            const parts = u.country.split(',');
            if (parts.length === 2) {
              const lat = parseFloat(parts[0]);
              const lng = parseFloat(parts[1]);
              if (!isNaN(lat) && !isNaN(lng)) markers.push({ lng, lat });
            }
          }
        });
      }
      setUserMarkers(markers);

      // Fetch Quran Activity (Today)
      const todayString = new Date().toISOString().split('T')[0];
      const { count: quranCount } = await supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact', head: true })
        .eq('screen_name', 'Quran Dashboard')
        .gte('created_at', todayString);

      // Fetch Aalima Queries
      const { count: queriesCount } = await supabase
        .from('aalima_queries')
        .select('*', { count: 'exact', head: true });

      // 2. Fetch Activity Logs for charts
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: logs } = await supabase
        .from('user_activity_logs')
        .select('created_at, user_id, time_spent_seconds, nisa_users(full_name)')
        .gte('created_at', sevenDaysAgo.toISOString());

      if (logs) {
        const todayStr = new Date().toDateString();
        const todayLogs = logs.filter(l => new Date(l.created_at).toDateString() === todayStr);
        
        const hourlyCounts = Array(24).fill(0);
        todayLogs.forEach(l => {
          const hour = new Date(l.created_at).getHours();
          hourlyCounts[hour]++;
        });
        
        const maxHourVal = Math.max(...hourlyCounts);
        const peakIdx = hourlyCounts.indexOf(maxHourVal);
        
        const hData = hourlyCounts.map((count, i) => ({
          name: `${i}h`,
          count,
          isPeak: count === maxHourVal && maxHourVal > 0
        }));
        setHourlyData(hData);

        let peakText = '--';
        if (maxHourVal > 0) {
          const ampm = peakIdx >= 12 ? 'PM' : 'AM';
          const hr = peakIdx % 12 || 12;
          peakText = `${hr}:00 ${ampm} - ${maxHourVal} users`;
        }

        const userTimeMap: Record<string, { time: number, name: string }> = {};
        logs.forEach(l => {
          if (!l.user_id) return;
          if (!userTimeMap[l.user_id]) {
            userTimeMap[l.user_id] = { 
              time: 0, 
              name: (l.nisa_users as any)?.full_name || 'Anonymous' 
            };
          }
          userTimeMap[l.user_id].time += (l.time_spent_seconds || 0);
        });
        
        const sortedUsers = Object.values(userTimeMap)
          .sort((a, b) => b.time - a.time)
          .slice(0, 5)
          .map(u => ({ name: u.name.split(' ')[0], time: Math.round(u.time / 60) }));
        setTopUsers(sortedUsers.reverse()); 

        const daysMap: Record<string, Set<string>> = {};
        for(let i=6; i>=0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          daysMap[dayName] = new Set();
        }

        logs.forEach(l => {
          if (!l.user_id) return;
          const d = new Date(l.created_at);
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          if (daysMap[dayName]) daysMap[dayName].add(l.user_id);
        });
        
        const dData = Object.keys(daysMap).map(day => ({
          name: day,
          visits: daysMap[day].size
        }));
        setDailyData(dData);

        setStats({
          totalUsers: usersCount || 0,
          quranReads: quranCount || 0,
          aalimaQuestions: queriesCount || 0,
          onlineNow: online,
          peakTime: peakText,
          lastUpdated: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        });
      }
    }
    fetchData();
  }, []);

  const handleMouseEnterGeo = async (geo: any) => {
    const { name } = geo.properties;
    const usersInCountry = userMarkers.filter(m => geoContains(geo, [m.lng, m.lat]));
    const count = usersInCountry.length;
    
    setTooltipData({ country: name, count, cities: null });
    if (count > 0) {
      const uniqueCoords = Array.from(new Set(usersInCountry.map(m => `${m.lat},${m.lng}`))).slice(0, 3);
      const cities = await Promise.all(uniqueCoords.map(async coord => {
        if (cityCache[coord]) return cityCache[coord];
        try {
          const [lat, lng] = coord.split(',');
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
          const data = await res.json();
          const city = data.city || data.locality || data.principalSubdivision || 'Unknown';
          cityCache[coord] = city;
          return city;
        } catch { return 'Unknown'; }
      }));
      setTooltipData(prev => prev && prev.country === name ? { ...prev, cities: Array.from(new Set(cities)) } : prev);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-6 text-xs font-medium text-gray-600 bg-white px-4 py-2.5 rounded-lg border border-gray-100 inline-flex shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          Online Now: <span className="text-gray-900 font-bold">{stats.onlineNow}</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-orange-500" />
          Peak Time: <span className="text-gray-900 font-bold">{stats.peakTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-emerald-500" />
          Last Updated: <span className="text-gray-900 font-bold">{stats.lastUpdated}</span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 leading-none">{stats.totalUsers}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Total Users</p>
          </div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 leading-none">{stats.quranReads}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Quran Reads (Today)</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 leading-none">{stats.aalimaQuestions}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Aalima Questions</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
            <Wifi className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 leading-none">{stats.onlineNow}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Online Now</p>
          </div>
        </div>
      </div>

      {/* Analytics Main Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Hourly Activity */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <BarChart2 className="w-4 h-4 text-gray-400" /> Hourly Activity
            </h2>
            <div className="text-[10px] text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded border border-orange-100">
              Peak: {stats.peakTime}
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} barSize={12}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
                <RechartsTooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#111827' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {hourlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isPeak ? '#10B981' : entry.count > 0 ? '#3B82F6' : '#D1D5DB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Two Columns: Top Users & Daily Visits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          <div className="p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-6">
              <Clock className="w-4 h-4 text-emerald-500" /> Top Users by Time Spent
            </h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topUsers} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#111827' }}
                    formatter={(val) => [`${val} Minutes`, 'Time Spent']}
                  />
                  <Bar dataKey="time" fill="#10B981" barSize={16} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-6">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Daily Visits (Last 7 Days)
            </h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} dx={-10} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#111827' }}
                  />
                  <Line type="monotone" dataKey="visits" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: '#3B82F6', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#3B82F6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Global Map (Full size container at the end) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative flex flex-col w-full min-h-[400px]"
           onMouseMove={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
           }}>
        <h2 className="text-lg font-bold text-gray-900 mb-6">User Global Distribution</h2>
        <div className="flex-1 flex items-center justify-center bg-gray-50/50 rounded-xl overflow-hidden border border-gray-100">
          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 130 }} className="w-full h-full max-h-[500px]">
            <ZoomableGroup zoom={1} minZoom={1} maxZoom={8}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => handleMouseEnterGeo(geo)}
                      onMouseLeave={() => setTooltipData(null)}
                      fill="#EAEAEC"
                      stroke="#D1D5DB"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#D1D5DB", outline: "none" },
                        pressed: { outline: "none" }
                      }}
                    />
                  ))
                }
              </Geographies>
              {userMarkers.map((marker, i) => (
                <Marker key={i} coordinates={[marker.lng, marker.lat]}>
                  <circle r={3} fill="#0B4D3C" fillOpacity={0.8} />
                  <circle r={8} fill="#0B4D3C" fillOpacity={0.2} />
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>
        
        {tooltipData && (
          <div 
            className="absolute z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{ left: tooltipPos.x, top: tooltipPos.y - 15, minWidth: '160px' }}
          >
            <div className="font-bold text-base mb-1">{tooltipData.country}</div>
            <div className="text-gray-300 mb-2">{tooltipData.count} user{tooltipData.count !== 1 ? 's' : ''}</div>
            
            {tooltipData.count > 0 && (
              <div className="pt-2 border-t border-gray-700">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Top Regions</span>
                {tooltipData.cities === null ? (
                  <span className="text-gray-400 italic text-xs">Loading...</span>
                ) : (
                  <ul className="text-xs space-y-1">
                    {tooltipData.cities.map((city, idx) => (
                      <li key={idx} className="truncate">• {city}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
