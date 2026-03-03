export type UserRole = 'superadmin' | 'admin' | 'teacher' | 'student' | 'parent' | 'receptionist' | 'accountant';

export interface RouteConfig {
    path: string;
    label: string;
    icon?: string;
    roles: UserRole[];
}

// ─────────────────────────────────────────────────────────────
// 📝 Author: Narco / Arth
// 🔗 GitHub: https://github.com/ArthOfficial
// 🌐 Website: https://arth-hub.vercel.app
// © 2026 Arth — All rights reserved.
// ─────────────────────────────────────────────────────────────

export const DASHBOARD_ROUTES: RouteConfig[] = [
    { path: '/super-admin', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['superadmin'] },
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['admin', 'teacher', 'student', 'parent', 'receptionist'] },
    { path: '/database', label: 'Database', icon: 'Database', roles: ['superadmin'] },
    { path: '/schools', label: 'Schools', icon: 'School', roles: ['superadmin'] },
    { path: '/users', label: 'Users', icon: 'Users', roles: ['superadmin'] },
    { path: '/finance', label: 'Finance', icon: 'Coins', roles: ['superadmin', 'admin'] },
    { path: '/attendance', label: 'Attendance', icon: 'CheckSquare', roles: ['admin', 'teacher'] },
    { path: '/alerts', label: 'System Alerts', icon: 'AlertTriangle', roles: ['superadmin', 'admin'] },
    { path: '/settings', label: 'Global Setup', icon: 'Settings', roles: ['superadmin', 'admin'] },
];
