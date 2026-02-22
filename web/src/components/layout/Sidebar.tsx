import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, MessageCircle, MapPin, Bell, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/planner', icon: CalendarDays, label: 'Planner' },
  { to: '/feed', icon: MessageCircle, label: 'Feed' },
  { to: '/needle', icon: MapPin, label: 'Needle' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Famify Logo" className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-display font-extrabold text-emerald-600 tracking-tight">Famify</h1>
            <p className="text-xs text-slate-600 font-medium">Family Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors',
                isActive
                  ? 'bg-emerald-50 text-emerald-600 border-l-4 border-emerald-500'
                  : 'text-slate-600 hover:bg-slate-50'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
