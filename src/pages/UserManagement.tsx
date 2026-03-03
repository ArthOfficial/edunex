import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    MoreVertical,
    Key,
    X,
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface User {
    id: string;
    full_name: string | null;
    role: string;
    school_name: string | null;
    status: string;
    updated_at: string;
    email: string;
    avatar_url: string | null;
}

const UserDrawer: React.FC<{ user: User; isOpen: boolean; onClose: () => void }> = ({ user, isOpen, onClose }) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[60] bg-stone-900/40 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 h-full w-full max-w-md z-[70] bg-[#FAF9F6] border-l border-gray-200 p-8 flex flex-col shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-foreground">User Settings</h2>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:text-rose-500 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-10 p-4 clay-card">
                        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {user.avatar_url || (user.full_name ? user.full_name.substring(0, 2).toUpperCase() : '??')}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">{user.full_name || 'No Name'}</h3>
                            <p className="text-sm text-muted">{user.email}</p>
                        </div>
                    </div>

                    <div className="space-y-8 flex-1 overflow-y-auto pr-2 hide-scrollbar">
                        <div>
                            <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-4">Permissions</label>
                            <div className="space-y-4">
                                {['Manage Schools', 'View Analytics', 'Finance Access', 'User Admin'].map((perm, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100 italic">
                                        <span className="text-sm font-medium text-foreground">{perm}</span>
                                        <div className="w-10 h-5 bg-emerald-500 rounded-full relative flex items-center px-1">
                                            <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-4">Security</label>
                            <button className="w-full clay-btn-outline justify-center gap-2 py-3 text-sm flex items-center">
                                <Key className="w-3 h-3" />
                                Reset User Password
                            </button>
                            <button className="w-full mt-3 text-rose-500 text-sm font-semibold py-3 hover:bg-rose-50 rounded-xl transition-colors">
                                Deactivate Account
                            </button>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-200">
                        <button onClick={onClose} className="w-full clay-btn py-3">Save Changes</button>
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*, schools(name)');

            if (error) throw error;

            const transformedUsers: User[] = (data || []).map((u: {
                id: string;
                full_name: string | null;
                role: string;
                email: string;
                avatar_url: string | null;
                updated_at: string;
                schools: { name: string } | null;
            }) => ({
                id: u.id,
                full_name: u.full_name,
                role: u.role,
                school_name: u.schools?.name || 'Platform',
                status: 'Active', // Mocking status for now as DB doesn't track live presence
                updated_at: u.updated_at,
                email: u.email,
                avatar_url: u.avatar_url
            }));

            setUsers(transformedUsers);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        (u.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] flex">
            <Sidebar activePage="Users" />

            <main className="flex-1 lg:ml-72 flex flex-col p-6 md:p-10">
                <Header title="User Management" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 mt-8">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Staff & Administrators</h2>
                        <p className="text-muted mt-1 text-sm">Manage network administrators and teaching staff</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-64 md:w-80">
                            <Search className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="clay-input pl-11 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="clay-btn whitespace-nowrap py-2.5 px-6 flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            <span>Add User</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredUsers.map(user => (
                            <motion.div
                                key={user.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="clay-card p-5 group flex flex-col items-center text-center relative hover:shadow-glow/20"
                            >
                                <div className="absolute top-4 right-4">
                                    <button onClick={() => setSelectedUser(user)} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-muted hover:text-primary hover:shadow-md transition-all">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="relative mb-4">
                                    <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg">
                                        {user.avatar_url || (user.full_name ? user.full_name.substring(0, 2).toUpperCase() : '??')}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white 
                      ${user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Away' ? 'bg-amber-400' : 'bg-gray-300'}`}>
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg text-foreground mb-1">{user.full_name || 'Anonymous'}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest
                      ${user.role === 'superadmin' ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'}`}>
                                        {user.role}
                                    </span>
                                </div>

                                <div className="w-full space-y-3 pt-4 border-t border-gray-100 mt-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted">Affiliation</span>
                                        <span className="font-bold text-stone-700">{user.school_name}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted">Last Active</span>
                                        <span className="text-stone-500 italic">
                                            {user.updated_at ? formatDistanceToNow(new Date(user.updated_at), { addSuffix: true }) : 'Never'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <UserDrawer
                    user={selectedUser as User}
                    isOpen={!!selectedUser}
                    onClose={() => setSelectedUser(null)}
                />

                <div className="mt-auto pt-10 text-center text-sm text-muted font-medium italic opacity-70">
                    © 2024 EduNex Systems. Administrative Controls Active.
                </div>
            </main>
        </div>
    );
};

export default UserManagement;
