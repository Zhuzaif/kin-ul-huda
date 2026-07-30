import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Bell, MessageSquare, LogOut, Activity } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/activity', icon: Activity, label: 'User Activity' },
    { to: '/aalima', icon: MessageSquare, label: 'Ask Aalima' },
    { to: '/notifications', icon: Bell, label: 'Push Notifications' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-nisa-green tracking-tight">Nisa Admin</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                isActive
                  ? 'bg-nisa-green text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-gray-50 transition-colors font-medium text-sm">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
