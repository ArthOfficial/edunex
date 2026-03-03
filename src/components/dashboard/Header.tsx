import React from 'react';
import { Search, Bell, ShieldCheck } from 'lucide-react';

interface HeaderProps {
    title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Dashboard Overview' }) => {
    return (
        <header className="sticky top-0 z-30 bg-[#FAF9F6]/80 backdrop-blur-lg border-b border-gray-200 px-8 py-4 flex items-center justify-between">
            <div className="font-bold text-xl text-foreground">{title}</div>

            <div className="flex-1 max-w-xl mx-8 relative">
                <input
                    type="text"
                    className="clay-input w-full py-2.5 pl-10 pr-12 text-sm"
                    placeholder="Search students, fees, results..."
                />
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white px-1.5 py-0.5 rounded border border-gray-200 text-[10px] font-bold text-gray-400 shadow-sm">
                    ⌘K
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 bg-teal-50 text-primary px-3 py-1.5 rounded-full border border-teal-100 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">Administrator · Westwood Academy</span>
                </div>
                <button className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center text-muted shadow-sm border border-gray-100 hover:text-primary transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
