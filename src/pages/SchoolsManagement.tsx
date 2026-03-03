import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    School as SchoolIcon,
    Search,
    MapPin,
    Eye,
    Edit2,
    Ban
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { supabase } from '../lib/supabase';
import { format, addYears } from 'date-fns';

interface School {
    id: string;
    name: string;
    location: string;
    students: number;
    status: string;
    expiry: string;
}

const SchoolsManagement: React.FC = () => {
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const fetchSchools = async () => {
        setLoading(true);
        try {
            // Fetch schools with profile count for students
            const { data, error } = await supabase
                .from('schools')
                .select(`
                    *,
                    profiles(count)
                `);

            if (error) throw error;

            const transformed: School[] = (data || []).map((s: {
                id: string;
                name: string;
                status: string;
                created_at: string;
                metadata: { city?: string } | null;
                profiles: { count: number }[] | null;
            }) => ({
                id: s.id,
                name: s.name,
                location: s.metadata?.city || 'Universal',
                students: s.profiles && s.profiles[0] ? s.profiles[0].count : 0,
                status: s.status,
                expiry: format(addYears(new Date(s.created_at), 1), 'MMM dd, yyyy')
            }));

            setSchools(transformed);
        } catch (err) {
            console.error('Error fetching schools:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const filteredSchools = schools.filter(school => {
        const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            school.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || school.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-[#FAF9F6] flex">
            <Sidebar activePage="Schools" />

            <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
                <Header title="Schools Management" />

                <div className="p-6 md:p-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-end md:items-center"
                    >
                        <div className="w-full md:w-96">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block px-1">Search Schools</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by name or city..."
                                    className="clay-input pl-11 py-3 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
                            {["All", "Active", "Pending", "Warning", "Suspended"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                    ${filterStatus === status
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'bg-white text-muted hover:bg-gray-100 shadow-sm border border-gray-50'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="clay-card overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="p-20 flex items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="px-6 py-5 text-xs font-bold text-muted uppercase tracking-wider">School Information</th>
                                            <th className="px-6 py-5 text-xs font-bold text-muted uppercase tracking-wider">Students</th>
                                            <th className="px-6 py-5 text-xs font-bold text-muted uppercase tracking-wider">License Expiry</th>
                                            <th className="px-6 py-5 text-xs font-bold text-muted uppercase tracking-wider text-center">Status</th>
                                            <th className="px-6 py-5 text-xs font-bold text-muted uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredSchools.map((school) => (
                                            <tr key={school.id} className="hover:bg-gray-50/30 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-primary flex items-center justify-center font-bold text-lg">
                                                            <SchoolIcon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-foreground">{school.name}</div>
                                                            <div className="text-xs text-muted font-medium flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" />
                                                                {school.location}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-sm font-semibold text-foreground">{school.students.toLocaleString()}</div>
                                                    <div className="text-[10px] text-muted uppercase font-bold tracking-tight">Enrolled</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className={`text-sm font-semibold ${school.expiry === 'Expired' ? 'text-rose-500' : 'text-foreground'}`}>
                                                        {school.expiry}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex justify-center">
                                                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider
                                ${school.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                                                school.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                                    school.status === 'Warning' ? 'bg-orange-100 text-orange-700' :
                                                                        'bg-rose-100 text-rose-700'}`}>
                                                            {school.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="w-8 h-8 rounded-lg bg-white border border-gray-100 text-muted hover:text-primary hover:border-primary transition-all flex items-center justify-center" title="View Details">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button className="w-8 h-8 rounded-lg bg-white border border-gray-100 text-muted hover:text-amber-600 hover:border-amber-600 transition-all flex items-center justify-center" title="Edit">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button className="w-8 h-8 rounded-lg bg-white border border-gray-100 text-muted hover:text-rose-600 hover:border-rose-600 transition-all flex items-center justify-center" title="Suspend">
                                                            <Ban className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-sm text-muted font-medium">
                                Showing <span className="text-foreground font-bold">{filteredSchools.length}</span> of 152 schools
                            </div>
                            <div className="flex gap-2">
                                <button className="clay-btn-outline py-2 px-4 text-xs opacity-50 cursor-not-allowed">Previous</button>
                                <button className="clay-btn-outline py-2 px-4 text-xs">Next</button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-auto border-t border-gray-200 py-6 text-center text-sm text-muted font-medium bg-[#FAF9F6]">
                    © 2024 EduNex Systems. Central Management Module.
                </div>
            </main>
        </div>
    );
};

export default SchoolsManagement;
