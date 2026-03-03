import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Coins,
    FileText,
    Settings,
    Bell,
    LogOut,
    School as SchoolIcon,
    AlertTriangle,
    Crown,
    CheckSquare,
    Database as DatabaseIcon
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DASHBOARD_ROUTES } from '../../config/roles';

interface SidebarProps {
    activePage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage = 'Dashboard' }) => {
    const { user, role, signOut, isTransitioning } = useAuth();
    const location = useLocation();

    // Map icon strings to components
    const iconMap: Record<string, LucideIcon> = {
        'LayoutDashboard': LayoutDashboard,
        'Database': DatabaseIcon,
        'Users': Users,
        'BookOpen': BookOpen,
        'GraduationCap': GraduationCap,
        'Coins': Coins,
        'FileText': FileText,
        'Settings': Settings,
        'Bell': Bell,
        'School': SchoolIcon,
        'AlertTriangle': AlertTriangle,
        'CheckSquare': CheckSquare
    };

    const allowedRoutes = DASHBOARD_ROUTES.filter(route =>
        role ? route.roles.includes(role) : false
    );

    // Group routes for UI
    const menuGroups = [
        {
            title: "Main Menu",
            items: allowedRoutes.filter(r => ['Dashboard', 'Database', 'Schools', 'Users'].includes(r.label))
        },
        {
            title: "Operations",
            items: allowedRoutes.filter(r => ['Finance', 'Attendance'].includes(r.label))
        },
        {
            title: "System",
            items: allowedRoutes.filter(r => ['System Alerts', 'Global Setup'].includes(r.label))
        }
    ].filter(g => g.items.length > 0);

    return (
        <aside className="fixed top-0 left-0 h-full w-72 bg-[#FAF9F6]/95 backdrop-blur-xl border-r border-gray-200 z-50 hidden lg:flex flex-col">
            <div className="p-6">
                <Link to="/" className="flex items-center gap-3 mb-10 px-2 group">
                    <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-teal-900/20 group-hover:scale-110 transition-transform">
                        <GraduationCap className="text-white w-6 h-6" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight text-foreground">EduNex</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-6 overflow-y-auto custom-scroll">
                {menuGroups.map((group, idx) => (
                    <div key={idx}>
                        <div className="px-4 mb-2 text-xs font-bold text-muted uppercase tracking-widest opacity-80">
                            {group.title}
                        </div>
                        <div className="space-y-1">
                            {group.items.map((item, i) => {
                                const Icon = iconMap[item.icon || 'LayoutDashboard'] || LayoutDashboard;
                                const isActive = item.label === activePage || location.pathname === item.path;
                                return (
                                    <Link
                                        key={i}
                                        to={item.path}
                                        className={`nav-item flex items-center justify-between px-4 py-3 text-sm font-medium transition-all ${isActive ? 'active bg-white shadow-soft text-primary font-bold' : 'hover:bg-white/50 text-muted'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted'}`} />
                                            {item.label}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="mt-auto p-6 border-t border-gray-100">
                <div className="clay-card p-4 flex items-center gap-3 relative overflow-hidden group">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-stone-800 to-stone-600 flex items-center justify-center text-white font-bold shadow-md">
                            {user?.fullName?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || 'SC'}
                        </div>
                        {role === 'superadmin' && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <Crown className="w-3 h-3 text-amber-900" />
                            </div>
                        )}
                    </div>
                    <div className="overflow-hidden flex-1">
                        <div className="text-sm font-bold text-foreground truncate capitalize">{user?.fullName || user?.email?.split('@')[0] || 'System Core'}</div>
                        <div className="text-[10px] text-muted truncate uppercase font-bold tracking-wider">{role}</div>
                    </div>
                    <button
                        onClick={() => signOut()}
                        disabled={isTransitioning}
                        className="w-8 h-8 rounded-lg text-muted hover:text-rose-500 hover:bg-rose-50 transition-colors flex items-center justify-center disabled:opacity-50"
                        title="Logout"
                    >
                        {isTransitioning ? (
                            <div className="w-4 h-4 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
                        ) : (
                            <LogOut className="w-4 h-4" />
                        )}
                    </button>
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none"></div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
