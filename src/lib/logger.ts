import { supabase } from './supabase';

type LogLevel = 'info' | 'warn' | 'error';
type LogCategory = 'auth' | 'tenant' | 'system' | 'database' | 'edge_function';

interface LogEntry {
    level: LogLevel;
    category: LogCategory;
    message: string;
    action?: string;
    status?: string;
    ip_address?: string;
    details?: Record<string, unknown>;
    userId?: string;
}

/**
 * Centralized logger for EduNex.
 * Logs to both console and the system_logs table in Supabase.
 */
class Logger {
    private async getIp(): Promise<string> {
        try {
            const resp = await fetch('https://api.ipify.org?format=json');
            const data = await resp.json();
            return data.ip;
        } catch {
            return 'unknown';
        }
    }

    private async writeToDb(entry: LogEntry): Promise<void> {
        try {
            const ip = entry.ip_address || (await this.getIp());
            await supabase.from('system_logs').insert({
                level: entry.level,
                category: entry.category,
                message: entry.message,
                action: entry.action || 'system_event',
                status: entry.status || 'success',
                ip_address: ip,
                details: entry.details || {},
                user_id: entry.userId || null,
            });
        } catch (dbError) {
            // ─────────────────────────────────────────────────────────────
            // 📝 Author: Narco / Arth
            // 🔗 GitHub: https://github.com/ArthOfficial
            // 🌐 Website: https://arth-hub.vercel.app
            // © 2026 Arth — All rights reserved.
            // ─────────────────────────────────────────────────────────────
            console.warn('[Logger] Failed to write log to DB:', dbError);
        }
    }

    private formatConsole(entry: LogEntry): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.category}] ${entry.message}`;
    }

    async info(
        category: LogCategory,
        message: string,
        options: Partial<Omit<LogEntry, 'level' | 'category' | 'message'>> = {}
    ): Promise<void> {
        const entry: LogEntry = { level: 'info', category, message, ...options };
        console.log(this.formatConsole(entry), options.details || '');
        await this.writeToDb(entry);
    }

    async warn(
        category: LogCategory,
        message: string,
        options: Partial<Omit<LogEntry, 'level' | 'category' | 'message'>> = {}
    ): Promise<void> {
        const entry: LogEntry = { level: 'warn', category, message, ...options };
        console.warn(this.formatConsole(entry), options.details || '');
        await this.writeToDb(entry);
    }

    async error(
        category: LogCategory,
        message: string,
        options: Partial<Omit<LogEntry, 'level' | 'category' | 'message'>> = {}
    ): Promise<void> {
        const entry: LogEntry = { level: 'error', category, message, ...options };
        console.error(this.formatConsole(entry), options.details || '');
        await this.writeToDb(entry);
    }
}

export const logger = new Logger();
