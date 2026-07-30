import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserActivity from './pages/UserActivity';
import Notifications from './pages/Notifications';
import AalimaModeration from './pages/AalimaModeration';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/activity" element={<UserActivity />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/aalima" element={<AalimaModeration />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
