import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    FileText,
    Wallet,
    ArrowUp,
    Filter,
    Download,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface Invoice {
    id: string;
    school_name: string;
    amount: number;
    status: string;
    due_date: string;
    plan_type: string;
}

const FinanceBilling: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [stats, setStats] = useState({
        mrr: 0,
        outstanding: 0,
        pendingCount: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchFinanceData = async () => {
        setLoading(true);
        try {
            // Fetch recent invoices with school names
            const { data: invoiceData, error: invoiceError } = await supabase
                .from('invoices')
                .select(`
                    id,
                    amount,
                    status,
                    due_date,
                    items,
                    schools(name, subscription_tier)
                `)
                .order('created_at', { ascending: false })
                .limit(5);

            if (invoiceError) throw invoiceError;

            const transformed: Invoice[] = (invoiceData || []).map((inv: {
                id: string;
                amount: number;
                status: string;
                due_date: string;
                schools: { name: string; subscription_tier: string | null }[] | null | { name: string; subscription_tier: string | null };
            }) => {
                const school = Array.isArray(inv.schools) ? inv.schools[0] : inv.schools;
                return {
                    id: inv.id.substring(0, 8).toUpperCase(),
                    school_name: school?.name || 'Unknown School',
                    amount: Number(inv.amount),
                    status: inv.status.charAt(0).toUpperCase() + inv.status.slice(1),
                    due_date: format(new Date(inv.due_date), 'MMM dd, yyyy'),
                    plan_type: school?.subscription_tier ? (school.subscription_tier.charAt(0).toUpperCase() + school.subscription_tier.slice(1) + ' Plan') : 'Basic Plan'
                };
            });

            setInvoices(transformed);

            // Fetch aggregate stats
            // Monthly MRR (Paid in current month) - Simple approximation for now
            const { data: mrrData } = await supabase
                .from('invoices')
                .select('amount')
                .eq('status', 'paid');

            const totalMrr = (mrrData || []).reduce((acc, curr) => acc + Number(curr.amount), 0);

            // Outstanding
            const { data: outData } = await supabase
                .from('invoices')
                .select('amount')
                .in('status', ['pending', 'overdue']);

            const totalOut = (outData || []).reduce((acc, curr) => acc + Number(curr.amount), 0);
            const pendingCount = outData?.length || 0;

            setStats({
                mrr: totalMrr,
                outstanding: totalOut,
                pendingCount
            });

        } catch (err) {
            console.error('Error fetching finance data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinanceData();
    }, []);

    // Helper for currency formatting
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] flex">
            <Sidebar activePage="Finance" />

            <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
                <Header title="Finance & Billing" />

                <div className="p-6 md:p-10">
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Financial Controls</h1>
                            <p className="text-muted mt-1 font-medium">Manage network revenue, invoices, and school subscriptions.</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="clay-btn-outline py-2.5 px-5 flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                <span>Filter</span>
                            </button>
                            <button className="clay-btn py-2.5 px-6 flex items-center gap-2 shadow-lg">
                                <Download className="w-4 h-4" />
                                <span>Export Report</span>
                            </button>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="clay-card p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl shadow-inner shadow-teal-900/5">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-bold text-muted uppercase tracking-wider">Total Revenue</span>
                            </div>
                            <div className="text-4xl font-extrabold text-foreground mb-2">{formatCurrency(stats.mrr)}</div>
                            <div className="text-sm font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100 italic">
                                <ArrowUp className="w-3 h-3" /> +14.2% Growth
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="clay-card p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shadow-inner shadow-amber-900/5">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-bold text-muted uppercase tracking-wider">Outstanding</span>
                            </div>
                            <div className="text-4xl font-extrabold text-foreground mb-2">{formatCurrency(stats.outstanding)}</div>
                            <div className="text-sm font-bold text-amber-600 flex items-center gap-1 bg-amber-50 w-fit px-3 py-1 rounded-full border border-amber-100 italic">
                                {stats.pendingCount} Pending Payments
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="clay-card p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-inner shadow-indigo-900/5">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-bold text-muted uppercase tracking-wider">Annual ARR</span>
                            </div>
                            <div className="text-4xl font-extrabold text-foreground mb-2 font-mono">{formatCurrency(stats.mrr * 12)}</div>
                            <div className="text-sm font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 w-fit px-3 py-1 rounded-full border border-indigo-100 italic">
                                Projecting Q4 Target
                            </div>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="clay-card overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/20">
                            <h3 className="text-xl font-bold text-foreground">Recent Transactions</h3>
                            <button className="text-primary text-sm font-bold hover:underline transition-all">See All Activity</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#FAF9F6]">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-xs font-black text-muted uppercase tracking-widest">Invoice ID</th>
                                        <th className="px-8 py-5 text-left text-xs font-black text-muted uppercase tracking-widest">School Name</th>
                                        <th className="px-8 py-5 text-left text-xs font-black text-muted uppercase tracking-widest">Plan Tier</th>
                                        <th className="px-8 py-5 text-left text-xs font-black text-muted uppercase tracking-widest">Due Date</th>
                                        <th className="px-8 py-5 text-left text-xs font-black text-muted uppercase tracking-widest">Amount</th>
                                        <th className="px-8 py-5 text-left text-xs font-black text-muted uppercase tracking-widest text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-12 text-center text-muted italic">Loading records...</td>
                                        </tr>
                                    ) : invoices.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-12 text-center text-muted italic text-lg py-20 bg-stone-50/30">
                                                <Wallet className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                No financial records found in the system.
                                            </td>
                                        </tr>
                                    ) : (
                                        invoices.map((tx, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-8 py-5 text-sm font-extrabold text-foreground">#INV-{tx.id}</td>
                                                <td className="px-8 py-5 text-sm text-stone-600 font-bold">{tx.school_name}</td>
                                                <td className="px-8 py-5"><span className="text-[10px] font-black text-muted bg-stone-100 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">{tx.plan_type}</span></td>
                                                <td className="px-8 py-5 text-sm text-muted font-medium italic">{tx.due_date}</td>
                                                <td className="px-8 py-5 text-sm font-black text-primary">{formatCurrency(tx.amount)}</td>
                                                <td className="px-8 py-5">
                                                    <div className="flex justify-center">
                                                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm
                                                            ${tx.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : tx.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                                            {tx.status === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> : tx.status === 'Pending' ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                            {tx.status}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 bg-[#FAF9F6] border-t border-gray-100 text-center">
                            <span className="text-xs text-muted font-bold italic opacity-60">End of recent ledger transactions. Securely encrypted.</span>
                        </div>
                    </motion.div>
                </div>

                <footer className="mt-auto border-t border-gray-200 py-6 text-center text-sm text-muted font-medium bg-[#FAF9F6]">
                    © 2024 EduNex Systems. Super Admin Financial Access Level 1.
                </footer>
            </main>
        </div>
    );
};

export default FinanceBilling;
