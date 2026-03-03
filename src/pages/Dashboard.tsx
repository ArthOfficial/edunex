import React, { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { Users, Presentation, PieChart, Coins, ClipboardCheck, HandCoins, BarChart3, UserPlus, Video, Send, ArrowUp, Receipt, Scroll, Megaphone, Settings as SettingsIcon, type LucideIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const KPI: React.FC<{
    icon: LucideIcon;
    color: string;
    title: string;
    subtitle: string;
    badge?: string;
    badgeColor?: string;
    badgeIcon?: LucideIcon;
}> = ({ icon: Icon, color, title, subtitle, badge, badgeColor, badgeIcon: BadgeIcon }) => (
    <div className="clay-card p-5 flex flex-col justify-between h-full relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-2xl bg-${color}-50 flex items-center justify-center text-${color}-600 text-xl shadow-inner transition-transform group-hover:scale-110`}>
                <Icon className="w-6 h-6" />
            </div>
            {badge && (
                <div className={`flex items-center gap-1 text-xs font-bold ${badgeColor ? `text-${badgeColor}-600 bg-${badgeColor}-50` : 'text-emerald-600 bg-emerald-50'} px-2 py-1 rounded-lg border border-${badgeColor ? badgeColor : 'emerald'}-100`}>
                    {BadgeIcon && <BadgeIcon className="w-3 h-3" />}
                    {badge}
                </div>
            )}
        </div>
        <div>
            <h3 className="text-3xl font-extrabold text-foreground mb-1">{title}</h3>
            <p className="text-xs text-muted font-medium">{subtitle}</p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ schools: 0, users: 0, attendanceRate: 0, totalRevenue: 0, paidInvoices: 0, pendingInvoices: 0 });
    const [weeklyData, setWeeklyData] = useState([{ absent: 0, present: 0 }, { absent: 0, present: 0 }, { absent: 0, present: 0 }, { absent: 0, present: 0 }, { absent: 0, present: 0 }, { absent: 0, present: 0 }]);

    useEffect(() => {
        const fetchStats = async () => {
            const [schoolsRes, usersRes, attendanceRes, invoicesRes] = await Promise.all([
                supabase.from('schools').select('id', { count: 'exact', head: true }),
                supabase.from('profiles').select('id', { count: 'exact', head: true }),
                supabase.from('attendance').select('status'),
                supabase.from('invoices').select('amount, status'),
            ]);

            const totalAttendance = attendanceRes.data?.length || 0;
            const presentCount = attendanceRes.data?.filter(a => a.status === 'present').length || 0;
            const rate = totalAttendance > 0 ? (presentCount / totalAttendance * 100) : 0;

            const totalRevenue = invoicesRes.data?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
            const paidInvoices = invoicesRes.data?.filter(i => i.status === 'paid').length || 0;
            const pendingInvoices = invoicesRes.data?.filter(i => i.status === 'pending').length || 0;

            setStats({
                schools: schoolsRes.count || 0,
                users: usersRes.count || 0,
                attendanceRate: Math.round(rate * 10) / 10,
                totalRevenue,
                paidInvoices,
                pendingInvoices,
            });

            // Build weekly chart from attendance data
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const weekly = days.map((_, i) => {
                const dayRecords = attendanceRes.data?.filter((a: { status: string; date?: string; created_at?: string }) => {
                    const dateStr = a.date || a.created_at;
                    if (!dateStr) return false;
                    const d = new Date(dateStr);
                    return d.getDay() === (i + 1);
                }) || [];
                const pres = dayRecords.filter(r => r.status === 'present').length;
                const abs = dayRecords.filter(r => r.status === 'absent').length;
                const total = pres + abs || 1;
                return { present: Math.round(pres / total * 100), absent: Math.round(abs / total * 100) };
            });
            setWeeklyData(weekly);
        };
        fetchStats();
    }, []);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const userName = user?.fullName || user?.email?.split('@')[0] || 'Admin';

    return (
        <div className="flex min-h-screen bg-background relative selection:bg-teal-100 selection:text-primary">
            <div className="beam beam-left fixed"></div>
            <div className="beam beam-right fixed"></div>

            <Sidebar activePage="Dashboard" />

            <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
                <Header title="Dashboard Overview" />

                <main className="flex-1 p-8 space-y-8 overflow-y-auto pb-24">

                    {/* Welcome Card */}
                    <div className="clay-card p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 animate-fade-up">
                        <div className="relative z-10 w-full md:w-auto">
                            <h1 className="text-3xl font-bold text-foreground mb-1">{greeting()}, {userName}! 👋</h1>
                            <p className="text-muted">Here's a quick overview of your platform's performance today.</p>
                        </div>
                        <div className="relative z-10 flex flex-col items-end w-full md:w-auto">
                            <span className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Current Academic Year</span>
                            <div className="bg-primary text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg shadow-teal-900/20">
                                2025-26
                            </div>
                        </div>
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-50"></div>
                    </div>

                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-fade-up delay-100">
                        <KPI
                            icon={Users} color="teal"
                            title={stats.schools.toLocaleString()} subtitle="Total Schools"
                        />
                        <KPI
                            icon={Presentation} color="teal"
                            title={stats.users.toLocaleString()} subtitle="Total Users"
                        />
                        <KPI
                            icon={PieChart} color="teal"
                            title={stats.attendanceRate > 0 ? `${stats.attendanceRate}%` : 'N/A'} subtitle="Attendance Rate"
                            badge={stats.attendanceRate > 0 ? `${stats.attendanceRate}%` : undefined} badgeIcon={ArrowUp}
                        />
                        <KPI
                            icon={Coins} color="teal"
                            title={stats.totalRevenue > 0 ? `₹${(stats.totalRevenue / 100000).toFixed(1)}L` : '₹0'}
                            subtitle={`Paid: ${stats.paidInvoices} • Pending: ${stats.pendingInvoices}`}
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="clay-card p-6 animate-fade-up delay-200">
                        <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <button className="clay-btn px-6 py-2.5 text-sm font-bold flex items-center gap-2 bg-primary hover:bg-teal-800">
                                <ClipboardCheck className="w-4 h-4" /> Mark Attendance
                            </button>
                            <button className="clay-btn-outline px-6 py-2.5 text-sm font-bold flex items-center gap-2">
                                <HandCoins className="w-4 h-4" /> Collect Fees
                            </button>
                            <button className="clay-btn-outline px-6 py-2.5 text-sm font-bold flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" /> View Results
                            </button>
                            <button className="clay-btn-outline px-6 py-2.5 text-sm font-bold flex items-center gap-2">
                                <UserPlus className="w-4 h-4" /> Add Student
                            </button>
                            <button className="clay-btn-outline px-6 py-2.5 text-sm font-bold flex items-center gap-2">
                                <Video className="w-4 h-4" /> Start Class
                            </button>
                            <button className="clay-btn-outline px-6 py-2.5 text-sm font-bold flex items-center gap-2">
                                <Send className="w-4 h-4" /> Send Notice
                            </button>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 animate-fade-up delay-300">

                        {/* Left Column (Charts & Activity) */}
                        <div className="xl:col-span-3 space-y-8">
                            {/* Attendance Chart */}
                            <div className="clay-card p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Weekly Attendance</h3>
                                        <p className="text-xs text-muted">Student attendance this week</p>
                                    </div>
                                    <div className="flex gap-4 text-xs font-bold">
                                        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Present</div>
                                        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Absent</div>
                                    </div>
                                </div>
                                <div className="h-64 flex items-end justify-between px-2 gap-4">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                            <div className="w-full flex gap-1 items-end justify-center h-full relative">
                                                <div className="w-3 bg-rose-400 rounded-t-full opacity-80 group-hover:opacity-100 transition-all bar-animate" style={{ height: `${weeklyData[i]?.absent || 5}%` }}></div>
                                                <div className="w-3 bg-primary rounded-t-full group-hover:shadow-[0_0_15px_rgba(15,118,110,0.5)] transition-all bar-animate" style={{ height: `${weeklyData[i]?.present || 50}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-muted group-hover:text-primary transition-colors">{day}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="clay-card p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
                                    <a href="#" className="text-primary text-sm font-bold hover:underline">View All</a>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { color: 'emerald', text: "New student Rahul Sharma enrolled in Class 10-A", time: "5 minutes ago", icon: UserPlus },
                                        { color: 'blue', text: "Fee payment of ₹25,000 received", time: "15 minutes ago", icon: Receipt },
                                        { color: 'purple', text: "Exam results published for Mid-Term 2024", time: "1 hour ago", icon: Scroll },
                                        { color: 'amber', text: "Holiday notice sent to all parents", time: "2 hours ago", icon: Megaphone }
                                    ].map((item, i) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={i} className="flex gap-4 items-start group">
                                                <div className={`mt - 1.5 w - 8 h - 8 rounded - full bg - ${item.color} -50 flex items - center justify - center text - ${item.color} -600`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer">
                                                        {item.text}
                                                    </p>
                                                    <span className="text-xs text-muted font-medium mt-1 block">{item.time}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Collection & Stats) */}
                        <div className="xl:col-span-2 space-y-8">
                            {/* Fee Collection Pie Chart */}
                            <div className="clay-card p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Fee Collection</h3>
                                        <p className="text-xs text-muted">This Month</p>
                                    </div>
                                    <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                                        <SettingsIcon className="w-4 h-4 text-muted" />
                                    </div>
                                </div>

                                <div className="relative w-48 h-48 mx-auto mb-6">
                                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                        <path className="text-rose-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" />
                                        <path className="text-amber-400" strokeDasharray="10, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" />
                                        <path className="text-primary" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-extrabold text-foreground">85%</span>
                                        <span className="text-xs font-bold text-muted uppercase tracking-wider">Collected</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-teal-50 border border-teal-100">
                                        <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
                                            <span className="w-2 h-2 rounded-full bg-primary"></span> Paid
                                        </div>
                                        <span className="text-sm font-extrabold text-primary">₹45.8L</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-amber-50 border border-amber-100">
                                        <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                                            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Partial
                                        </div>
                                        <span className="text-sm font-extrabold text-primary">₹4.2L</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-rose-50 border border-rose-100">
                                        <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                                            <span className="w-2 h-2 rounded-full bg-rose-400"></span> Pending
                                        </div>
                                        <span className="text-sm font-extrabold text-rose-600">₹8.0L</span>
                                    </div>
                                </div>
                            </div>

                            {/* Top Performers */}
                            <div className="clay-card p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Top Performers</h3>
                                        <p className="text-xs text-muted">This Semester</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { rank: "🥇", name: "Ananya Singh", class: "12-A", score: "98.5%", initial: "AS", color: "amber" },
                                        { rank: "🥈", name: "Vikram Kumar", class: "12-B", score: "96.2%", initial: "VK", color: "slate" },
                                        { rank: "🥉", name: "Priya Mehta", class: "11-A", score: "95.8%", initial: "PM", color: "orange" },
                                    ].map((student, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                                            <span className="text-xl">{student.rank}</span>
                                            <div className={`w - 10 h - 10 rounded - full bg - ${student.color} -100 flex items - center justify - center text - ${student.color} -700 font - bold text - xs shadow - sm`}>
                                                {student.initial}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-bold text-foreground truncate">{student.name}</div>
                                                <div className="text-xs text-muted">Class {student.class}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-extrabold text-primary">{student.score}</div>
                                                <div className="text-[10px] text-muted font-medium">Avg Score</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Upcoming Events */}
                            <div className="clay-card p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-foreground">Upcoming Events</h3>
                                    <a href="#" className="text-primary text-sm font-bold hover:underline">View Calendar</a>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { title: "Annual Sports Day", date: "Dec 20, 2024", tag: "2 days", color: "rose" },
                                        { title: "Parent-Teacher Meeting", date: "Dec 23, 2024", tag: "5 days", color: "amber" },
                                        { title: "Winter Vacation Starts", date: "Dec 25, 2024", tag: "1 week", color: "teal" },
                                        { title: "Final Exams Begin", date: "Jan 10, 2025", tag: "3 weeks", color: "purple" },
                                    ].map((event, i) => (
                                        <div key={i} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className={`w - 1 h - 10 rounded - full bg - ${event.color} -400`}></div>
                                                <div>
                                                    <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</div>
                                                    <div className="text-xs text-muted font-medium">{event.date}</div>
                                                </div>
                                            </div>
                                            <span className={`px - 2 py - 1 text - [10px] font - bold rounded - lg bg - ${event.color} -50 text - ${event.color} -600 border border - ${event.color} -100`}>
                                                {event.tag}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Dashboard;
